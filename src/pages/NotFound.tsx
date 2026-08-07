import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-32 text-center">
      <Logo variant="isotipo" className="h-16 w-16" />
      <p className="mt-8 font-display text-7xl font-bold text-white">
        4<span className="text-brand-blue">0</span>4
      </p>
      <h1 className="mt-4 font-display text-2xl font-semibold text-white">
        Página no encontrada
      </h1>
      <p className="mt-3 max-w-md text-zinc-500">
        La página que buscás no existe o fue movida. Volvé al inicio para seguir
        explorando.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-brand-black"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al inicio
      </Link>
    </section>
  );
}
