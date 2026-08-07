const MP_TOKEN = process.env.MP_ACCESS_TOKEN;
const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

function parseBody(req) {
  if (typeof req.body === "object" && req.body !== null) return req.body;
  if (typeof req.body === "string") return JSON.parse(req.body);
  return {};
}

async function redisCommand(...args) {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) throw new Error("UPSTASH_MISSING");
  const path = args.map((a) => encodeURIComponent(String(a))).join("/");
  const res = await fetch(`${UPSTASH_URL}/${path}`, {
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Redis error ${res.status}`);
  return data.result;
}

async function releaseStock(order) {
  for (const item of order.items || []) {
    if (item.stockMode !== "stock") continue;
    try {
      await redisCommand("incrby", `stock:${item.id}`, item.quantity);
    } catch {
      /* best effort */
    }
  }
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

  const paymentId = body?.data?.id;
  if (!paymentId) return res.status(200).json({ ok: true });

  let orderId = null;
  try {
    const ref = await redisCommand("get", `mp:${paymentId}`);
    if (ref) orderId = ref;
  } catch {
    /* redis sin configurar */
  }

  let status = null;
  if (!orderId && MP_TOKEN) {
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

  if (!orderId) return res.status(200).json({ ok: true });

  try {
    await redisCommand("set", `mp:${paymentId}`, orderId, "EX", "604800");
  } catch {
    /* best effort */
  }

  let order = null;
  try {
    const raw = await redisCommand("get", `order:${orderId}`);
    if (raw) order = JSON.parse(raw);
  } catch {
    /* best effort */
  }
  if (!order) return res.status(200).json({ ok: true });

  const current = order.status || "pending";

  if (status === "approved" && current === "pending") {
    order.status = "paid";
    order.paidAt = new Date().toISOString();
    order.mpPaymentId = paymentId;
    try {
      await redisCommand("set", `order:${orderId}`, JSON.stringify(order), "EX", "604800");
    } catch {
      /* best effort */
    }
  } else if (
    (status === "cancelled" || status === "rejected" || status === "refunded") &&
    current !== "paid"
  ) {
    if (current === "pending") await releaseStock(order);
    order.status = status === "refunded" ? "refunded" : "cancelled";
    order.cancelledAt = new Date().toISOString();
    try {
      await redisCommand("set", `order:${orderId}`, JSON.stringify(order), "EX", "604800");
    } catch {
      /* best effort */
    }
  }

  return res.status(200).json({ ok: true });
}
