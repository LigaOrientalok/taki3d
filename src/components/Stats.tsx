import { Package, Printer, Smile } from "lucide-react";
import { useRef } from "react";
import { useInView } from "framer-motion";
import { useCounter } from "@/hooks/useCounter";

const stats = [
  { icon: Package, value: 1000, suffix: "+", label: "Piezas impresas" },
  { icon: Smile, value: 500, suffix: "+", label: "Clientes felices" },
  { icon: Printer, value: 300, suffix: "+", label: "Proyectos diseñados" },
];

function Stat({
  value,
  suffix,
  label,
  icon: Icon,
  start,
}: {
  value: number;
  suffix: string;
  label: string;
  icon: typeof Package;
  start: boolean;
}) {
  const count = useCounter(value, start);
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-brand-blue">
        <Icon className="h-7 w-7" />
      </div>
      <p className="font-display text-5xl font-bold text-white">
        {count.toLocaleString("es-ES")}
        <span className="text-brand-blue">{suffix}</span>
      </p>
      <p className="text-sm text-zinc-500">{label}</p>
    </div>
  );
}

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-24">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 h-[320px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-blue/5 blur-[100px]" />
      </div>
      <div
        ref={ref}
        className="relative mx-auto max-w-5xl rounded-3xl border border-white/8 bg-white/[0.03] px-6 py-16 backdrop-blur-sm"
      >
        <div className="grid gap-12 sm:grid-cols-3">
          {stats.map((stat) => (
            <Stat key={stat.label} {...stat} start={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
