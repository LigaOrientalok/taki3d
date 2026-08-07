export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) {
    return res.status(500).json({ error: "MercadoPago no configurado" });
  }

  let body;
  try {
    body =
      typeof req.body === "object" && req.body !== null
        ? req.body
        : JSON.parse(req.body || "{}");
  } catch {
    return res.status(400).json({ error: "Cuerpo inválido" });
  }

  const { items, payer, externalReference, delivery, backUrls } = body || {};

  if (!items || items.length === 0) {
    return res.status(400).json({ error: "Carrito vacío" });
  }

  const preference = {
    items: items.map((item) => ({
      id: String(item.id ?? ""),
      title: String(item.title ?? "Producto TAKI3D"),
      quantity: Number(item.quantity) || 1,
      unit_price: Number(item.unit_price) || 0,
      currency_id: "UYU",
    })),
    payer: {
      name: String(payer?.name ?? ""),
      email: String(payer?.email ?? ""),
      phone: { number: String(payer?.phone ?? "") },
    },
    external_reference: String(externalReference ?? ""),
    statement_descriptor: "TAKI3D",
    auto_return: "approved",
    back_urls: backUrls ?? {},
    metadata: {
      delivery: String(delivery ?? ""),
      source: "taki3d-web",
    },
  };

  let data;
  try {
    const mpRes = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(preference),
    });
    data = await mpRes.json().catch(() => ({}));
    if (!mpRes.ok) {
      return res.status(mpRes.status >= 400 ? mpRes.status : 502).json({
        error:
          typeof data.message === "string"
            ? data.message
            : "Error al crear la preferencia de pago",
      });
    }
  } catch {
    return res.status(502).json({ error: "Error al conectar con MercadoPago" });
  }

  if (!data.init_point) {
    return res.status(502).json({ error: "MercadoPago no devolvió un link de pago" });
  }

  return res.status(200).json({
    initPoint: data.init_point,
    preferenceId: data.id,
  });
}
