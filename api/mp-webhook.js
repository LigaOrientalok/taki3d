import { createHmac, timingSafeEqual } from "node:crypto";

const MP_TOKEN = process.env.MP_ACCESS_TOKEN;
const MP_WEBHOOK_SECRET = process.env.MP_WEBHOOK_SECRET;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

function parseBody(req) {
  if (typeof req.body === "object" && req.body !== null) return req.body;
  if (typeof req.body === "string") return JSON.parse(req.body);
  return {};
}

function supabaseReady() {
  return Boolean(SUPABASE_URL && SUPABASE_SERVICE_KEY);
}

async function rpc(name, params) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data?.message || `Supabase ${res.status}`);
    err.code = data?.code || res.status;
    throw err;
  }
  return data;
}

function secureEqual(expected, actual) {
  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(actual, "hex");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

// Valida la firma de MercadoPago: headers x-signature (ts=...,v1=...) y
// x-request-id + el id del pago en el body. Devuelve true/false, o null si
// no hay secret configurado (modo sin verificar).
function validSignature(req, body) {
  if (!MP_WEBHOOK_SECRET) return null;
  const xSignature = req.headers["x-signature"];
  const xRequestId = req.headers["x-request-id"];
  if (!xSignature || !xRequestId) return false;

  const parts = {};
  xSignature.split(",").forEach((pair) => {
    const eq = pair.indexOf("=");
    if (eq > 0) parts[pair.slice(0, eq).trim()] = pair.slice(eq + 1);
  });

  const ts = parts.ts;
  const v1 = parts.v1;
  if (!ts || !v1) return false;

  // Ventana de 10 minutos para evitar replay de notificaciones viejas.
  if (Math.abs(Date.now() / 1000 - Number(ts)) > 600) return false;

  const dataId = body?.data?.id;
  if (!dataId) return false;

  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
  const expected = createHmac("sha256", MP_WEBHOOK_SECRET)
    .update(manifest)
    .digest("hex");

  return secureEqual(expected, v1);
}

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });

  let body;
  try {
    body = parseBody(req);
  } catch {
    return res.status(200).json({ ok: true });
  }

  const verified = validSignature(req, body);
  if (verified === false) {
    return res.status(403).json({ error: "Firma inválida" });
  }

  const paymentId = body?.data?.id;
  if (!paymentId) return res.status(200).json({ ok: true });

  let orderId = null;
  let status = null;

  if (MP_TOKEN) {
    try {
      const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: { Authorization: `Bearer ${MP_TOKEN}` },
      });
      const data = await mpRes.json().catch(() => ({}));
      if (mpRes.ok) {
        status = data.status;
        orderId = data.external_reference || null;
      }
    } catch {
      /* best effort */
    }
  }

  if (!orderId || !status) return res.status(200).json({ ok: true });
  if (!supabaseReady()) return res.status(200).json({ ok: true });

  try {
    if (status === "approved") {
      await rpc("confirm_order", { p_order_id: orderId, p_payment_id: String(paymentId) });
    } else if (status === "cancelled" || status === "rejected") {
      await rpc("cancel_order", { p_order_id: orderId, p_status: "cancelled" });
    } else if (status === "refunded") {
      await rpc("cancel_order", { p_order_id: orderId, p_status: "refunded" });
    }
  } catch {
    /* idempotente: NOT_FOUND / ALREADY_PAID se ignoran */
  }

  return res.status(200).json({ ok: true });
}
