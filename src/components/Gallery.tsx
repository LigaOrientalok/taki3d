import { AnimatePresence, motion } from "framer-motion";
import { Camera, ChevronLeft, ChevronRight, Gamepad2, Heart, Home, Plus, ShoppingBag, Sparkles, Wrench, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import SectionHeading from "./SectionHeading";
import { fetchGalleryImages } from "@/lib/sanity";

type Cat = "Todos" | "Decoración" | "Anime" | "Gamer" | "Empresas" | "Repuestos" | "Hogar";

const categories: Cat[] = ["Todos", "Decoración", "Anime", "Gamer", "Empresas", "Repuestos", "Hogar"];

interface GalleryItem {
  id: string;
  title: string;
  cat: Exclude<Cat, "Todos">;
  gradient: string;
  icon: typeof Home;
  tall?: boolean;
  image?: string;
}

const fallbackItems: GalleryItem[] = [
  { id: "fb-1", title: "Busto realista 3D", cat: "Decoración", gradient: "from-[#28A9FF]/60 to-[#0E0E10]", icon: Sparkles },
  { id: "fb-2", title: "Figura de anime", cat: "Anime", gradient: "from-[#7c5cff]/50 to-[#0E0E10]", icon: Heart, tall: true },
  { id: "fb-3", title: "Mascota en 3D", cat: "Decoración", gradient: "from-[#4CFF84]/40 to-[#0E0E10]", icon: Heart },
  { id: "fb-4", title: "Control custom", cat: "Gamer", gradient: "from-[#28A9FF]/50 to-[#0E0E10]", icon: Gamepad2, tall: true },
  { id: "fb-5", title: "Soporte de auriculares", cat: "Gamer", gradient: "from-[#7c5cff]/40 to-[#0E0E10]", icon: Gamepad2 },
  { id: "fb-6", title: "Merchandising empresa", cat: "Empresas", gradient: "from-[#4CFF84]/40 to-[#0E0E10]", icon: ShoppingBag },
  { id: "fb-7", title: "Bajo relieve con logo", cat: "Empresas", gradient: "from-[#28A9FF]/40 to-[#0E0E10]", icon: ShoppingBag, tall: true },
  { id: "fb-8", title: "Engranaje de repuesto", cat: "Repuestos", gradient: "from-[#f5a524]/40 to-[#0E0E10]", icon: Wrench },
  { id: "fb-9", title: "Clip de montaje", cat: "Repuestos", gradient: "from-[#28A9FF]/40 to-[#0E0E10]", icon: Wrench, tall: true },
  { id: "fb-10", title: "Organizador de escritorio", cat: "Hogar", gradient: "from-[#4CFF84]/40 to-[#0E0E10]", icon: Home },
  { id: "fb-11", title: "Portalápices", cat: "Hogar", gradient: "from-[#7c5cff]/40 to-[#0E0E10]", icon: Home, tall: true },
  { id: "fb-12", title: "Maceta decorativa", cat: "Hogar", gradient: "from-[#f5a524]/40 to-[#0E0E10]", icon: Home },
];

export default function Gallery() {
  const [active, setActive] = useState<Cat>("Todos");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [remoteItems, setRemoteItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    let mounted = true;
    fetchGalleryImages().then((images) => {
      if (!mounted) return;
      if (images.length > 0) {
        setRemoteItems(
          images.map((img, index) => ({
            id: img.id,
            title: img.title,
            cat: (img.category as Exclude<Cat, "Todos">) ?? "Decoración",
            gradient: "from-brand-blue/40 to-brand-black",
            icon: Camera,
            tall: index % 4 === 0,
            image: img.image,
          })),
        );
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const items = remoteItems.length > 0 ? remoteItems : fallbackItems;
  const filtered = items.filter((item) => active === "Todos" || item.cat === active);
  const activeItem = lightbox !== null ? filtered[lightbox] : undefined;

  const close = useCallback(() => setLightbox(null), []);
  const prev = useCallback(
    () => setLightbox((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length)),
    [filtered.length],
  );
  const next = useCallback(
    () => setLightbox((i) => (i === null ? null : (i + 1) % filtered.length)),
    [filtered.length],
  );

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, close, prev, next]);

  return (
    <section id="galeria" className="relative py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Galería"
          title="Algunos de nuestros trabajos"
          description="Cada pieza es diseñada e impresa con dedicación. Tocá cualquier trabajo para verlo en detalle."
        />

        <div className="mt-10 flex flex-wrap justify-center gap-2.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                active === cat
                  ? "bg-brand-blue text-white shadow-lg shadow-brand-blue/25"
                  : "glass text-zinc-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div
          layout
          className="mt-12 columns-1 gap-5 sm:columns-2 lg:columns-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((item, index) => (
              <motion.button
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => setLightbox(index)}
                className="group relative mb-5 block w-full break-inside-avoid overflow-hidden rounded-2xl border border-white/8 text-left"
              >
                <div
                  className={`relative w-full overflow-hidden bg-gradient-to-br ${item.gradient} ${
                    item.tall ? "aspect-[3/4]" : "aspect-[4/3]"
                  }`}
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-white/90 backdrop-blur-sm">
                        <item.icon className="h-7 w-7" />
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute top-3 right-3 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-white/80 backdrop-blur-sm">
                    {item.cat}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="font-display text-base font-semibold text-white">
                      {item.title}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-[11px] text-zinc-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      Ver detalle <Plus className="h-3 w-3" />
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {lightbox !== null && activeItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-brand-gray"
            >
              <div
                className={`relative flex aspect-[16/10] w-full items-center justify-center bg-gradient-to-br ${activeItem.gradient}`}
              >
                {activeItem.image ? (
                  <img
                    src={activeItem.image}
                    alt={activeItem.title}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white/10 text-white backdrop-blur-sm">
                    <activeItem.icon className="h-10 w-10" />
                  </div>
                )}
                <button
                  onClick={close}
                  className="absolute top-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-brand-blue"
                  aria-label="Cerrar"
                >
                  <X className="h-5 w-5" />
                </button>
                <button
                  onClick={prev}
                  className="absolute left-4 grid h-10 w-10 place-items-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-brand-blue"
                  aria-label="Anterior"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-4 grid h-10 w-10 place-items-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-brand-blue"
                  aria-label="Siguiente"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              <div className="flex items-center justify-between gap-4 px-6 py-5">
                <div>
                  <h3 className="font-display text-lg font-semibold text-white">
                    {activeItem.title}
                  </h3>
                  <p className="mt-0.5 text-sm text-zinc-500">
                    Categoría: {activeItem.cat}
                  </p>
                </div>
                <a
                  href="#contacto"
                  onClick={close}
                  className="shrink-0 rounded-full bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-brand-black"
                >
                  Pedir algo así
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
