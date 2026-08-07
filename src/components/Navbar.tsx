import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { cn } from "@/lib/utils";

const links = [
  { href: "#inicio", label: "Inicio" },
  { href: "#servicios", label: "Servicios" },
  { href: "#galeria", label: "Galería" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#contacto", label: "Contacto" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[70] transition-all duration-500",
        scrolled
          ? "border-b border-white/5 bg-brand-black/70 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-18 max-w-6xl items-center justify-between px-6 py-3">
        <a href="#inicio" aria-label="TAKI3D - Inicio">
          <Logo theme="dark" className="h-8" />
        </a>

        <ul className="hidden items-center gap-9 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-zinc-400 transition-colors duration-300 hover:text-white"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contacto"
          className="hidden rounded-full bg-brand-blue px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-blue/25 transition-all duration-300 hover:bg-white hover:text-brand-black md:inline-flex"
        >
          Pedir Presupuesto
        </a>

        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          className="flex h-11 w-11 items-center justify-center rounded-full glass text-white md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-white/5 bg-brand-black/95 backdrop-blur-xl md:hidden"
          >
            <ul className="flex flex-col px-6 py-4">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 text-sm font-medium text-zinc-300 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="pt-3 pb-2">
                <a
                  href="#contacto"
                  onClick={() => setOpen(false)}
                  className="block rounded-full bg-brand-blue py-3 text-center text-sm font-semibold text-white"
                >
                  Pedir Presupuesto
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
