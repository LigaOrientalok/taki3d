"use client";

import { useState, type FormEvent } from "react";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
  };

  if (sent) {
    return (
      <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-500/5 p-10 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400">
          <svg
            className="h-7 w-7 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mt-5 text-xl font-semibold text-white">¡Mensaje enviado!</h3>
        <p className="mt-2 max-w-xs text-sm text-zinc-400">
          Gracias por escribirnos. Te responderemos lo antes posible para empezar a
          crear tu figura.
        </p>
        <button
          onClick={() => setSent(false)}
          className="mt-6 text-sm font-medium text-cyan-400 hover:text-cyan-300"
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.03] p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="nombre" className="mb-2 block text-sm font-medium text-zinc-300">
            Nombre
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            required
            placeholder="Tu nombre"
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition-colors focus:border-cyan-400/60"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-zinc-300">
            Correo
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="tu@correo.com"
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition-colors focus:border-cyan-400/60"
          />
        </div>
      </div>

      <div>
        <label htmlFor="tema" className="mb-2 block text-sm font-medium text-zinc-300">
          Tema
        </label>
        <select
          id="tema"
          name="tema"
          defaultValue="Figura personalizada"
          className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-cyan-400/60"
        >
          <option>Figura personalizada</option>
          <option>Compra de una figura existente</option>
          <option>Pintura y acabado</option>
          <option>Diseño 3D</option>
          <option>Otro</option>
        </select>
      </div>

      <div>
        <label htmlFor="mensaje" className="mb-2 block text-sm font-medium text-zinc-300">
          Mensaje
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          required
          rows={5}
          placeholder="Cuéntanos sobre tu figura ideal, tamaño, estilo, referencia..."
          className="w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition-colors focus:border-cyan-400/60"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-transform hover:scale-[1.02]"
      >
        Enviar mensaje
      </button>
    </form>
  );
}
