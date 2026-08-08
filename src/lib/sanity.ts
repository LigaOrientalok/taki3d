import { createClient, type ClientConfig } from "@sanity/client";
import { MOCK_PRODUCTS, type Product } from "./store";

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID ?? "";
const dataset = import.meta.env.VITE_SANITY_DATASET ?? "production";

function fallbackProducts(): Product[] {
  return import.meta.env.DEV ? MOCK_PRODUCTS : [];
}

const config: ClientConfig = {
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: true,
};

export const sanityClient = projectId ? createClient(config) : null;

function optimizeImage(url: string, width: number): string {
  if (!url) return url;
  return `${url.split("?")[0]}?auto=format&fit=max&w=${width}&q=70`;
}

const CACHE_TTL = 5 * 60 * 1000;
const cache = new Map<string, { data: unknown; expires: number }>();

function withCache<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return Promise.resolve(hit.data as T);
  return fetcher().then((data) => {
    cache.set(key, { data, expires: Date.now() + CACHE_TTL });
    return data;
  });
}

const FETCH_TIMEOUT = 10000;

function withTimeout<T>(promise: Promise<T>, ms = FETCH_TIMEOUT): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Timeout de Sanity")), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

const PRODUCT_QUERY = `*[_type == "product"] | order(_createdAt desc) {
  _id,
  title,
  "slug": slug.current,
  description,
  price,
  stockMode,
  quantity,
  category,
  featured,
  "images": images[].asset->url,
  "video": video.asset->url,
  placeholderGradient
}`;

interface SanityProductDoc {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  price: number;
  stockMode: "stock" | "pedido";
  quantity: number;
  category?: string;
  featured?: boolean;
  images?: string[];
  video?: string;
  placeholderGradient?: string;
}

function mapDoc(doc: SanityProductDoc): Product {
  return {
    id: doc._id,
    slug: doc.slug,
    title: doc.title,
    description: doc.description ?? "",
    price: doc.price,
    stockMode: doc.stockMode,
    quantity: doc.quantity ?? 0,
    category: doc.category ?? "General",
    featured: doc.featured ?? false,
    images: (doc.images ?? []).map((url) => optimizeImage(url, 1000)),
    video: doc.video,
    placeholder: {
      gradient: doc.placeholderGradient || "from-brand-blue/40 to-brand-black",
      iconKey: "Box",
    },
  };
}

export async function fetchProducts(): Promise<Product[]> {
  if (!sanityClient) return fallbackProducts();
  return withCache("products", () =>
    withTimeout(sanityClient.fetch(PRODUCT_QUERY))
      .then((docs) => {
        const list = docs as SanityProductDoc[];
        if (!list || list.length === 0) return fallbackProducts();
        return list.map(mapDoc);
      })
      .catch((error) => {
        console.warn("No se pudieron cargar los productos de Sanity.", error);
        return fallbackProducts();
      }),
  );
}
