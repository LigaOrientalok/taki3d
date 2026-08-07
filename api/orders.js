const ADMIN_KEY = process.env.ADMIN_KEY;
const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

const json = (res, status, obj) => res.status(status).json(obj);

function authorized(req) {
  const header = req.headers?.authorization || "";
  const key = header.startsWith("Bearer ") ? header.slice(7) : String(req.query?.key || "");
  return ADMIN_KEY && key === ADMIN_KEY;
}

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

async function listOrders() {
  const ids = (await redisCommand("zrange", "orders:all", "0", "-1")) || [];
  if (ids.length === 0) return [];
  const raws = (await redisCommand("mget", ...ids.map((id) => `order:${id}`))) || [];
  const orders = raws
    .filter(Boolean)
    .map((r) => {
      try {
        return JSON.parse(r);
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return orders;
}

async function getStockMap(orders) {
  const productIds = [
    ...new Set(
      orders.flatMap((o) => (o.items || []).filter((i) => i.stockMode === "stock").map((i) => i.id)),
    ),
  ];
  if (productIds.length === 0) return {};
  const keys = productIds.map((id) => `stock:${id}`);
  const values = (await redisCommand("mget", ...keys)) || [];
  const map = {};
  productIds.forEach((id, i) => {
    map[id] = values[i] === null ? null : Number(values[i]);
  });
  return map;
}

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  if (!authorized(req)) return json(res, 401, { error: "No autorizado" });

  if (req.method === "GET") {
    try {
      const orders = await listOrders();
      const stock = await getStockMap(orders);
      return json(res, 200, { orders, stock });
    } catch {
      return json(res, 503, { error: "Almacén no disponible" });
    }
  }

  if (req.method === "POST") {
    let body;
    try {
      body = parseBody(req);
    } catch {
      return json(res, 400, { error: "Cuerpo inválido" });
    }
    const { id, action } = body || {};
    if (!id || action !== "cancel") return json(res, 400, { error: "Acción inválida" });

    try {
      const raw = await redisCommand("get", `order:${id}`);
      if (!raw) return json(res, 404, { error: "Pedido no encontrado" });
      const order = JSON.parse(raw);
      if (order.status === "paid") return json(res, 409, { error: "El pedido ya fue pagado" });
      if (order.status !== "cancelled") {
        for (const item of order.items || []) {
          if (item.stockMode === "stock") {
            await redisCommand("incrby", `stock:${item.id}`, item.quantity);
          }
        }
        order.status = "cancelled";
        order.cancelledAt = new Date().toISOString();
        await redisCommand("set", `order:${id}`, JSON.stringify(order), "EX", "604800");
      }
      return json(res, 200, { ok: true, order });
    } catch {
      return json(res, 503, { error: "Almacén no disponible" });
    }
  }

  return json(res, 405, { error: "Método no permitido" });
}
