import { createClient, type ClientConfig } from "@sanity/client";
import { Box } from "lucide-react";
import { MOCK_PRODUCTS, type Product } from "./store";

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID ?? "";
const dataset = import.meta.env.VITE_SANITY_DATASET ?? "production";
const token = import.meta.env.VITE_SANITY_TOKEN ?? undefined;

const config: ClientConfig = {
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: true,
  token,
};

export const sanityClient = projectId ? createClient(config) : null;

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
    images: doc.images ?? [],
    video: doc.video,
    placeholder: {
      gradient: doc.placeholderGradient || "from-brand-blue/40 to-brand-black",
      icon: Box,
    },
  };
}

export async function fetchProducts(): Promise<Product[]> {
  if (!sanityClient) return MOCK_PRODUCTS;
  try {
    const docs = (await sanityClient.fetch(PRODUCT_QUERY)) as SanityProductDoc[];
    if (!docs || docs.length === 0) return MOCK_PRODUCTS;
    return docs.map(mapDoc);
  } catch (error) {
    console.warn("No se pudieron cargar los productos de Sanity, usando catálogo local.", error);
    return MOCK_PRODUCTS;
  }
}
