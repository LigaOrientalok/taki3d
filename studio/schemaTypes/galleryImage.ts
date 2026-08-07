import { defineField, defineType } from "sanity";

export const galleryImage = defineType({
  name: "galleryImage",
  title: "Foto de galería",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Categoría",
      type: "string",
      options: {
        list: [
          { title: "Decoración", value: "Decoración" },
          { title: "Anime", value: "Anime" },
          { title: "Gamer", value: "Gamer" },
          { title: "Empresas", value: "Empresas" },
          { title: "Repuestos", value: "Repuestos" },
          { title: "Hogar", value: "Hogar" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Foto",
      description: "Subí la foto del trabajo terminado",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Orden",
      description: "Menor número = aparece primero",
      type: "number",
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: "title", media: "image", category: "category" },
    prepare: (selection) => ({
      title: selection.title,
      subtitle: selection.category ?? "",
      media: selection.media,
    }),
  },
});
