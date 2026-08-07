import {
  Box,
  Building2,
  Cake,
  ClipboardList,
  Cog,
  DoorOpen,
  KeyRound,
  Package,
} from "lucide-react";
import SectionHeading from "./SectionHeading";

const services = [
  {
    icon: Box,
    title: "Figuras decorativas",
    description:
      "Figuras, bustos, coleccionables y piezas decorativas para tu hogar u oficina, con acabados de alta calidad.",
  },
  {
    icon: KeyRound,
    title: "Llaveros",
    description:
      "Llaveros personalizados con nombres, logos o diseños únicos. El regalo ideal para empresas y eventos.",
  },
  {
    icon: Cake,
    title: "Cortantes",
    description:
      "Cortadores de galletas y accesorios de repostería personalizados para darle forma a tus recetas.",
  },
  {
    icon: DoorOpen,
    title: "Organizadores",
    description:
      "Organizadores a medida para escritorio, cocina y herramientas. Todo en su lugar, siempre.",
  },
  {
    icon: Cog,
    title: "Repuestos",
    description:
      "Repuestos y piezas de reemplazo difíciles de conseguir, modeladas e impresas a medida.",
  },
  {
    icon: ClipboardList,
    title: "Prototipos",
    description:
      "Prototipos funcionales para validar ideas, productos y proyectos antes de la producción final.",
  },
  {
    icon: Building2,
    title: "Empresas",
    description:
      "Soluciones de impresión 3D para empresas: merchandising, piezas técnicas y producción en serie.",
  },
  {
    icon: Package,
    title: "Regalos personalizados",
    description:
      "Regalos únicos e inolvidables: bustos 3D, figuras de parejas, mascotas y momentos especiales.",
  },
];

export default function Services() {
  return (
    <section id="servicios" className="relative py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Servicios"
          title="¿Qué podemos imprimir para vos?"
          description="De la idea al objeto real. Piezas únicas, funcionales y de excelente calidad, listas para entregar."
        />

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-blue/40 hover:bg-white/[0.05] hover:shadow-2xl hover:shadow-brand-blue/10"
            >
              <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-brand-blue/10 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue transition-colors duration-300 group-hover:bg-brand-blue group-hover:text-white">
                <service.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-white">
                {service.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-zinc-500">
                {service.description}
              </p>
              <span className="mt-5 block font-display text-xs font-semibold text-white/15">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
