import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { Star } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import SectionHeading from "./SectionHeading";

const testimonials = [
  {
    name: "María F.",
    role: "Regalo personalizado",
    text: "Pedí un busto de mi perrito y el resultado fue increíble. Se nota el detalle y la calidad en cada impresión. ¡Súper recomendados!",
  },
  {
    name: "Joaquín R.",
    role: "Prototipo industrial",
    text: "Necesitábamos un prototipo urgente para un proyecto de la empresa y lo tuvimos en 48 horas. Profesionalismo y rapidez total.",
  },
  {
    name: "Lucía G.",
    role: "Llaveros para evento",
    text: "Encargué 200 llaveros personalizados para un evento corporativo. Quedaron perfectos y el trato fue excelente de principio a fin.",
  },
  {
    name: "Federico M.",
    role: "Repuesto funcional",
    text: "Una pieza de una máquina que ya no se fabricaba más. La modelaron y la imprimieron perfecta. Me salvaron la producción.",
  },
  {
    name: "Valentina S.",
    role: "Decoración para el hogar",
    text: "Las figuras decorativas son hermosas. El acabado es de otro nivel y llegaron en perfecto estado hasta mi casa.",
  },
];

export default function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" }, [
    Autoplay({ delay: 4500, stopOnInteraction: false }),
  ]);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  );

  return (
    <section id="testimonios" className="relative py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Testimonios"
          title="Lo que dicen nuestros clientes"
          description="Más de 500 clientes ya transformaron sus ideas en realidad con TAKI3D."
        />

        <div className="mt-14 overflow-hidden" ref={emblaRef}>
          <div className="-ml-4 flex touch-pan-y">
            {testimonials.map((t) => (
              <div key={t.name} className="min-w-0 flex-[0_0_100%] pl-4 sm:flex-[0_0_60%] lg:flex-[0_0_40%]">
                <div className="flex h-full flex-col rounded-2xl border border-white/8 bg-white/[0.03] p-7 transition-colors duration-300 hover:border-brand-blue/30">
                  <div className="flex gap-1 text-brand-blue">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="mt-4 flex-1 text-[15px] leading-relaxed text-zinc-300">
                    "{t.text}"
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-brand-blue to-brand-blue/40 font-display text-sm font-bold text-white">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{t.name}</p>
                      <p className="text-xs text-zinc-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {testimonials.map((t, index) => (
            <button
              key={t.name}
              onClick={() => scrollTo(index)}
              aria-label={`Ir al testimonio ${index + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                selected === index
                  ? "w-8 bg-brand-blue"
                  : "w-2 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
