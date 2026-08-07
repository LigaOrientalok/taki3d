import type { LucideIcon } from "lucide-react";
import {
  Cake,
  Clapperboard,
  Gamepad2,
  Heart,
  Home,
  KeyRound,
  ShoppingBag,
  Sparkles,
  Wrench,
} from "lucide-react";

export type StockMode = "stock" | "pedido";

export interface Product {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  price: number;
  stockMode: StockMode;
  quantity: number;
  images: string[];
  video?: string;
  placeholder: {
    gradient: string;
    icon: LucideIcon;
  };
  featured?: boolean;
}

export interface Category {
  name: string;
  icon: LucideIcon;
}

export const CATEGORIES: Category[] = [
  { name: "Figuras", icon: Sparkles },
  { name: "Anime", icon: Clapperboard },
  { name: "Llaveros", icon: KeyRound },
  { name: "Gamer", icon: Gamepad2 },
  { name: "Hogar", icon: Home },
  { name: "Repuestos", icon: Wrench },
  { name: "Repostería", icon: Cake },
  { name: "Empresas", icon: ShoppingBag },
  { name: "Regalos", icon: Heart },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "figura-anime-mock",
    slug: "figura-anime-generica",
    title: "Figura anime chibi",
    category: "Anime",
    description:
      "Figura estilo chibi de tu personaje favorito, hecha a pedido. Tamaño 15 cm con base incluida. Elegí tu personaje y lo diseñamos.",
    price: 1800,
    stockMode: "pedido",
    quantity: 0,
    images: [],
    placeholder: { gradient: "from-brand-blue/50 to-brand-black", icon: Clapperboard },
    featured: true,
  },
  {
    id: "figura-mascota",
    slug: "figura-mascota",
    title: "Figura de tu mascota",
    category: "Figuras",
    description:
      "Una réplica 3D de tu perro o gato lista para exhibir. Envianos una foto y la convertimos en una figura única de 10 cm. Acabado liso y detalle sorprendente.",
    price: 1400,
    stockMode: "pedido",
    quantity: 0,
    images: [],
    placeholder: { gradient: "from-brand-blue/50 to-brand-black", icon: Heart },
    featured: true,
  },
  {
    id: "busto-personalizado",
    slug: "busto-personalizado",
    title: "Busto personalizado",
    category: "Figuras",
    description:
      "Busto en relieve a partir de una foto. Ideal para regalar un momento inolvidable. Tamaño 12 cm, disponible en varios colores.",
    price: 2200,
    stockMode: "pedido",
    quantity: 0,
    images: [],
    placeholder: { gradient: "from-brand-blue/60 to-brand-black", icon: Sparkles },
  },
  {
    id: "llavero-nombre",
    slug: "llavero-nombre",
    title: "Llavero con nombre",
    category: "Llaveros",
    description:
      "Llavero personalizado con tu nombre, inicial o frase. Resistente, liviano y con aro metálico incluido. Varios colores disponibles.",
    price: 250,
    stockMode: "stock",
    quantity: 50,
    images: [],
    placeholder: { gradient: "from-brand-blue/40 to-brand-black", icon: KeyRound },
    featured: true,
  },
  {
    id: "set-llaveros-empresa",
    slug: "set-llaveros-empresa",
    title: "Set de llaveros para empresa",
    category: "Empresas",
    description:
      "Producción de llaveros con el logo de tu empresa, para regalar en eventos, clientes o empleados. Pack de 20 unidades.",
    price: 2200,
    stockMode: "stock",
    quantity: 12,
    images: [],
    placeholder: { gradient: "from-brand-green/40 to-brand-black", icon: ShoppingBag },
  },
  {
    id: "soporte-auriculares",
    slug: "soporte-auriculares",
    title: "Soporte de auriculares",
    category: "Gamer",
    description:
      "Soporte de escritorio con diseño ergonómico y tope de goma. Mantiene tus auriculares a mano y tu mesa ordenada. Armado incluido.",
    price: 800,
    stockMode: "stock",
    quantity: 8,
    images: [],
    placeholder: { gradient: "from-brand-blue/50 to-brand-black", icon: Gamepad2 },
    featured: true,
  },
  {
    id: "organizador-escritorio",
    slug: "organizador-escritorio",
    title: "Organizador de escritorio",
    category: "Hogar",
    description:
      "Organizador modular con compartimentos para lápices, celular, auriculares y accesorios. A medida de tu espacio.",
    price: 1250,
    stockMode: "stock",
    quantity: 5,
    images: [],
    placeholder: { gradient: "from-brand-green/40 to-brand-black", icon: Home },
  },
  {
    id: "portalapices",
    slug: "portalapices",
    title: "Portalápices geométrico",
    category: "Hogar",
    description:
      "Portalápices con diseño geométrico moderno. Un toque original para tu escritorio, disponible en varios colores.",
    price: 350,
    stockMode: "stock",
    quantity: 15,
    images: [],
    placeholder: { gradient: "from-brand-blue/40 to-brand-black", icon: Home },
  },
  {
    id: "engranaje-a-medida",
    slug: "engranaje-a-medida",
    title: "Engranaje a medida",
    category: "Repuestos",
    description:
      "Repuesto exacto para tu máquina o electrodoméstico. Envianos medidas o la pieza rota y la replicamos en material resistente.",
    price: 600,
    stockMode: "pedido",
    quantity: 0,
    images: [],
    placeholder: { gradient: "from-brand-blue/50 to-brand-black", icon: Wrench },
  },
  {
    id: "clip-montaje",
    slug: "clip-montaje",
    title: "Clip de montaje",
    category: "Repuestos",
    description:
      "Clips y piezas de fijación imposibles de conseguir en plaza. Producción rápida y en materiales según el uso.",
    price: 150,
    stockMode: "pedido",
    quantity: 0,
    images: [],
    placeholder: { gradient: "from-brand-blue/40 to-brand-black", icon: Wrench },
  },
  {
    id: "cortante-galletas",
    slug: "cortante-galletas",
    title: "Cortante de galletas",
    category: "Repostería",
    description:
      "Cortador de galletas con la forma que quieras: letras, números, personajes o logos. Apto para alimentos, con borde liso.",
    price: 350,
    stockMode: "pedido",
    quantity: 0,
    images: [],
    placeholder: { gradient: "from-brand-blue/50 to-brand-black", icon: Cake },
  },
  {
    id: "figura-anime",
    slug: "figura-anime",
    title: "Figura anime personalizada",
    category: "Figuras",
    description:
      "Figuras coleccionables de tus personajes favoritos, hechas a pedido. Tamaños de 15 a 30 cm con base incluida.",
    price: 3200,
    stockMode: "pedido",
    quantity: 0,
    images: [],
    placeholder: { gradient: "from-brand-blue/50 to-brand-black", icon: Sparkles },
  },
  {
    id: "pack-fichas-gaming",
    slug: "pack-fichas-gaming",
    title: "Pack de fichas gaming",
    category: "Gamer",
    description:
      "Set de fichas y marcadores personalizados para tus partidas de mesa. Diseñamos la temática a tu gusto.",
    price: 900,
    stockMode: "pedido",
    quantity: 0,
    images: [],
    placeholder: { gradient: "from-brand-blue/40 to-brand-black", icon: Gamepad2 },
  },
];

export function isAvailable(product: Product): boolean {
  return product.stockMode === "pedido" || product.quantity > 0;
}

export function maxOrderable(product: Product): number {
  if (product.stockMode === "pedido") return 99;
  return product.quantity;
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("es-UY", {
    style: "currency",
    currency: "UYU",
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
  }).format(value);
}

export function stockLabel(product: Product): string {
  if (product.stockMode === "pedido") return "Bajo pedido";
  if (product.quantity <= 0) return "Sin stock";
  if (product.quantity <= 5) return `Quedan ${product.quantity}`;
  return `En stock: ${product.quantity}`;
}
