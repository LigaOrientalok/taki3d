const ADMIN_KEY = process.env.ADMIN_KEY;
const SANITY_PROJECT = process.env.VITE_SANITY_PROJECT_ID || "cwozgtvj";
const SANITY_DATASET = process.env.VITE_SANITY_DATASET || "production";
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

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

function supabaseReady() {
  return Boolean(SUPABASE_URL && SUPABASE_SERVICE_KEY);
}

async function supaGet(path) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data?.message || `Supabase ${res.status}`);
    err.code = data?.code || res.status;
    throw err;
  }
  return data;
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

async function patchProduct(id, fields) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/products?id=eq.${encodeURIComponent(id)}`,
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
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data?.message || `Supabase ${res.status}`);
    err.code = data?.code || res.status;
    throw err;
  }
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

  if (!authorized(req)) return json(res, 401, { error: "No autorizado" });
  if (!supabaseReady()) return json(res, 503, { error: "Base de datos no configurada" });

  if (req.method === "GET") {
    try {
      const [orders, products] = await Promise.all([
        supaGet("orders?select=*,order_items(*)&order=created_at.desc"),
        supaGet("products?select=id,title,stock_mode,quantity"),
      ]);
      const stock = {};
      products.forEach((p) => {
        if (p.stock_mode === "stock") stock[p.id] = p.quantity;
      });
      return json(res, 200, { orders, stock, products });
    } catch {
      return json(res, 503, { error: "No se pudieron cargar los pedidos" });
    }
  }

  if (req.method === "POST") {
    let body;
    try {
      body = parseBody(req);
    } catch {
      return json(res, 400, { error: "Cuerpo inválido" });
    }

    const { action } = body || {};

    if (action === "cancel") {
      const { id } = body;
      if (!id) return json(res, 400, { error: "Falta el id del pedido" });
      try {
        await rpc("cancel_order", { p_order_id: id, p_status: "cancelled" });
        return json(res, 200, { ok: true });
      } catch (err) {
        if (err.code === "P0001" && err.message?.includes("ALREADY_PAID")) {
          return json(res, 409, { error: "El pedido ya fue pagado" });
        }
        if (err.message?.includes("NOT_FOUND")) {
          return json(res, 404, { error: "Pedido no encontrado" });
        }
        return json(res, 503, { error: "No se pudo cancelar el pedido" });
      }
    }

    if (action === "sync") {
      try {
        const catalog = await fetchSanityProducts();
        for (const p of catalog) {
          await rpc("sync_product", {
            p_id: p._id,
            p_title: p.title,
            p_price: Number(p.price),
            p_stock_mode: p.stockMode === "stock" ? "stock" : "pedido",
            p_qty: Number(p.quantity) || 0,
          });
        }
        return json(res, 200, { ok: true, synced: catalog.length });
      } catch {
        return json(res, 502, { error: "No se pudo sincronizar el catálogo" });
      }
    }

    if (action === "set-stock") {
      const { productId, quantity } = body;
      if (!productId) return json(res, 400, { error: "Falta el producto" });
      const qty = Math.max(0, Math.floor(Number(quantity) || 0));
      try {
        await patchProduct(productId, { quantity: qty });
        return json(res, 200, { ok: true });
      } catch {
        return json(res, 503, { error: "No se pudo actualizar el stock" });
      }
    }

    return json(res, 400, { error: "Acción inválida" });
  }

  return json(res, 405, { error: "Método no permitido" });
}
