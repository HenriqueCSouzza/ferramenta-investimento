import { defineField, defineType } from "sanity";

export const post = defineType({
  name: "post",
  title: "Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      title: "Descrição",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "date",
      title: "Data",
      type: "datetime",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "heroImage",
      title: "Imagem principal",
      type: "image",
      options: { hotspot: true },
    }),

    // Conteúdo escalável (Portable Text)
    defineField({
      name: "content",
      title: "Conteúdo",
      type: "array",
      of: [{ type: "block" }],
      validation: (r) => r.required(),
    }),

    // Curadoria escalável: você tira do código e põe no CMS
    defineField({
      name: "relatedTools",
      title: "Ferramentas relacionadas",
      type: "array",
      of: [{ type: "string" }],
      description:
        "IDs/rotas das ferramentas (ex.: simulador-juros-compostos, conversor-taxas).",
    }),
  ],
});
