function Cube() {
  const size = 56;
  const half = size / 2;
  const faces = [
    `rotateY(0deg) translateZ(${half}px)`,
    `rotateY(180deg) translateZ(${half}px)`,
    `rotateY(-90deg) translateZ(${half}px)`,
    `rotateY(90deg) translateZ(${half}px)`,
    `rotateX(90deg) translateZ(${half}px)`,
    `rotateX(-90deg) translateZ(${half}px)`,
  ];
  return (
    <div style={{ perspective: "600px" }}>
      <div className="animate-cube relative" style={{ width: size, height: size }}>
        {faces.map((transform, i) => (
          <div
            key={i}
            className="absolute inset-0 border border-cyan-400/60 bg-cyan-500/10 shadow-inner"
            style={{ transform, boxShadow: "inset 0 0 20px rgba(34,211,238,0.25)" }}
          />
        ))}
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section id="inicio" className="relative flex min-h-screen items-center overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(139,92,246,0.12), transparent 45%), radial-gradient(circle at 80% 70%, rgba(34,211,238,0.12), transparent 45%)",
        }}
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 px-6 pt-28 pb-16 lg:grid-cols-2">
        <div className="text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-cyan-300">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse-glow" />
            Figuras coleccionables personalizadas
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Tu personaje favorito,{" "}
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              cobrado vida
            </span>{" "}
            en 3D
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-zinc-400 lg:mx-0">
            Diseño, esculpo y pinto figuras 3D únicas y coleccionables. Envíanos tu
            idea o tu personaje y lo convertimos en una pieza física de alta calidad.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
            <a
              href="#productos"
              className="rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition-transform hover:scale-105"
            >
              Ver productos
            </a>
            <a
              href="#contacto"
              className="rounded-full border border-white/15 bg-white/5 px-7 py-3 text-sm font-semibold text-white transition-colors hover:border-white/30 hover:bg-white/10"
            >
              Contactar
            </a>
          </div>

          <div className="mt-12 flex items-center justify-center gap-10 lg:justify-start">
            {[
              { value: "500+", label: "Figuras creadas" },
              { value: "120+", label: "Clientes felices" },
              { value: "5★", label: "Valoración media" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="mt-1 text-xs text-zinc-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto flex h-[380px] w-full max-w-md items-center justify-center sm:h-[460px]">
          <div className="absolute h-64 w-64 rounded-full bg-gradient-to-br from-violet-600/40 to-cyan-500/40 blur-3xl sm:h-80 sm:w-80" />

          <div className="absolute h-72 w-72 rounded-full border border-white/5 sm:h-96 sm:w-96" />

          <div className="absolute h-60 w-60 animate-spin-slow rounded-full border-2 border-dashed border-cyan-400/30 sm:h-72 sm:w-72" />

          <div
            className="relative h-52 w-52 animate-float rounded-full sm:h-64 sm:w-64"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, #c4b5fd, #7c3aed 45%, #1e1b4b 85%)",
              boxShadow:
                "0 0 90px rgba(139,92,246,0.55), inset -24px -24px 60px rgba(0,0,0,0.5)",
            }}
          >
            <div className="absolute left-12 top-10 h-8 w-16 rounded-full bg-white/30 blur-md" />
          </div>

          <div className="absolute right-4 top-8 animate-float" style={{ animationDelay: "1s" }}>
            <Cube />
          </div>

          <div
            className="absolute left-2 bottom-10 h-14 w-14 animate-float rounded-full border border-fuchsia-400/50 bg-fuchsia-500/10"
            style={{ animationDelay: "2s", boxShadow: "inset 0 0 20px rgba(217,70,239,0.3)" }}
          />

          <div
            className="absolute top-1/4 left-8 h-3 w-3 rounded-full bg-cyan-300 animate-float"
            style={{ animationDelay: "0.5s" }}
          />
          <div
            className="absolute bottom-1/4 right-10 h-2 w-2 rounded-full bg-violet-300 animate-float"
            style={{ animationDelay: "1.5s" }}
          />
          <div
            className="absolute top-10 right-1/3 h-2 w-2 rounded-full bg-fuchsia-300 animate-float"
            style={{ animationDelay: "2.5s" }}
          />
        </div>
      </div>
    </section>
  );
}
