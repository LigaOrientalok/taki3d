import { Award, Gauge, Layers, Palette } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const reasons = [
  {
    icon: Layers,
    title: "Calidad de impresión",
    description:
      "Impresoras de alta precisión con capas finas y controles de calidad en cada pieza.",
  },
  {
    icon: Palette,
    title: "Diseño personalizado",
    description:
      "Modelamos a medida tu idea, con asesoramiento y ajustes ilimitados antes de imprimir.",
  },
  {
    icon: Gauge,
    title: "Entrega rápida",
    description:
      "Producción en tiempo récord para que tengas tu pieza cuando la necesitás.",
  },
  {
    icon: Award,
    title: "Garantía de satisfacción",
    description:
      "Si no quedás conforme, lo rehacemos. Tu idea, bien hecha, es nuestra prioridad.",
  },
];

export default function WhyChoose() {
  return (
    <section id="por-que" className="relative py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Por qué TAKI3D"
          title="La diferencia está en el detalle"
          description="No imprimimos piezas sueltas: construimos la idea que tenés en mente, con el cuidado que merece."
        />

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason, index) => (
            <Reveal key={reason.title} delay={index * 0.1}>
              <div className="group h-full rounded-2xl border border-white/8 bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-blue/40 hover:bg-white/[0.05]">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue transition-colors duration-300 group-hover:bg-brand-blue group-hover:text-white">
                  <reason.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-white">
                  {reason.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-zinc-500">
                  {reason.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
