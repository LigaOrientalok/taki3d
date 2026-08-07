import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import ProductImage from "@/components/ProductImage";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/store";

export default function CartPage() {
  const { items, setQuantity, removeItem, subtotal, count } = useCart();

  return (
    <div className="relative min-h-screen px-6 pt-32 pb-24">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-display text-4xl font-bold text-white">
          Tu carrito
          <span className="ml-3 text-lg font-normal text-zinc-500">
            ({count} {count === 1 ? "producto" : "productos"})
          </span>
        </h1>

        {items.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-5 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-white/5 text-zinc-600">
              <ShoppingBag className="h-10 w-10" />
            </div>
            <p className="text-zinc-400">Tu carrito está vacío.</p>
            <Link
              to="/tienda"
              className="rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-brand-black"
            >
              Explorar la tienda
            </Link>
          </div>
        ) : (
          <div className="mt-10 space-y-4">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex flex-col gap-4 rounded-2xl border border-white/8 bg-white/[0.03] p-4 sm:flex-row sm:items-center"
              >
                <Link
                  to={`/producto/${item.product.slug}`}
                  className="h-24 w-24 shrink-0 overflow-hidden rounded-xl"
                >
                  <ProductImage product={item.product} iconSize="h-8 w-8" />
                </Link>
                <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <Link
                      to={`/producto/${item.product.slug}`}
                      className="font-display text-base font-semibold text-white transition-colors hover:text-brand-blue"
                    >
                      {item.product.title}
                    </Link>
                    <p className="mt-1 text-sm text-zinc-500">
                      {formatPrice(item.product.price)} c/u
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 rounded-full glass px-2 py-1.5">
                      <button
                        onClick={() => setQuantity(item.product.id, item.quantity - 1)}
                        aria-label="Restar"
                        className="grid h-7 w-7 place-items-center rounded-full text-zinc-300 transition-colors hover:text-white"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-6 text-center text-sm font-semibold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(item.product.id, item.quantity + 1)}
                        aria-label="Sumar"
                        className="grid h-7 w-7 place-items-center rounded-full text-zinc-300 transition-colors hover:text-white"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="w-28 text-right font-display text-base font-semibold text-white">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      aria-label={`Quitar ${item.product.title}`}
                      className="text-zinc-600 transition-colors hover:text-red-400"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="mt-6 flex flex-col gap-5 rounded-2xl border border-white/8 bg-white/[0.03] p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-zinc-400">
                  Subtotal <span className="text-xs">({count} productos)</span>
                </p>
                <p className="mt-1 font-display text-3xl font-semibold text-white">
                  {formatPrice(subtotal)}
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  Envío y forma de pago se coordinan al finalizar la compra.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/tienda"
                  className="inline-flex items-center justify-center gap-2 rounded-full glass px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-brand-blue/50 hover:text-brand-blue"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Seguir comprando
                </Link>
                <Link
                  to="/checkout"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-blue/25 transition-all duration-300 hover:bg-white hover:text-brand-black"
                >
                  Finalizar compra
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
