import { MessageSquare, PenLine, Printer, Send, Wrench } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const steps = [
  {
    icon: MessageSquare,
    title: "Contanos tu idea",
    description:
      "Escribinos por WhatsApp o mail con tu idea, una referencia o una foto. No necesitás saber nada de diseño.",
  },
  {
    icon: PenLine,
    title: "Diseñamos el modelo",
    description:
      "Modelamos la pieza en 3D y te enviamos una vista previa para que la apruebes. Ajustes ilimitados sin costo.",
  },
  {
    icon: Printer,
    title: "Imprimimos tu pieza",
    description:
      "Imprimimos con materiales de calidad y capas finas para lograr un acabado prolijo y resistente.",
  },
  {
    icon: Wrench,
    title: "Post-procesado",
    description:
      "Lijamos, pulimos y terminamos cada pieza según lo que necesites: color, brillo o acabado mate.",
  },
  {
    icon: Send,
    title: "Entrega en todo Uruguay",
    description:
      "Retirá en Montevideo o coordinamos envío a todo el país. Lista para usar, regalar o vender.",
  },
];

export default function Timeline() {
  return (
    <section id="como-trabajamos" className="relative py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Cómo trabajamos"
          title="5 pasos, cero complicaciones"
          description="Un proceso simple y transparente, desde la primera consulta hasta la entrega de tu pieza."
        />

        <div className="relative mt-16">
          <div className="absolute top-6 left-0 hidden h-px w-full bg-gradient-to-r from-transparent via-brand-blue/40 to-transparent lg:block" />

          <div className="grid gap-10 lg:grid-cols-5 lg:gap-6">
            {steps.map((step, index) => (
              <Reveal key={step.title} delay={index * 0.1}>
                <div className="relative">
                  <div className="relative z-10 grid h-12 w-12 place-items-center rounded-full border border-brand-blue/40 bg-brand-black text-brand-blue shadow-lg shadow-brand-blue/10">
                    <step.icon className="h-5 w-5" />
                    <span className="absolute -top-2 -right-2 grid h-6 w-6 place-items-center rounded-full bg-brand-blue text-[10px] font-bold text-white">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-lg font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
