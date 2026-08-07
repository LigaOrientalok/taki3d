import { defineField, defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "Producto",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Nombre del producto",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "price",
      title: "Precio (UYU)",
      type: "number",
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "description",
      title: "Descripción",
      type: "text",
      rows: 6,
    }),
    defineField({
      name: "category",
      title: "Categoría",
      type: "string",
      options: {
        list: [
          { title: "Figuras", value: "Figuras" },
          { title: "Llaveros", value: "Llaveros" },
          { title: "Gamer", value: "Gamer" },
          { title: "Hogar", value: "Hogar" },
          { title: "Repuestos", value: "Repuestos" },
          { title: "Repostería", value: "Repostería" },
          { title: "Empresas", value: "Empresas" },
          { title: "Regalos", value: "Regalos" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "stockMode",
      title: "Modo de venta",
      type: "string",
      options: {
        list: [
          { title: "Con stock (cantidad real)", value: "stock" },
          { title: "Bajo pedido (se imprime al comprar)", value: "pedido" },
        ],
        layout: "radio",
      },
      initialValue: "pedido",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "quantity",
      title: "Cantidad disponible",
      description: "Solo aplica si el modo de venta es 'Con stock'",
      type: "number",
      initialValue: 0,
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: "featured",
      title: "Destacado",
      description: "Los productos destacados aparecen primero en la tienda",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "placeholderGradient",
      title: "Color de fondo (si no subís fotos)",
      type: "string",
      initialValue: "from-brand-blue/40 to-brand-black",
      options: {
        list: [
          { title: "Azul", value: "from-brand-blue/40 to-brand-black" },
          { title: "Verde", value: "from-brand-green/40 to-brand-black" },
          { title: "Violeta", value: "from-[#7c5cff]/40 to-brand-black" },
          { title: "Amarillo", value: "from-[#f5a524]/40 to-brand-black" },
        ],
      },
    }),
    defineField({
      name: "images",
      title: "Fotos",
      description: "Subí una o más fotos del producto",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "video",
      title: "Video (opcional)",
      description: "Subí un video mostrando el producto",
      type: "file",
      options: { accept: "video/*" },
    }),
  ],
  preview: {
    select: { title: "title", media: "images.0", price: "price" },
    prepare: (selection) => ({
      title: selection.title,
      subtitle: selection.price ? `$${selection.price} UYU` : "",
      media: selection.media,
    }),
  },
});
