import { useEffect, useState } from "react";
import { fetchProducts } from "@/lib/sanity";
import { MOCK_PRODUCTS, type Product } from "@/lib/store";

interface LiveStockEntry {
  stockMode: "stock" | "pedido";
  quantity: number | null;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const applyLiveStock = (list: Product[]) => {
      fetch("/api/stock", { signal: AbortSignal.timeout(6000) })
        .then((res) => (res.ok ? res.json() : null))
        .then((data: { products?: Record<string, LiveStockEntry> } | null) => {
          if (!active || !data || !data.products) {
            setProducts(list);
            setLoading(false);
            return;
          }
          const productsData = data.products;
          const merged = list.map((p) => {
            const live = productsData[p.id];
            if (live && live.stockMode === "stock" && typeof live.quantity === "number") {
              return { ...p, quantity: live.quantity };
            }
            return p;
          });
          setProducts(merged);
          setLoading(false);
        })
        .catch(() => {
          if (active) {
            setProducts(list);
            setLoading(false);
          }
        });
    };

    fetchProducts().then((data) => {
      if (!active) return;
      applyLiveStock(data);
    });

    return () => {
      active = false;
    };
  }, []);

  return { products, loading };
}
