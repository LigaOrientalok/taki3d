import { useEffect, useState } from "react";
import { fetchProducts } from "@/lib/sanity";
import { MOCK_PRODUCTS, type Product } from "@/lib/store";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchProducts().then((data) => {
      if (active) {
        setProducts(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  return { products, loading };
}
