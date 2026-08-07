import type { ReactNode } from "react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const services = [
  {
    icon: "cube",
    title: "Escultura y modelado 3D",
    description:
      "Modelamos tus personajes, ideas o mascotas desde cero con un nivel de detalle impresionante.",
  },
  {
    icon: "printer",
    title: "Impresión 3D",
    description:
      "Impresión en alta resolución con resinas y materiales premium para lograr acabados finos y duraderos.",
  },
  {
    icon: "brush",
    title: "Pintura y acabados",
    description:
      "Pintura artesanal con técnicas profesionales: sombreado, degradados, ojos y efectos de alto realismo.",
  },
  {
    icon: "pen",
    title: "Diseño personalizado",
    description:
      "¿Tienes una idea en mente? Te ayudamos a llevarla del concepto a un modelo 3D listo para imprimir.",
  },
  {
    icon: "spark",
    title: "Figuras coleccionables",
    description:
      "Ediciones únicas y series limitadas para coleccionistas que buscan piezas exclusivas y de calidad.",
  },
  {
    icon: "truck",
    title: "Envíos a todo el mundo",
    description:
      "Empaque cuidadoso y envío asegurado para que tu figura llegue en perfectas condiciones.",
  },
];

const icons: Record<string, (className: string) => ReactNode> = {
  cube: (c) => (
    <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l9 5-9 5-9-5 9-5Z" />
      <path d="M3 8v8l9 5 9-5V8" />
    </svg>
  ),
  printer: (c) => (
    <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9V3h12v6" />
      <rect x="3" y="9" width="18" height="8" rx="2" />
      <path d="M6 14h12v7H6z" />
    </svg>
  ),
  brush: (c) => (
    <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 4l6 6-9 9H5v-6l9-9Z" />
      <path d="M12 6l6 6" />
      <path d="M5 19c-1.5.5-2 2-1.5 2 .5.5 2 0 2.5-1.5" />
    </svg>
  ),
  pen: (c) => (
    <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
    </svg>
  ),
  spark: (c) => (
    <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2Z" />
    </svg>
  ),
  truck: (c) => (
    <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 5h14v12H1z" />
      <path d="M15 9h4l3 4v4h-7V9Z" />
      <circle cx="6" cy="19" r="2" />
      <circle cx="18" cy="19" r="2" />
    </svg>
  ),
};

const cardGradients = [
  "from-violet-500/20 to-violet-500/0",
  "from-cyan-500/20 to-cyan-500/0",
  "from-fuchsia-500/20 to-fuchsia-500/0",
  "from-emerald-500/20 to-emerald-500/0",
  "from-orange-500/20 to-orange-500/0",
  "from-sky-500/20 to-sky-500/0",
];

export default function Services() {
  return (
    <section id="servicios" className="relative py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Servicios"
            title="Todo lo que tu figura necesita"
            description="Del boceto a la vitrina: un servicio integral para crear figuras 3D únicas, hechas a la medida de tus sueños."
          />
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <Reveal key={service.title} delay={i * 80}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition-colors hover:border-white/20 hover:bg-white/[0.06]">
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${cardGradients[i]} opacity-0 transition-opacity group-hover:opacity-100`}
                />
                <div className="relative">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-violet-500/30 to-cyan-500/20 text-cyan-300">
                    {icons[service.icon]("h-6 w-6")}
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {service.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-zinc-400">
                    {service.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
