import { MessageCircle } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/utils";
import Reveal from "./Reveal";

export default function CTA() {
  return (
    <section className="relative py-16">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-brand-blue/25 bg-gradient-to-br from-brand-blue/15 via-brand-black to-brand-black px-8 py-16 text-center sm:px-16">
            <div className="absolute -top-24 left-1/2 h-64 w-[560px] -translate-x-1/2 rounded-full bg-brand-blue/20 blur-[100px]" />
            <div className="pointer-events-none absolute inset-0 opacity-[0.3]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
                backgroundSize: "44px 44px",
              }}
            />
            <div className="relative">
              <h2 className="font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                ¿Tenés una idea en mente?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-400">
                Transformamos tus ideas en realidad. Pedí tu presupuesto gratis
                hoy mismo y empezá a crear.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex h-13 items-center justify-center gap-2 rounded-full bg-brand-blue px-8 text-sm font-semibold text-white shadow-lg shadow-brand-blue/25 transition-all duration-300 hover:bg-white hover:text-brand-black"
                >
                  <MessageCircle className="h-4 w-4" />
                  Pedir presupuesto gratis
                </a>
                <a
                  href="#galeria"
                  className="inline-flex h-13 items-center justify-center rounded-full glass px-8 text-sm font-semibold text-white transition-all duration-300 hover:border-brand-blue/50 hover:text-brand-blue"
                >
                  Ver trabajos
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
