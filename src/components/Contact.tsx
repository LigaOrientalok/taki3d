import { AtSign, Check, Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import { CONTACT_EMAIL, INSTAGRAM_URL, INSTAGRAM_USER, WHATSAPP_URL } from "@/lib/utils";
import SectionHeading from "./SectionHeading";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: CONTACT_EMAIL,
    href: `mailto:${CONTACT_EMAIL}`,
  },
  {
    icon: Phone,
    label: "WhatsApp",
    value: "099 123 456",
    href: WHATSAPP_URL,
  },
  {
    icon: AtSign,
    label: "Instagram",
    value: `@${INSTAGRAM_USER}`,
    href: INSTAGRAM_URL,
  },
  {
    icon: MapPin,
    label: "Ubicación",
    value: "Montevideo, Uruguay",
    href: "https://maps.google.com/?q=Montevideo,Uruguay",
  },
];

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section id="contacto" className="relative py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Contacto"
          title="Contanos tu idea, la hacemos realidad"
          description="Respondemos en menos de 24 horas. Presupuestos sin cargo y sin compromiso."
        />

        <div className="mt-16 grid gap-10 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            {contactInfo.map((info) => (
              <a
                key={info.label}
                href={info.href}
                target={info.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-white/8 bg-white/[0.03] p-5 transition-all duration-300 hover:border-brand-blue/40 hover:bg-white/[0.05]"
              >
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-blue/10 text-brand-blue transition-colors duration-300 group-hover:bg-brand-blue group-hover:text-white">
                  <info.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500">{info.label}</p>
                  <p className="mt-0.5 text-sm font-medium text-white">
                    {info.value}
                  </p>
                </div>
              </a>
            ))}

            <div className="flex items-center gap-3 rounded-2xl border border-brand-green/20 bg-brand-green/5 p-5 text-sm text-brand-green">
              <Clock className="h-5 w-5 shrink-0" />
              <p>Respondemos los 7 días de la semana, de 9:00 a 20:00 hs.</p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/8">
              <iframe
                title="Ubicación de TAKI3D en Montevideo"
                src="https://maps.google.com/maps?q=Montevideo%2C%20Uruguay&t=&z=12&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="220"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale-[50%] invert-[90%] hue-rotate-180"
              />
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-8 backdrop-blur-sm">
              {sent ? (
                <div className="flex h-full min-h-[360px] flex-col items-center justify-center text-center">
                  <div className="grid h-16 w-16 place-items-center rounded-full bg-brand-green/10 text-brand-green">
                    <Check className="h-8 w-8" />
                  </div>
                  <h3 className="mt-6 font-display text-2xl font-semibold text-white">
                    ¡Mensaje enviado!
                  </h3>
                  <p className="mt-2 max-w-sm text-zinc-400">
                    Gracias por escribirnos. Te vamos a responder a la brevedad.
                    Si es urgente, escribinos por{" "}
                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-brand-blue hover:underline"
                    >
                      WhatsApp
                    </a>
                    .
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="name"
                        className="mb-2 block text-sm font-medium text-zinc-400"
                      >
                        Nombre *
                      </label>
                      <input
                        id="name"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Tu nombre"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-medium text-zinc-400"
                      >
                        Email *
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="tu@email.com"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="mb-2 block text-sm font-medium text-zinc-400"
                    >
                      Contanos tu idea *
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={6}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Ej: quiero una figura de mi mascota de 10cm, o 20 llaveros con el logo de mi empresa..."
                      className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-blue px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-blue/25 transition-all duration-300 hover:bg-white hover:text-brand-black sm:w-auto"
                  >
                    Enviar mensaje
                    <Send className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
