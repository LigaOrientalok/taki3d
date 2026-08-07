import ProductFigure from "./ProductFigure";
import Reveal from "./Reveal";

const highlights = [
  "Escultura y modelado 3D totalmente personalizados",
  "Impresión de alta resolución con acabados premium",
  "Pintura artesanal con detalles fieles a tu referencia",
  "Seguimiento y comunicación constante durante el proceso",
];

export default function About() {
  return (
    <section id="sobre-mi" className="relative overflow-hidden py-24">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 10% 80%, rgba(217,70,239,0.08), transparent 40%)",
        }}
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 lg:grid-cols-2">
        <Reveal>
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
                  backgroundSize: "22px 22px",
                }}
              />
              <div className="relative">
                <ProductFigure variant="mage" className="mx-auto w-full max-w-sm" />
              </div>

              <div className="absolute left-6 top-6 rounded-full border border-white/10 bg-black/50 px-4 py-2 text-xs font-medium text-cyan-300 backdrop-blur-sm">
                100% hecho a mano
              </div>
              <div className="absolute bottom-6 right-6 rounded-full border border-white/10 bg-black/50 px-4 py-2 text-xs font-medium text-fuchsia-300 backdrop-blur-sm">
                +500 piezas entregadas
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Sobre mí
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Un estudio donde cada figura cuenta una{" "}
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              historia
            </span>
          </h2>
          <p className="mt-6 text-zinc-400">
            Soy un apasionado del modelado 3D y el coleccionismo. Desde el primer
            boceto hasta la pintura final, cada pieza pasa por un proceso artesanal
            donde los detalles importan: proporciones, texturas y colores pensados
            para que tu figura luzca exactamente como la imaginaste.
          </p>
          <p className="mt-4 text-zinc-400">
            Trabajo con impresoras de alta resolución, resinas de calidad y técnicas
            de pintura a mano que garantizan resultados duraderos y listos para
            exhibir.
          </p>

          <ul className="mt-8 space-y-3">
            {highlights.map((item) => (
              <li key={item} className="flex items-start gap-3 text-zinc-300">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-400">
                  <svg
                    className="h-3 w-3 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
