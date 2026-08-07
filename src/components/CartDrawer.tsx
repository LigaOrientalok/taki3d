import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/store";
import ProductImage from "./ProductImage";

export default function CartDrawer() {
  const { items, isOpen, closeCart, setQuantity, removeItem, subtotal, count } = useCart();
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[75] bg-black/70 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 z-[76] flex h-full w-full max-w-md flex-col border-l border-white/8 bg-brand-gray"
          >
            <div className="flex items-center justify-between border-b border-white/8 px-6 py-5">
              <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-white">
                <ShoppingBag className="h-5 w-5 text-brand-blue" />
                Tu carrito
                <span className="text-sm font-normal text-zinc-500">
                  ({count} {count === 1 ? "producto" : "productos"})
                </span>
              </h3>
              <button
                onClick={closeCart}
                aria-label="Cerrar carrito"
                className="grid h-9 w-9 place-items-center rounded-full glass text-zinc-400 transition-colors hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-white/5 text-zinc-600">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <p className="text-zinc-400">Tu carrito está vacío.</p>
                <button
                  onClick={() => {
                    closeCart();
                    navigate("/tienda");
                  }}
                  className="rounded-full bg-brand-blue px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-brand-black"
                >
                  Ver la tienda
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex gap-4 rounded-2xl border border-white/8 bg-white/[0.03] p-3"
                    >
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                        <ProductImage product={item.product} iconSize="h-7 w-7" />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-white">
                              {item.product.title}
                            </p>
                            <p className="mt-0.5 text-xs text-zinc-500">
                              {formatPrice(item.product.price)} c/u
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            aria-label={`Quitar ${item.product.title}`}
                            className="text-zinc-600 transition-colors hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setQuantity(item.product.id, item.quantity - 1)}
                              aria-label="Restar"
                              className="grid h-7 w-7 place-items-center rounded-full glass text-zinc-300 transition-colors hover:text-white"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-6 text-center text-sm font-semibold text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => setQuantity(item.product.id, item.quantity + 1)}
                              aria-label="Sumar"
                              className="grid h-7 w-7 place-items-center rounded-full glass text-zinc-300 transition-colors hover:text-white"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <p className="text-sm font-semibold text-white">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/8 px-6 py-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-zinc-400">Subtotal</p>
                    <p className="font-display text-xl font-semibold text-white">
                      {formatPrice(subtotal)}
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-zinc-500">
                    Envío y forma de pago se coordinan en el checkout.
                  </p>
                  <button
                    onClick={() => {
                      closeCart();
                      navigate("/checkout");
                    }}
                    className="mt-4 w-full rounded-full bg-brand-blue py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-white hover:text-brand-black"
                  >
                    Finalizar compra
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
