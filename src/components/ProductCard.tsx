import { Link } from "react-router-dom";
import { Plus, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice, isAvailable, stockLabel, type Product } from "@/lib/store";
import { cn } from "@/lib/utils";
import ProductImage from "./ProductImage";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const available = isAvailable(product);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03] transition-all duration-300 hover:-translate-y-1 hover:border-brand-blue/40 hover:shadow-2xl hover:shadow-brand-blue/10">
      <Link
        to={`/producto/${product.slug}`}
        className="relative block aspect-square overflow-hidden"
      >
        <ProductImage product={product} className="transition-transform duration-500 group-hover:scale-105" />
        <span
          className={cn(
            "absolute top-3 left-3 rounded-full px-2.5 py-1 text-[10px] font-semibold backdrop-blur-sm",
            product.stockMode === "pedido"
              ? "bg-brand-blue/20 text-brand-blue"
              : product.quantity <= 0
                ? "bg-red-500/20 text-red-400"
                : "bg-brand-green/15 text-brand-green",
          )}
        >
          {stockLabel(product)}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] font-medium tracking-wide text-zinc-500 uppercase">
          {product.category}
        </p>
        <Link to={`/producto/${product.slug}`} className="mt-1">
          <h3 className="font-display text-lg font-semibold text-white transition-colors hover:text-brand-blue">
            {product.title}
          </h3>
        </Link>
        <p className="mt-2 line-clamp-2 flex-1 text-[13px] leading-relaxed text-zinc-500">
          {product.description}
        </p>
        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="font-display text-lg font-semibold text-white">
            {formatPrice(product.price)}
          </p>
          <button
            onClick={() => addItem(product)}
            disabled={!available}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300",
              available
                ? "bg-brand-blue text-white hover:bg-white hover:text-brand-black"
                : "cursor-not-allowed bg-white/5 text-zinc-600",
            )}
            aria-label={`Agregar ${product.title} al carrito`}
          >
            {available ? <Plus className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
