import { useCallback, useEffect, useState } from "react";
import { KeyRound, RefreshCw, XCircle } from "lucide-react";
import { formatPrice } from "@/lib/store";

interface OrderItem {
  id: string;
  title: string;
  quantity: number;
  unit_price: number;
  stockMode?: "stock" | "pedido";
}

interface Order {
  id: string;
  items: OrderItem[];
  payer: { name: string; email: string; phone: string };
  delivery: string;
  address?: string;
  notes?: string;
  total: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  paidAt?: string | null;
}

const STATUS_LABEL: Record<string, string> = {
  pending: "Pendiente",
  pending_whatsapp: "Pendiente (WhatsApp)",
  paid: "Pagado",
  cancelled: "Cancelado",
  refunded: "Reembolsado",
};

export default function AdminPage() {
  const [key, setKey] = useState(() => sessionStorage.getItem("taki3d-admin-key") ?? "");
  const [authed, setAuthed] = useState(() => Boolean(sessionStorage.getItem("taki3d-admin-key")));
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<
    Array<{ id: string; title: string; stock_mode: string; quantity: number }>
  >([]);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(
    async (token: string) => {
      setLoading(true);
      try {
        const res = await fetch(`/api/orders?key=${encodeURIComponent(token)}`);
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          if (res.status === 401) {
            setAuthed(false);
            sessionStorage.removeItem("taki3d-admin-key");
            setError("Clave incorrecta");
          } else {
            setError(data?.error ?? "No se pudieron cargar los pedidos");
          }
          return;
        }
        setOrders(data.orders ?? []);
        setProducts(data.products ?? []);
        setError(null);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem("taki3d-admin-key", key);
    setAuthed(true);
    load(key);
  };

  useEffect(() => {
    if (!authed) return;
    load(sessionStorage.getItem("taki3d-admin-key") ?? "");
    const timer = setInterval(() => load(sessionStorage.getItem("taki3d-admin-key") ?? ""), 20000);
    return () => clearInterval(timer);
  }, [authed, load]);

  const cancelOrder = async (id: string) => {
    const token = sessionStorage.getItem("taki3d-admin-key") ?? "";
    try {
      const res = await fetch(`/api/orders?key=${encodeURIComponent(token)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "cancel" }),
      });
      if (res.ok) load(token);
      else {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "No se pudo cancelar el pedido");
      }
    } catch {
      setError("No se pudo cancelar el pedido");
    }
  };

  const syncCatalog = async () => {
    const token = sessionStorage.getItem("taki3d-admin-key") ?? "";
    setSyncing(true);
    try {
      const res = await fetch(`/api/orders?key=${encodeURIComponent(token)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sync" }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) setError(data?.error ?? "No se pudo sincronizar");
      else load(token);
    } catch {
      setError("No se pudo sincronizar el catálogo");
    } finally {
      setSyncing(false);
    }
  };

  const updateStock = async (productId: string, quantity: number) => {
    const token = sessionStorage.getItem("taki3d-admin-key") ?? "";
    try {
      const res = await fetch(`/api/orders?key=${encodeURIComponent(token)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "set-stock", productId, quantity }),
      });
      if (res.ok) load(token);
      else setError("No se pudo actualizar el stock");
    } catch {
      setError("No se pudo actualizar el stock");
    }
  };

  if (!authed) {
    return (
      <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-32">
        <div className="w-full max-w-sm rounded-3xl border border-white/8 bg-white/[0.03] p-8">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-blue/10 text-brand-blue">
            <KeyRound className="h-6 w-6" />
          </div>
          <h1 className="mt-5 text-center font-display text-2xl font-semibold text-white">
            Acceso restringido
          </h1>
          <p className="mt-2 text-center text-sm text-zinc-500">
            Ingresá la clave de administrador para ver los pedidos.
          </p>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <input
              type="password"
              required
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Clave de administrador"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
            />
            <button
              type="submit"
              className="w-full rounded-full bg-brand-blue py-3 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-brand-black"
            >
              Entrar
            </button>
          </form>
          {error && <p className="mt-3 text-center text-xs text-amber-400">{error}</p>}
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[70vh] px-6 pt-32 pb-24">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-white">Pedidos</h1>
            <p className="mt-1 text-sm text-zinc-500">
              {orders.length} pedido{orders.length === 1 ? "" : "s"}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={syncCatalog}
              disabled={syncing}
              className="inline-flex items-center gap-2 rounded-full glass px-4 py-2.5 text-sm font-medium text-white transition-colors hover:border-brand-blue/50 hover:text-brand-blue disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
              Sincronizar catálogo
            </button>
            <button
              onClick={() => load(sessionStorage.getItem("taki3d-admin-key") ?? "")}
              className="inline-flex items-center gap-2 rounded-full glass px-4 py-2.5 text-sm font-medium text-white transition-colors hover:border-brand-blue/50 hover:text-brand-blue"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Actualizar
            </button>
          </div>
        </div>

        {error && <p className="mt-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-400">{error}</p>}

        <div className="mt-8 space-y-4">
          {orders.length === 0 && !loading ? (
            <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-10 text-center text-zinc-500">
              Todavía no hay pedidos.
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="rounded-3xl border border-white/8 bg-white/[0.03] p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-display font-semibold text-white">{order.id}</p>
                    <p className="text-xs text-zinc-500">
                      {new Date(order.createdAt).toLocaleString("es-UY")}
                    </p>
                  </div>
                  <span
                    className={
                      "rounded-full px-3 py-1 text-xs font-semibold " +
                      (order.status === "paid"
                        ? "bg-brand-green/15 text-brand-green"
                        : order.status === "cancelled" || order.status === "refunded"
                          ? "bg-red-500/15 text-red-400"
                          : "bg-amber-400/15 text-amber-400")
                    }
                  >
                    {STATUS_LABEL[order.status] ?? order.status}
                  </span>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="text-sm">
                    <p className="font-medium text-white">{order.payer.name || "—"}</p>
                    <p className="text-zinc-500">{order.payer.phone || "—"}</p>
                    <p className="text-zinc-500">{order.payer.email || "—"}</p>
                    <p className="mt-1 text-zinc-400">
                      {order.delivery === "envio" ? `Envío a ${order.address || "coordinado"}` : "Retiro en el taller"}
                    </p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-white">
                      Total: {formatPrice(order.total)}
                    </p>
                    <p className="text-zinc-500">
                      Pago: {order.paymentMethod === "mp" ? "MercadoPago" : "WhatsApp"}
                    </p>
                    <p className="mt-2 text-xs text-zinc-500">
                      {order.paidAt
                        ? `Pagado el ${new Date(order.paidAt).toLocaleString("es-UY")}`
                        : order.status === "pending"
                          ? "Aún no pagado"
                          : ""}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-1 border-t border-white/8 pt-4">
                  {order.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-3 text-sm"
                    >
                      <span className="text-zinc-300">
                        {item.title}{" "}
                        <span className="text-zinc-600">x{item.quantity}</span>
                      </span>
                      <span className="text-zinc-400">
                        {formatPrice(item.unit_price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {order.status === "pending" && (
                  <button
                    onClick={() => cancelOrder(order.id)}
                    className="mt-4 inline-flex items-center gap-2 rounded-full border border-red-500/30 px-4 py-2 text-xs font-semibold text-red-400 transition-colors hover:bg-red-500/10"
                  >
                    <XCircle className="h-4 w-4" />
                    Cancelar y liberar stock
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {products.filter((p) => p.stock_mode === "stock").length > 0 && (
          <div className="mt-8 rounded-3xl border border-white/8 bg-white/[0.03] p-6">
            <h2 className="font-display text-lg font-semibold text-white">Stock</h2>
            <p className="mt-1 text-xs text-zinc-500">
              Editá el stock disponible. "Sincronizar catálogo" agrega productos nuevos desde
              Sanity sin pisar las reservas hechas acá.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {products
                .filter((p) => p.stock_mode === "stock")
                .map((p) => (
                  <StockRow key={p.id} product={p} onChange={(q) => updateStock(p.id, q)} />
                ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function StockRow({
  product,
  onChange,
}: {
  product: { title: string; quantity: number };
  onChange: (quantity: number) => void;
}) {
  const [value, setValue] = useState(String(product.quantity));
  const dirty = Number(value) !== product.quantity;
  const valid = Number.isInteger(Number(value)) && Number(value) >= 0;

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-white">{product.title}</p>
        <p className="text-xs text-zinc-500">Stock actual: {product.quantity}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <input
          type="number"
          min={0}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-16 rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-center text-sm text-white focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
        />
        <button
          onClick={() => onChange(Number(value))}
          disabled={!dirty || !valid}
          className="rounded-lg bg-brand-blue px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white hover:text-brand-black disabled:cursor-not-allowed disabled:opacity-40"
        >
          Guardar
        </button>
      </div>
    </div>
  );
}
