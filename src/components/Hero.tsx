import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useRef } from "react";
import PrinterIllustration from "./PrinterIllustration";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const visualY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  };
  const item = {
    hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <section
      id="inicio"
      ref={ref}
      className="relative flex min-h-screen items-center overflow-hidden pt-28 pb-20"
    >
      {/* soft background lights */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full bg-brand-blue/10 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 h-[420px] w-[420px] rounded-full bg-brand-blue/5 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage:
              "radial-gradient(ellipse 80% 60% at 50% 40%, black, transparent)",
          }}
        />
      </div>

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 px-6 lg:grid-cols-2 lg:gap-10">
        <motion.div variants={container} initial="hidden" animate="visible" style={{ y: contentY }}>
          <motion.div variants={item}>
            <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-zinc-300">
              <Sparkles className="h-3.5 w-3.5 text-brand-blue" />
              Impresión 3D profesional · Montevideo, Uruguay
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-7 font-display text-5xl leading-[1.05] font-bold tracking-tight text-white sm:text-6xl lg:text-[4.2rem]"
          >
            Impresión 3D{" "}
            <span className="text-gradient-blue">Profesional</span> en Uruguay
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-lg text-lg leading-relaxed text-zinc-400"
          >
            Creamos piezas personalizadas, decoración, prototipos, regalos,
            accesorios y mucho más, con impresión 3D de alta calidad.
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-col gap-4 sm:flex-row">
            <a
              href="#galeria"
              className="group inline-flex h-13 items-center justify-center gap-2 rounded-full bg-brand-blue px-8 text-sm font-semibold text-white shadow-lg shadow-brand-blue/25 transition-all duration-300 hover:bg-white hover:text-brand-black"
            >
              Ver trabajos
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#contacto"
              className="inline-flex h-13 items-center justify-center rounded-full glass px-8 text-sm font-semibold text-white transition-all duration-300 hover:border-brand-blue/50 hover:text-brand-blue"
            >
              Solicitar presupuesto
            </a>
          </motion.div>

          <motion.div variants={item} className="mt-12 flex flex-wrap gap-8">
            {[
              ["+1000", "Piezas impresas"],
              ["+500", "Clientes felices"],
              ["24h", "Entrega promedio"],
            ].map(([value, label]) => (
              <div key={label}>
                <p className="font-display text-2xl font-semibold text-white">
                  {value}
                </p>
                <p className="mt-1 text-xs text-zinc-500">{label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          style={{ y: visualY }}
          initial={{ opacity: 0, scale: 0.94, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-lg"
        >
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <PrinterIllustration />
          </motion.div>

          <motion.div
            className="absolute top-8 -left-3 rounded-2xl glass px-4 py-3 sm:left-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <p className="text-xs font-semibold text-white">Alta precisión</p>
            <p className="mt-0.5 text-[11px] text-zinc-500">Capas de 0.05 mm</p>
          </motion.div>

          <motion.div
            className="absolute top-1/3 -right-2 rounded-2xl glass px-4 py-3 sm:right-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
          >
            <p className="text-xs font-semibold text-white">PLA · PETG · Resina</p>
            <p className="mt-0.5 text-[11px] text-zinc-500">Materiales premium</p>
          </motion.div>

          <motion.div
            className="absolute -bottom-2 left-8 rounded-2xl glass px-4 py-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.6 }}
          >
            <p className="text-xs font-semibold text-white">Envíos a todo Uruguay</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
