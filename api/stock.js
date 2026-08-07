const SANITY_PROJECT = process.env.VITE_SANITY_PROJECT_ID || "cwozgtvj";
const SANITY_DATASET = process.env.VITE_SANITY_DATASET || "production";
const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

const json = (res, status, obj) => res.status(status).json(obj);

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

async function fetchSanityProducts() {
  const query = encodeURIComponent(
    '*[_type == "product"] { _id, title, price, stockMode, quantity }',
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
  res.setHeader("Cache-Control", "public, max-age=30, s-maxage=30");
  if (req.method !== "GET") return json(res, 405, { error: "Método no permitido" });

  let catalog;
  try {
    catalog = await fetchSanityProducts();
  } catch {
    return json(res, 502, { error: "No se pudo consultar el catálogo" });
  }

  const stockItems = catalog.filter((p) => p.stockMode === "stock");
  let live = {};

  if (UPSTASH_URL && UPSTASH_TOKEN) {
    try {
      const keys = stockItems.map((p) => `stock:${p._id}`);
      const values = keys.length > 0 ? await redisCommand("mget", ...keys) : [];
      stockItems.forEach((p, i) => {
        live[p._id] = values[i] === null ? Number(p.quantity) : Number(values[i]);
      });
    } catch {
      stockItems.forEach((p) => {
        live[p._id] = Number(p.quantity);
      });
    }
  } else {
    stockItems.forEach((p) => {
      live[p._id] = Number(p.quantity);
    });
  }

  const result = {};
  catalog.forEach((p) => {
    result[p._id] = {
      stockMode: p.stockMode,
      quantity: p.stockMode === "stock" ? live[p._id] : null,
    };
  });

  return json(res, 200, { products: result });
}
