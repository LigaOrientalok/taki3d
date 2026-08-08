import { clientIp, createLimiter, tooMany } from "./_rate-limit.js";

const MP_TOKEN = process.env.MP_ACCESS_TOKEN;
const SANITY_PROJECT = process.env.VITE_SANITY_PROJECT_ID || "cwozgtvj";
const SANITY_DATASET = process.env.VITE_SANITY_DATASET || "production";
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const limitOrder = createLimiter(10);

const json = (res, status, obj) => res.status(status).json(obj);

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
    err.details = data?.details || "";
    throw err;
  }
  return data;
}

async function patchOrder(id, fields) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/orders?id=eq.${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(fields),
    },
  );
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const err = new Error(data?.message || `Supabase ${res.status}`);
    err.code = data?.code || res.status;
    throw err;
  }
}

async function fetchSanityProducts() {
  const query = encodeURIComponent(
    '*[_type == "product"] { _id, title, "slug": slug.current, price, stockMode, quantity }',
  );
  const res = await fetch(
    `https://${SANITY_PROJECT}.apicdn.sanity.io/v2024-01-01/data/query/${SANITY_DATASET}?query=${query}`,
  );
  if (!res.ok) throw new Error("Sanity error");
  const data = await res.json();
  return data.result || [];
}

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  if (req.method !== "POST") return json(res, 405, { error: "Método no permitido" });

  const check = limitOrder(clientIp(req));
  if (!check.ok) return tooMany(res, check.retryAfter, "Demasiados pedidos, esperá un momento");

  let body;
  try {
    body = parseBody(req);
  } catch {
    return json(res, 400, { error: "Cuerpo inválido" });
  }

  const { items, payer, delivery, address, notes, backUrls, paymentMethod } = body || {};
  if (!items || !Array.isArray(items) || items.length === 0) {
    return json(res, 400, { error: "Carrito vacío" });
  }

  let catalog;
  try {
    catalog = await fetchSanityProducts();
  } catch {
    return json(res, 502, { error: "No se pudo validar el catálogo" });
  }
  const byId = new Map(catalog.map((p) => [p._id, p]));

  const normalized = items.map((item) => {
    const prod = byId.get(item.id);
    if (!prod) throw new Error(`Producto inválido: ${item.title}`);
    const qty = Math.floor(Number(item.quantity)) || 0;
    if (qty <= 0 || qty > 99) throw new Error("Cantidad inválida");
    if (Number(item.unit_price) !== Number(prod.price)) {
      throw new Error(`El precio de "${prod.title}" cambió, actualizá tu carrito`);
    }
    return {
      id: prod._id,
      title: prod.title,
      quantity: qty,
      unit_price: Number(prod.price),
      stockMode: prod.stockMode === "stock" ? "stock" : "pedido",
    };
  });

  const orderId = `TK-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;
  const method = paymentMethod === "whatsapp" ? "whatsapp" : "mp";
  const payload = {
    order_id: orderId,
    items: normalized,
    payer_name: String(payer?.name ?? ""),
    payer_email: String(payer?.email ?? ""),
    payer_phone: String(payer?.phone ?? ""),
    delivery: String(delivery ?? "retiro"),
    address: String(address ?? ""),
    notes: String(notes ?? ""),
    payment_method: method,
    mp_preference_id: null,
  };

  let initPoint = null;

  // WhatsApp: sin MercadoPago, solo registrar el pedido y reservar stock.
  if (method === "whatsapp") {
    if (!supabaseReady()) {
      return json(res, 200, { initPoint: null, orderId });
    }
    try {
      await rpc("place_order", { p_payload: payload });
    } catch (err) {
      if (err.message && err.message.startsWith("STOCK_INSUFICIENTE")) {
        return json(res, 409, { error: "No queda stock suficiente de uno de los productos" });
      }
      return json(res, 503, { error: "No se pudo registrar el pedido, probá de nuevo" });
    }
    return json(res, 200, { initPoint: null, orderId });
  }

  // MercadoPago: reservar primero, luego crear la preferencia.
  if (!MP_TOKEN) return json(res, 500, { error: "MercadoPago no configurado" });

  if (supabaseReady()) {
    try {
      await rpc("place_order", { p_payload: payload });
    } catch (err) {
      if (err.message && err.message.startsWith("STOCK_INSUFICIENTE")) {
        return json(res, 409, { error: "No queda stock suficiente de uno de los productos" });
      }
      return json(res, 503, { error: "No se pudo registrar el pedido, probá de nuevo" });
    }
  }

  const preference = {
    items: normalized.map((i) => ({
      id: String(i.id),
      title: String(i.title),
      quantity: i.quantity,
      unit_price: i.unit_price,
      currency_id: "UYU",
    })),
    payer: {
      name: String(payer?.name ?? ""),
      email: String(payer?.email ?? ""),
      phone: { number: String(payer?.phone ?? "") },
    },
    external_reference: orderId,
    statement_descriptor: "TAKI3D",
    auto_return: "approved",
    back_urls: backUrls ?? {},
    metadata: { delivery: String(delivery ?? ""), source: "taki3d-web" },
  };

  let preferenceId = null;
  try {
    const mpRes = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${MP_TOKEN}` },
      body: JSON.stringify(preference),
    });
    const data = await mpRes.json().catch(() => ({}));
    if (!mpRes.ok || !data.init_point) {
      if (supabaseReady()) {
        try {
          await rpc("cancel_order", { p_order_id: orderId, p_status: "cancelled" });
        } catch {
          /* best effort */
        }
      }
      return json(res, 502, {
        error: typeof data.message === "string" ? data.message : "Error al crear el pago",
      });
    }
    initPoint = data.init_point;
    preferenceId = data.id;
  } catch {
    if (supabaseReady()) {
      try {
        await rpc("cancel_order", { p_order_id: orderId, p_status: "cancelled" });
      } catch {
        /* best effort */
      }
    }
    return json(res, 502, { error: "Error al conectar con MercadoPago" });
  }

  if (supabaseReady()) {
    try {
      await patchOrder(orderId, { mp_preference_id: preferenceId });
    } catch {
      /* best effort: no bloquea el pago */
    }
  }

  return json(res, 200, { initPoint, orderId });
}
