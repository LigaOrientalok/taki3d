const SANITY_PROJECT = process.env.VITE_SANITY_PROJECT_ID || "cwozgtvj";
const SANITY_DATASET = process.env.VITE_SANITY_DATASET || "production";
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

const json = (res, status, obj) => res.status(status).json(obj);

async function fetchSanityProducts() {
  const query = encodeURIComponent(
    '*[_type == "product"] { _id, price, stockMode, quantity }',
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

  const live = {};
  if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
    try {
      const res2 = await fetch(
        `${SUPABASE_URL}/rest/v1/products?select=id,stock_mode,quantity`,
        {
          headers: {
            apikey: SUPABASE_SERVICE_KEY,
            Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
          },
        },
      );
      const rows = await res2.json().catch(() => []);
      if (res2.ok) {
        rows.forEach((r) => {
          live[r.id] = r.quantity;
        });
      }
    } catch {
      /* fallback a Sanity */
    }
  }

  const result = {};
  catalog.forEach((p) => {
    result[p._id] = {
      stockMode: p.stockMode,
      quantity: p.stockMode === "stock" ? (live[p._id] ?? Number(p.quantity)) : null,
    };
  });

  return json(res, 200, { products: result });
}
