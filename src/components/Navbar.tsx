import { AnimatePresence, motion } from "framer-motion";
import { Menu, ShoppingCart, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

const links = [
  { href: "#inicio", label: "Inicio", route: false },
  { href: "#servicios", label: "Servicios", route: false },
  { href: "#galeria", label: "Galería", route: false },
  { href: "#nosotros", label: "Nosotros", route: false },
  { href: "/tienda", label: "Tienda", route: true },
  { href: "#contacto", label: "Contacto", route: false },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { count, openCart } = useCart();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const onSection = (e: React.MouseEvent, href: string) => {
    if (pathname === "/") return;
    e.preventDefault();
    navigate(`/${href}`);
  };

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
        <a
          href="#inicio"
          aria-label="TAKI3D - Inicio"
          onClick={(e) => onSection(e, "#inicio")}
        >
          <Logo theme="dark" className="h-8" />
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              {link.route ? (
                <Link
                  to={link.href}
                  className="text-sm font-medium text-zinc-400 transition-colors duration-300 hover:text-white"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  href={link.href}
                  onClick={(e) => onSection(e, link.href)}
                  className="text-sm font-medium text-zinc-400 transition-colors duration-300 hover:text-white"
                >
                  {link.label}
                </a>
              )}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <button
            onClick={openCart}
            aria-label="Abrir carrito"
            className="relative grid h-11 w-11 place-items-center rounded-full glass text-white transition-colors hover:border-brand-blue/50 hover:text-brand-blue"
          >
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-brand-blue px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </button>
          <a
            href="#contacto"
            onClick={(e) => onSection(e, "#contacto")}
            className="hidden rounded-full bg-brand-blue px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-blue/25 transition-all duration-300 hover:bg-white hover:text-brand-black lg:inline-flex"
          >
            Pedir Presupuesto
          </a>
        </div>

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
                  {link.route ? (
                    <Link
                      to={link.href}
                      onClick={() => setOpen(false)}
                      className="block py-3 text-sm font-medium text-zinc-300 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      onClick={(e) => {
                        onSection(e, link.href);
                        setOpen(false);
                      }}
                      className="block py-3 text-sm font-medium text-zinc-300 transition-colors hover:text-white"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
              <li className="pt-3 pb-2">
                <a
                  href="#contacto"
                  onClick={(e) => {
                    onSection(e, "#contacto");
                    setOpen(false);
                  }}
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
