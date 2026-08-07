const MP_TOKEN = process.env.MP_ACCESS_TOKEN;
const SANITY_PROJECT = process.env.VITE_SANITY_PROJECT_ID || "cwozgtvj";
const SANITY_DATASET = process.env.VITE_SANITY_DATASET || "production";
const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

const json = (res, status, obj) => res.status(status).json(obj);

function parseBody(req) {
  if (typeof req.body === "object" && req.body !== null) return req.body;
  if (typeof req.body === "string") return JSON.parse(req.body);
  return {};
}

function redisBase() {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) throw new Error("UPSTASH_MISSING");
  return UPSTASH_URL;
}

async function redisCommand(...args) {
  const path = args.map((a) => encodeURIComponent(String(a))).join("/");
  const res = await fetch(`${redisBase()}/${path}`, {
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Redis error ${res.status}`);
  return data.result;
}

const RESERVE_SCRIPT =
  "local q=tonumber(ARGV[1]);local fallback=tonumber(ARGV[2]);local n=tonumber(redis.call('GET',KEYS[1]));if not n then n=fallback end;if n<q then return -1 end;redis.call('DECRBY',KEYS[1],q);return n-q";

async function reserveStock(id, qty, fallback) {
  const path = [
    encodeURIComponent(RESERVE_SCRIPT),
    "1",
    encodeURIComponent(`stock:${id}`),
    String(qty),
    String(fallback),
  ].join("/");
  const res = await fetch(`${redisBase()}/eval/${path}`, {
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error("Redis eval error");
  return Number(data.result);
}

async function releaseStock(reserved) {
  for (const r of reserved) {
    try {
      await redisCommand("incrby", `stock:${r.id}`, r.qty);
    } catch {
      /* best effort */
    }
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

  for (const item of items) {
    const prod = byId.get(item.id);
    if (!prod) return json(res, 400, { error: `Producto inválido: ${item.title}` });
    const qty = Math.floor(Number(item.quantity)) || 0;
    if (qty <= 0 || qty > 99) return json(res, 400, { error: "Cantidad inválida" });
    if (Number(item.unit_price) !== Number(prod.price)) {
      return json(res, 400, { error: `El precio de "${prod.title}" cambió, actualizá tu carrito` });
    }
    if (prod.stockMode === "stock" && qty > Number(prod.quantity)) {
      return json(res, 409, { error: `Stock insuficiente de "${prod.title}"` });
    }
  }

  const orderId = `TK-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;
  const upstashReady = Boolean(UPSTASH_URL && UPSTASH_TOKEN);
  const reserved = [];

  if (upstashReady) {
    try {
      for (const item of items) {
        const prod = byId.get(item.id);
        if (prod.stockMode !== "stock") continue;
        const fallback = Number(prod.quantity) || 0;
        const left = await reserveStock(item.id, item.quantity, fallback);
        if (left < 0) {
          await releaseStock(reserved);
          return json(res, 409, { error: `No queda stock suficiente de "${prod.title}"` });
        }
        reserved.push({ id: item.id, qty: item.quantity });
      }
    } catch {
      return json(res, 503, { error: "Servicio de stock no disponible, probá de nuevo" });
    }
  }

  const total = items.reduce(
    (sum, i) => sum + Number(i.unit_price) * Number(i.quantity),
    0,
  );
  const order = {
    id: orderId,
    items: items.map((i) => ({
      id: i.id,
      title: i.title,
      quantity: i.quantity,
      unit_price: Number(i.unit_price),
      stockMode: (byId.get(i.id) || {}).stockMode || "pedido",
    })),
    payer: {
      name: String(payer?.name ?? ""),
      email: String(payer?.email ?? ""),
      phone: String(payer?.phone ?? ""),
    },
    delivery: String(delivery ?? "retiro"),
    address: String(address ?? ""),
    notes: String(notes ?? ""),
    total,
    paymentMethod: paymentMethod === "whatsapp" ? "whatsapp" : "mp",
    status: "pending",
    createdAt: new Date().toISOString(),
    paidAt: null,
  };

  let initPoint = null;

  if (order.paymentMethod === "mp") {
    if (!MP_TOKEN) {
      if (upstashReady) await releaseStock(reserved);
      return json(res, 500, { error: "MercadoPago no configurado" });
    }
    const preference = {
      items: items.map((i) => ({
        id: String(i.id),
        title: String(i.title),
        quantity: Number(i.quantity),
        unit_price: Number(i.unit_price),
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
    try {
      const mpRes = await fetch("https://api.mercadopago.com/checkout/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${MP_TOKEN}` },
        body: JSON.stringify(preference),
      });
      const data = await mpRes.json().catch(() => ({}));
      if (!mpRes.ok || !data.init_point) {
        if (upstashReady) await releaseStock(reserved);
        return json(res, 502, {
          error: typeof data.message === "string" ? data.message : "Error al crear el pago",
        });
      }
      initPoint = data.init_point;
      order.mpPreferenceId = data.id;
    } catch {
      if (upstashReady) await releaseStock(reserved);
      return json(res, 502, { error: "Error al conectar con MercadoPago" });
    }
  }

  if (upstashReady) {
    try {
      await redisCommand("set", `order:${orderId}`, JSON.stringify(order), "EX", "604800");
      await redisCommand("zadd", "orders:all", String(Date.now()), orderId);
    } catch {
      if (order.paymentMethod === "whatsapp") await releaseStock(reserved);
      return json(res, 503, { error: "No se pudo registrar el pedido, probá de nuevo" });
    }
  }

  return json(res, 200, { initPoint, orderId });
}
