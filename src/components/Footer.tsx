import { Mail } from "lucide-react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import { CONTACT_EMAIL, INSTAGRAM_URL, WHATSAPP_URL } from "@/lib/utils";

const links = [
  { href: "#inicio", label: "Inicio", route: false },
  { href: "#servicios", label: "Servicios", route: false },
  { href: "#galeria", label: "Galería", route: false },
  { href: "#nosotros", label: "Nosotros", route: false },
  { href: "/tienda", label: "Tienda", route: true },
  { href: "#contacto", label: "Contacto", route: false },
];

const socials = [
  { href: WHATSAPP_URL, label: "WhatsApp", icon: FaWhatsapp },
  { href: INSTAGRAM_URL, label: "Instagram", icon: FaInstagram },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-brand-gray/20">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo theme="dark" className="h-9" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-zinc-500">
              Transformamos tus ideas en realidad con impresión 3D profesional en
              Uruguay.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full glass text-zinc-400 transition-all duration-300 hover:border-brand-blue/50 hover:text-brand-blue"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <nav>
            <h4 className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
              Menú
            </h4>
            <ul className="mt-5 space-y-3">
              {links.map((link) => (
                <li key={link.href}>
                  {link.route ? (
                    <Link
                      to={link.href}
                      className="text-sm text-zinc-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="text-sm text-zinc-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
              Contacto
            </h4>
            <ul className="mt-5 space-y-3 text-sm text-zinc-400">
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="inline-flex items-center gap-2 transition-colors hover:text-white"
                >
                  <Mail className="h-4 w-4 text-brand-blue" />
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition-colors hover:text-white"
                >
                  <FaWhatsapp className="h-4 w-4 text-brand-green" />
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition-colors hover:text-white"
                >
                  <FaInstagram className="h-4 w-4 text-brand-blue" />
                  @taki.3d.uy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-7 sm:flex-row">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} TAKI3D · Todos los derechos reservados.
          </p>
          <p className="text-xs text-zinc-600">Justo Alonso González 3283, Montevideo · Uruguay</p>
        </div>
      </div>
    </footer>
  );
}
