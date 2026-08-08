import { motion } from "framer-motion";
import { LayoutGrid, ListFilter } from "lucide-react";
import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { CATEGORIES } from "@/lib/store";

type Sort = "destacados" | "menor" | "mayor";

export default function Store() {
  const [category, setCategory] = useState("Todos");
  const [sort, setSort] = useState<Sort>("destacados");
  const { products: allProducts, loading } = useProducts();

  const products = useMemo(() => {
    let list = [...allProducts];
    if (category !== "Todos") list = list.filter((p) => p.category === category);
    if (sort === "menor") list.sort((a, b) => a.price - b.price);
    if (sort === "mayor") list.sort((a, b) => b.price - a.price);
    if (sort === "destacados") list.sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false));
    return list;
  }, [allProducts, category, sort]);

  return (
    <div className="relative min-h-screen px-6 pt-32 pb-24">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 left-1/4 h-96 w-96 rounded-full bg-brand-blue/8 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="text-center">
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-brand-blue">
            Tienda
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold text-white sm:text-5xl">
            Nuestros productos
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-zinc-400">
            Piezas listas para enviar y productos hechos a pedido. Agregá al
            carrito y coordiná el pago o retiro cuando termines.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap justify-center gap-2">
            {["Todos", ...CATEGORIES.map((c) => c.name)].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  category === cat
                    ? "bg-brand-blue text-white shadow-lg shadow-brand-blue/25"
                    : "glass text-zinc-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-center gap-2 rounded-full glass px-4 py-2 text-sm text-zinc-400">
            <ListFilter className="h-4 w-4" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="bg-transparent text-sm text-zinc-300 focus:outline-none"
              aria-label="Ordenar por"
            >
              <option value="destacados" className="bg-brand-gray">Destacados</option>
              <option value="menor" className="bg-brand-gray">Precio: menor a mayor</option>
              <option value="mayor" className="bg-brand-gray">Precio: mayor a menor</option>
            </select>
          </div>
        </div>

        <motion.div
          layout
          className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        {products.length === 0 && loading && (
          <div className="mt-20 flex flex-col items-center gap-3 text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-brand-blue" />
            <p className="text-zinc-400">Cargando productos…</p>
          </div>
        )}

        {products.length === 0 && !loading && (
          <div className="mt-20 flex flex-col items-center gap-3 text-center">
            <LayoutGrid className="h-10 w-10 text-zinc-600" />
            <p className="text-zinc-400">No hay productos en esta categoría todavía.</p>
          </div>
        )}
      </div>
    </div>
  );
}
