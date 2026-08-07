import { ArrowUpRight, Camera, Heart } from "lucide-react";
import { INSTAGRAM_URL, INSTAGRAM_USER } from "@/lib/utils";
import SectionHeading from "./SectionHeading";

const placeholders = [
  { title: "Nuevos diseños", gradient: "from-brand-blue/50 to-brand-black" },
  { title: "Detrás de escena", gradient: "from-brand-blue/30 to-brand-black" },
  { title: "Proceso de impresión", gradient: "from-brand-blue/20 to-brand-black" },
  { title: "Novedades", gradient: "from-brand-blue/40 to-brand-black" },
  { title: "Próximamente", gradient: "from-brand-blue/20 to-brand-black" },
  { title: "Impresiones del mes", gradient: "from-brand-blue/45 to-brand-black" },
];

export default function InstagramFeed() {
  return (
    <section id="instagram" className="relative py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Instagram"
          title={`Seguinos en @${INSTAGRAM_USER}`}
          description="Novedades, ofertas y los trabajos más recientes, todos los días en nuestro perfil."
        />

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {placeholders.map((p) => (
            <a
              key={p.title}
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="group relative block overflow-hidden rounded-2xl border border-white/8"
            >
              <div
                className={`flex aspect-square w-full items-center justify-center bg-gradient-to-br ${p.gradient} transition-transform duration-500 group-hover:scale-105`}
              >
                <Camera className="h-7 w-7 text-white/40 transition-colors duration-300 group-hover:text-white/80" />
              </div>
              <div className="absolute inset-0 flex flex-col justify-between bg-black/40 p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p className="text-xs font-medium text-white">{p.title}</p>
                <div className="flex items-center gap-1.5 text-[11px] text-white">
                  <Heart className="h-3.5 w-3.5 fill-white" /> 12
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-brand-blue/50 hover:text-brand-blue"
          >
            <span className="grid h-5 w-5 place-items-center rounded-md bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 text-[10px] font-bold text-white">
              IG
            </span>
            Ver en Instagram
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
