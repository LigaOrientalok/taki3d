import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, MessageCircle, Minus, Plus, ShieldCheck, ShoppingCart, Truck } from "lucide-react";
import ProductImage from "@/components/ProductImage";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/hooks/useProducts";
import { formatPrice, isAvailable, maxOrderable, stockLabel } from "@/lib/store";
import { cn } from "@/lib/utils";
import { whatsappLink } from "@/lib/utils";

export default function ProductPage() {
  const { slug } = useParams();
  const { products, loading } = useProducts();
  const product = products.find((p) => p.slug === slug);
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center px-6 pt-32 pb-24">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-brand-blue" />
      </div>
    );
  }

  if (!product) return <Navigate to="/tienda" replace />;

  const available = isAvailable(product);
  const max = maxOrderable(product);

  const consultMessage = whatsappLink(
    `Hola TAKI3D! Me interesa "${product.title}" (${formatPrice(product.price)}). ¿Me pasás más información?`,
  );

  return (
    <div className="relative min-h-screen px-6 pt-32 pb-24">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/tienda"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a la tienda
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-white/8">
              <ProductImage product={product} />
              <span
                className={cn(
                  "absolute top-4 left-4 rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-sm",
                  product.stockMode === "pedido"
                    ? "bg-brand-blue/20 text-brand-blue"
                    : product.quantity <= 0
                      ? "bg-red-500/20 text-red-400"
                      : "bg-brand-green/15 text-brand-green",
                )}
              >
                {stockLabel(product)}
              </span>
            </div>
            {product.video && (
              <video
                src={product.video}
                controls
                preload="metadata"
                className="aspect-video w-full rounded-3xl border border-white/8 bg-black"
              />
            )}
          </div>

          <div className="flex flex-col">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-brand-blue">
              {product.category}
            </p>
            <h1 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
              {product.title}
            </h1>
            <p className="mt-5 font-display text-3xl font-semibold text-white">
              {formatPrice(product.price)}
            </p>

            <p className="mt-6 leading-relaxed text-zinc-400">{product.description}</p>

            <div className="mt-6 rounded-2xl border border-white/8 bg-white/[0.03] p-5">
              {product.stockMode === "pedido" ? (
                <p className="flex items-center gap-2 text-sm text-brand-blue">
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  Producto hecho a pedido: se imprime y se termina cuando confirmás la compra.
                </p>
              ) : (
                <p className="text-sm text-zinc-400">
                  Disponibles: <span className="font-semibold text-white">{product.quantity}</span>{" "}
                  {product.quantity === 1 ? "unidad" : "unidades"}
                </p>
              )}
            </div>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center gap-3 rounded-full glass px-3 py-2">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Restar cantidad"
                  className="grid h-8 w-8 place-items-center rounded-full text-zinc-300 transition-colors hover:text-white"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center font-display text-lg font-semibold text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(max, q + 1))}
                  aria-label="Sumar cantidad"
                  className="grid h-8 w-8 place-items-center rounded-full text-zinc-300 transition-colors hover:text-white"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={() => addItem(product, quantity)}
                disabled={!available}
                className={cn(
                  "flex h-13 flex-1 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition-all duration-300",
                  available
                    ? "bg-brand-blue text-white shadow-lg shadow-brand-blue/25 hover:bg-white hover:text-brand-black"
                    : "cursor-not-allowed bg-white/5 text-zinc-600",
                )}
              >
                <ShoppingCart className="h-4 w-4" />
                {available ? "Agregar al carrito" : "Sin stock"}
              </button>
            </div>

            <a
              href={consultMessage}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex h-13 items-center justify-center gap-2 rounded-full glass text-sm font-semibold text-white transition-all duration-300 hover:border-brand-green/50 hover:text-brand-green"
            >
              <MessageCircle className="h-4 w-4 text-brand-green" />
              Consultar por WhatsApp
            </a>

            <div className="mt-8 flex flex-wrap gap-5 text-xs text-zinc-500">
              <span className="flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-brand-blue" /> Envíos a todo Uruguay
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-brand-green" /> Garantía de satisfacción
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
