import { CheckCircle2, Quote, Settings2, Truck, Wallet } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const commitments = [
  "Diseño 3D a medida, con ajustes ilimitados hasta que quede perfecto",
  "Materiales premium: PLA, PETG, ABS y resina",
  "Acabados prolijos: lijado, pulido y pintura",
  "Atención 100% personalizada, de persona a persona",
];

const highlights = [
  {
    icon: Settings2,
    title: "Taller propio",
    text: "Diseñamos e imprimimos en nuestro taller de Montevideo, de principio a fin.",
  },
  {
    icon: Truck,
    title: "Envío a todo el país",
    text: "Retirá en el taller o coordinamos entrega en cualquier parte de Uruguay.",
  },
  {
    icon: Wallet,
    title: "Presupuesto sin cargo",
    text: "Consultá tu idea sin costo ni compromiso. Te asesoramos desde el primer mensaje.",
  },
];

export default function About() {
  return (
    <section id="nosotros" className="relative py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Sobre nosotros"
          title="Un taller apasionado por transformar ideas en realidad"
          description="Conocé quiénes estamos detrás de TAKI3D y cómo trabajamos cada proyecto."
        />

        <div className="mt-14 grid items-start gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="text-lg leading-relaxed text-zinc-300">
              TAKI3D nació en Montevideo con una idea simple: que{" "}
              <span className="font-medium text-white">
                cualquiera pueda convertir una idea en un objeto real
              </span>
              . Lo que empezó como una impresora y mucha curiosidad, hoy es un
              taller completo dedicado a la impresión 3D profesional.
            </p>
            <p className="mt-5 leading-relaxed text-zinc-500">
              Trabajamos figuras decorativas, regalos personalizados, prototipos,
              repuestos y proyectos para empresas. Diseñamos, imprimimos y
              terminamos cada pieza en nuestro taller, con materiales de calidad
              y un ojo obsesivo en los detalles.
            </p>

            <ul className="mt-8 space-y-3.5">
              {commitments.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-blue" />
                  <span className="text-[15px] text-zinc-300">{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-8">
              <Quote className="h-8 w-8 text-brand-blue/40" />
              <p className="mt-5 font-display text-xl leading-snug font-semibold text-white sm:text-2xl">
                "Cada pieza que sale de nuestro taller es el resultado de
                pasión por la creación y respeto por tu idea."
              </p>
              <p className="mt-4 text-sm text-zinc-500">El equipo de TAKI3D</p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {highlights.map((h) => (
                  <div
                    key={h.title}
                    className="rounded-2xl border border-white/8 bg-brand-black/40 p-5"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-blue/10 text-brand-blue">
                      <h.icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-sm font-semibold text-white">
                      {h.title}
                    </h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-500">
                      {h.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
