import ProductFigure, { type FigureVariant } from "./ProductFigure";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const products: {
  name: string;
  category: string;
  price: number;
  variant: FigureVariant;
}[] = [
  {
    name: "Mecha Centinela",
    category: "Ciencia ficción",
    price: 89.9,
    variant: "robot",
  },
  {
    name: "Dracón de Ébano",
    category: "Fantasía",
    price: 129.9,
    variant: "dragon",
  },
  {
    name: "Ronin de Fuego",
    category: "Acción",
    price: 99.9,
    variant: "samurai",
  },
  {
    name: "Archimago Estelar",
    category: "Magia",
    price: 119.9,
    variant: "mage",
  },
  {
    name: "Piloto Orbital",
    category: "Exploración",
    price: 84.9,
    variant: "astronaut",
  },
  {
    name: "Duende Travieso",
    category: "Colección",
    price: 59.9,
    variant: "monster",
  },
];

export default function Products() {
  return (
    <section id="productos" className="relative overflow-hidden py-24">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 85% 15%, rgba(139,92,246,0.1), transparent 45%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Productos"
            title="Figuras que roban miradas"
            description="Una selección de piezas creadas en nuestro estudio. Cada una es única y se fabrica bajo pedido."
          />
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, i) => (
            <Reveal key={product.name} delay={i * 80}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-all hover:-translate-y-1 hover:border-white/25 hover:shadow-2xl hover:shadow-violet-500/10">
                <div className="relative overflow-hidden bg-gradient-to-b from-white/[0.04] to-transparent p-6">
                  <ProductFigure
                    variant={product.variant}
                    className="mx-auto w-full max-w-[240px] transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/50 px-3 py-1 text-[11px] font-medium text-zinc-300 backdrop-blur-sm">
                    {product.category}
                  </span>
                </div>

                <div className="flex flex-1 flex-col justify-between gap-4 p-6 pt-2">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-500">
                      Edición exclusiva · Impresión y pintura a mano
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xl font-bold text-white">
                      ${product.price.toFixed(2)}
                    </p>
                    <a
                      href="#contacto"
                      className="rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-5 py-2 text-sm font-semibold text-white transition-transform group-hover:scale-105"
                    >
                      Lo quiero
                    </a>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <p className="mt-12 text-center text-sm text-zinc-500">
            ¿Buscas algo más específico?{" "}
            <a href="#contacto" className="font-medium text-cyan-400 hover:text-cyan-300">
              Pídenos una figura personalizada →
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
