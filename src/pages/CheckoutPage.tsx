import { useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  CreditCard,
  MessageCircle,
  Package,
  Store,
} from "lucide-react";
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
  const { items, clearCart } = useCart();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [placed, setPlaced] = useState(false);
  const [mpSuccess, setMpSuccess] = useState(false);
  const [paying, setPaying] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const returnStatus = useMemo(
    () => new URLSearchParams(window.location.search).get("status"),
    [],
  );
  const [orderNumber] = useState(
    () =>
      new URLSearchParams(window.location.search).get("order") ??
      `TK-${Math.floor(100000 + Math.random() * 900000)}`,
  );
  const [cartSnapshot] = useState(() => items);

  useEffect(() => {
    if (returnStatus === "success") {
      setMpSuccess(true);
      setPlaced(true);
      clearCart();
    } else if (returnStatus === "pending") {
      setPaymentError(
        "Tu pago quedó pendiente en MercadoPago. Si ya se acreditó, escribinos por WhatsApp para confirmar el pedido.",
      );
    }
  }, [returnStatus, clearCart]);

  if (items.length === 0 && !placed && returnStatus !== "success")
    return <Navigate to="/tienda" replace />;

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const snapshotSubtotal = cartSnapshot.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPlaced(true);
    clearCart();
  };

  const handleMpPay = async () => {
    setPaymentError(null);
    const formEl = formRef.current;
    if (formEl && !formEl.checkValidity()) {
      formEl.requestSubmit();
      return;
    }
    setPaying(true);
    try {
      const origin = window.location.origin;
      const res = await fetch("/api/create-preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartSnapshot.map((item) => ({
            id: item.product.id,
            title: item.product.title,
            quantity: item.quantity,
            unit_price: item.product.price,
          })),
          payer: { name: form.name, email: form.email, phone: form.phone },
          externalReference: orderNumber,
          delivery: form.delivery,
          backUrls: {
            success: `${origin}/checkout?status=success&order=${orderNumber}`,
            pending: `${origin}/checkout?status=pending&order=${orderNumber}`,
            failure: `${origin}/checkout?status=failure&order=${orderNumber}`,
          },
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.initPoint) {
        throw new Error(data?.error ?? "Error");
      }
      window.location.href = data.initPoint;
    } catch {
      setPaymentError(
        "No se pudo conectar con MercadoPago. Probá de nuevo o coordiná el pago por WhatsApp.",
      );
      setPaying(false);
    }
  };

  const orderMessage = whatsappLink(
    `Hola TAKI3D! Soy ${form.name || "..."}. Quiero confirmar mi pedido ${orderNumber}:\n` +
      cartSnapshot
        .map(
          (item) =>
            `• ${item.product.title} x${item.quantity} = ${formatPrice(item.product.price * item.quantity)}`,
        )
        .join("\n") +
      `\nTotal: ${formatPrice(snapshotSubtotal)}` +
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
            {mpSuccess ? "¡Pago recibido!" : "¡Pedido registrado!"}
          </h1>
          <p className="mt-2 text-zinc-400">
            {mpSuccess ? (
              <>
                Gracias por tu compra. Tu número de pedido es{" "}
                <span className="font-semibold text-brand-blue">
                  {orderNumber}
                </span>{" "}
                y el pago por MercadoPago fue acreditado.
              </>
            ) : (
              <>
                Tu número de pedido es{" "}
                <span className="font-semibold text-brand-blue">
                  {orderNumber}
                </span>
                . Ya reservamos tus productos.
              </>
            )}
          </p>
          <p className="mt-4 text-sm text-zinc-500">
            {mpSuccess
              ? "Para coordinar la entrega, escribinos por WhatsApp o retirá en Justo Alonso González 3283, Montevideo."
              : "Para coordinar el pago y la entrega, escribinos por WhatsApp o retirá en Justo Alonso González 3283, Montevideo."}
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

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="mt-10 grid gap-10 lg:grid-cols-5"
        >
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
                {cartSnapshot.map((item) => (
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
                  <span className="font-medium text-white">{formatPrice(snapshotSubtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-zinc-400">
                  <span>Envío</span>
                  <span className="font-medium text-white">
                    {form.delivery === "retiro" ? "Gratis" : "A coordinar"}
                  </span>
                </div>
                <div className="flex justify-between pt-2 text-base font-semibold">
                  <span className="text-white">Total</span>
                  <span className="font-display text-white">{formatPrice(snapshotSubtotal)}</span>
                </div>
              </div>
              <p className="mt-4 text-xs text-zinc-500">
                Pagá online con MercadoPago (tarjeta o dinero en cuenta), o
                confirmá el pedido y coordiná el pago por WhatsApp (efectivo o
                transferencia).
              </p>
              <button
                type="button"
                onClick={handleMpPay}
                disabled={paying}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-blue py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-blue/25 transition-all duration-300 hover:bg-white hover:text-brand-black disabled:cursor-not-allowed disabled:opacity-60"
              >
                <CreditCard className="h-4 w-4" />
                {paying ? "Redirigiendo a MercadoPago…" : "Pagar con MercadoPago"}
              </button>
              {paymentError && (
                <p className="mt-3 text-xs text-amber-400">{paymentError}</p>
              )}
              <button
                type="submit"
                className="mt-3 w-full rounded-full border border-white/15 bg-white/[0.04] py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-white/40"
              >
                Confirmar pedido por WhatsApp
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
