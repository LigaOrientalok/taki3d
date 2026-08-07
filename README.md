# TAKI3D — Impresión 3D Profesional

Landing page premium para TAKI3D, un servicio de impresión 3D en Uruguay.
Slogan: **"Transformamos tus ideas en realidad."**

## Stack

- [Vite 8](https://vitejs.dev) + [React 19](https://react.dev) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com) (tokens en `src/index.css` vía `@theme`)
- [Framer Motion 13](https://motion.dev) (animaciones y scroll)
- [Embla Carousel](https://www.embla-carousel.com) (testimonios)
- [Lenis](https://lenis.darkroom.engineering) (scroll suave)
- [React Router 7](https://reactrouter.com)
- shadcn-style UI kit (`src/components/ui`)

## Comandos

```bash
npm install      # instalar dependencias
npm run dev      # servidor de desarrollo
npm run build    # typecheck (tsc) + build de producción en dist/
npm run preview  # previsualizar el build
npm run lint     # typecheck (tsc --noEmit)
```

## Estructura

```
src/
├── components/      # secciones y componentes reutilizables
│   ├── ui/          # button, input, textarea, badge
│   └── ...
├── hooks/           # useLenis, useCounter, useScrollToTop
├── layout/          # Layout (Loader, cursor, navbar, footer, outlet)
├── pages/           # Home, NotFound
├── lib/             # utils y constantes de contacto
└── index.css        # tema y utilidades
```

## Datos de contacto

Las constantes de contacto están en `src/lib/utils.ts`
(WhatsApp, email e Instagram). Actualizá el número real de WhatsApp ahí.

## Deploy

Configurado para [Vercel](https://vercel.com) (`vercel.json`):
build `npm run build`, output `dist`, SPA rewrites.

## SEO

`index.html` incluye meta title/description, Open Graph, Twitter Cards,
Schema.org y favicon. Se actualizan en `index.html`.
