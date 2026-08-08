import { clientIp, createLimiter, tooMany } from "./_rate-limit.js";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "taki3duy@gmail.com";
const FROM = process.env.RESEND_FROM || "TAKI3D Web <onboarding@resend.dev>";
const limitContact = createLimiter(5);

const json = (res, status, obj) => res.status(status).json(obj);

function parseBody(req) {
  if (typeof req.body === "object" && req.body !== null) return req.body;
  if (typeof req.body === "string") return JSON.parse(req.body);
  return {};
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  if (req.method !== "POST") return json(res, 405, { error: "Método no permitido" });

  const check = limitContact(clientIp(req));
  if (!check.ok) return tooMany(res, check.retryAfter, "Demasiados mensajes, esperá un momento");

  let body;
  try {
    body = parseBody(req);
  } catch {
    return json(res, 400, { error: "Cuerpo inválido" });
  }

  const name = String(body.name ?? "").trim().slice(0, 200);
  const email = String(body.email ?? "").trim().slice(0, 200);
  const message = String(body.message ?? "").trim().slice(0, 5000);

  if (!name || !email || !message) {
    return json(res, 400, { error: "Completá nombre, email y mensaje" });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json(res, 400, { error: "Email inválido" });
  }
  if (!RESEND_API_KEY) {
    return json(res, 503, { error: "Servicio de email no configurado" });
  }

  const subject = `Nuevo mensaje de ${name} — TAKI3D`;
  const text = [
    `Nombre: ${name}`,
    `Email: ${email}`,
    "",
    message,
    "",
    `Responder a: ${email}`,
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
      <p style="white-space: pre-wrap; color: #111827;">${escapeHtml(message)}</p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
      <p style="color: #6b7280; font-size: 13px;">Responder a: ${escapeHtml(email)}</p>
    </div>
  `;

  try {
    const resend = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [CONTACT_EMAIL],
        reply_to: email,
        subject,
        text,
        html,
      }),
    });
    if (!resend.ok) {
      const data = await resend.json().catch(() => ({}));
      return json(res, 502, { error: data?.message || "No se pudo enviar el mensaje" });
    }
    return json(res, 200, { ok: true });
  } catch {
    return json(res, 502, { error: "No se pudo enviar el mensaje" });
  }
}
