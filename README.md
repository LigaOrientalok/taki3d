# Taki3D

Landing page para un estudio de figuras 3D personalizadas: coleccionables, esculturas y piezas hechas a medida.

**Sitio en producción:** https://taki3d.vercel.app

## Secciones

- **Inicio** — presentación del estudio con visual 3D animado
- **Sobre mí** — historia y proceso de trabajo
- **Servicios** — modelado, impresión, pintura, diseño personalizado, coleccionables y envíos
- **Productos** — catálogo de figuras con ilustraciones de ejemplo
- **Contacto** — formulario de cotización y datos de contacto

## Stack

- [Next.js](https://nextjs.org) 16 (App Router)
- [Tailwind CSS](https://tailwindcss.com) v4
- [TypeScript](https://www.typescriptlang.org)
- Deploy en [Vercel](https://vercel.com)

## Desarrollo

```bash
npm install      # instalar dependencias
npm run dev      # servidor de desarrollo en http://localhost:3000
```

## Comandos útiles

```bash
npm run lint     # revisar el código con ESLint
npm run build    # build de producción
npm run start    # servir el build de producción
```

## Despliegue

El proyecto está conectado a Vercel. Cada `git push` a la rama `main` lanza un deploy automático.

## Personalización

- Figuras de ejemplo: `components/ProductFigure.tsx`
- Catálogo de productos: `components/Products.tsx`
- Datos de contacto: `components/Contact.tsx`
