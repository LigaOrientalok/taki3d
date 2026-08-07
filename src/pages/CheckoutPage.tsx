import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ArrowLeft, Check, MessageCircle, Package, Store } from "lucide-react";
import ProductImage from "@/components/ProductImage";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/store";
import { cn, whatsappLink } from "@/lib/utils";

type Delivery = "retiro" | "envio";

interface FormState {
  name: string;
  email: string;
  phone: string;
  delivery: Delivery;
  address: string;
  notes: string;
}

const emptyForm: FormState = {
  name: "",
  email: "",
  phone: "",
  delivery: "retiro",
  address: "",
  notes: "",
};

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [placed, setPlaced] = useState(false);
  const [orderNumber] = useState(
    () => `TK-${Math.floor(100000 + Math.random() * 900000)}`,
  );

  if (items.length === 0 && !placed) return <Navigate to="/tienda" replace />;

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPlaced(true);
    clearCart();
  };

  const orderMessage = whatsappLink(
    `Hola TAKI3D! Soy ${form.name || "..."}. Quiero confirmar mi pedido ${orderNumber}:\n` +
      items
        .map(
          (item) =>
            `• ${item.product.title} x${item.quantity} = ${formatPrice(item.product.price * item.quantity)}`,
        )
        .join("\n") +
      `\nTotal: ${formatPrice(subtotal)}` +
      `\nEntrega: ${form.delivery === "retiro" ? "Retiro en el taller" : "Envío a domicilio"}` +
      (form.delivery === "envio" && form.address ? ` (${form.address})` : ""),
  );

  if (placed) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 pt-32 pb-24">
        <div className="w-full max-w-lg rounded-3xl border border-white/8 bg-white/[0.03] p-8 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-green/10 text-brand-green">
            <Check className="h-8 w-8" />
          </div>
          <h1 className="mt-6 font-display text-3xl font-bold text-white">
            ¡Pedido registrado!
          </h1>
          <p className="mt-2 text-zinc-400">
            Tu número de pedido es{" "}
            <span className="font-semibold text-brand-blue">{orderNumber}</span>.
            Ya reservamos tus productos.
          </p>
          <p className="mt-4 text-sm text-zinc-500">
            Para coordinar el pago y la entrega, escribinos por WhatsApp o
            retirá en Justo Alonso González 3283, Montevideo.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <a
              href={orderMessage}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-green py-3 text-sm font-semibold text-brand-black transition-colors hover:bg-white"
            >
              <MessageCircle className="h-4 w-4" />
              Coordinar por WhatsApp
            </a>
            <Link
              to="/tienda"
              className="inline-flex items-center justify-center rounded-full glass px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-brand-blue/50 hover:text-brand-blue"
            >
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen px-6 pt-32 pb-24">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/carrito"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al carrito
        </Link>
        <h1 className="mt-6 font-display text-4xl font-bold text-white">Checkout</h1>

        <form onSubmit={handleSubmit} className="mt-10 grid gap-10 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-3">
            <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-7">
              <h2 className="font-display text-lg font-semibold text-white">
                Tus datos
              </h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-zinc-400">
                    Nombre y apellido *
                  </label>
                  <input
                    id="name"
                    required
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="Tu nombre"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="mb-2 block text-sm font-medium text-zinc-400">
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    id="phone"
                    required
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="099 123 456"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
                  />
                </div>
              </div>
              <div className="mt-5">
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-zinc-400">
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
                />
              </div>
            </div>

            <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-7">
              <h2 className="font-display text-lg font-semibold text-white">
                Entrega
              </h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => update("delivery", "retiro")}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border p-5 text-left transition-all duration-300",
                    form.delivery === "retiro"
                      ? "border-brand-blue/50 bg-brand-blue/10"
                      : "border-white/8 bg-white/[0.03] hover:border-white/20",
                  )}
                >
                  <Store className="h-6 w-6 text-brand-blue" />
                  <div>
                    <p className="text-sm font-semibold text-white">Retiro en el taller</p>
                    <p className="mt-1 text-xs text-zinc-500">
                      Justo Alonso González 3283, Montevideo
                    </p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => update("delivery", "envio")}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border p-5 text-left transition-all duration-300",
                    form.delivery === "envio"
                      ? "border-brand-blue/50 bg-brand-blue/10"
                      : "border-white/8 bg-white/[0.03] hover:border-white/20",
                  )}
                >
                  <Package className="h-6 w-6 text-brand-blue" />
                  <div>
                    <p className="text-sm font-semibold text-white">Envío a todo Uruguay</p>
                    <p className="mt-1 text-xs text-zinc-500">Costo coordinado por WhatsApp</p>
                  </div>
                </button>
              </div>

              {form.delivery === "envio" && (
                <div className="mt-5">
                  <label htmlFor="address" className="mb-2 block text-sm font-medium text-zinc-400">
                    Dirección de envío *
                  </label>
                  <input
                    id="address"
                    required
                    value={form.address}
                    onChange={(e) => update("address", e.target.value)}
                    placeholder="Calle, número, ciudad"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
                  />
                </div>
              )}

              <div className="mt-5">
                <label htmlFor="notes" className="mb-2 block text-sm font-medium text-zinc-400">
                  Notas (opcional)
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  placeholder="Color, grabado, plazo, etc."
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="sticky top-28 rounded-3xl border border-white/8 bg-white/[0.03] p-7">
              <h2 className="font-display text-lg font-semibold text-white">Tu pedido</h2>
              <div className="mt-5 space-y-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                      <ProductImage product={item.product} iconSize="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">
                        {item.product.title}
                      </p>
                      <p className="text-xs text-zinc-500">x{item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-white">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-6 space-y-2 border-t border-white/8 pt-5">
                <div className="flex justify-between text-sm text-zinc-400">
                  <span>Subtotal</span>
                  <span className="font-medium text-white">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-zinc-400">
                  <span>Envío</span>
                  <span className="font-medium text-white">
                    {form.delivery === "retiro" ? "Gratis" : "A coordinar"}
                  </span>
                </div>
                <div className="flex justify-between pt-2 text-base font-semibold">
                  <span className="text-white">Total</span>
                  <span className="font-display text-white">{formatPrice(subtotal)}</span>
                </div>
              </div>
              <p className="mt-4 text-xs text-zinc-500">
                Al confirmar, te damos tu número de pedido y coordinamos el pago
                por WhatsApp (efectivo, transferencia o MercadoPago) o el retiro.
              </p>
              <button
                type="submit"
                className="mt-6 w-full rounded-full bg-brand-blue py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-blue/25 transition-all duration-300 hover:bg-white hover:text-brand-black"
              >
                Confirmar pedido
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
