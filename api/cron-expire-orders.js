const CRON_SECRET = process.env.CRON_SECRET;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

const json = (res, status, obj) => res.status(status).json(obj);

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

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  if (req.method !== "POST") return json(res, 405, { error: "Método no permitido" });

  const auth = req.headers.authorization || "";
  if (!CRON_SECRET || auth !== `Bearer ${CRON_SECRET}`) {
    return json(res, 401, { error: "No autorizado" });
  }
  if (!supabaseReady()) return json(res, 503, { error: "Base de datos no configurada" });

  try {
    const result = await rpc("expire_pending_orders", { p_age_hours: 24 });
    return json(res, 200, { ok: true, cancelled: result.cancelled ?? 0 });
  } catch {
    return json(res, 502, { error: "No se pudieron expirar los pedidos" });
  }
}
