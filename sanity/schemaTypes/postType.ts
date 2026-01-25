import { DocumentTextIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const postType = defineType({
  name: "post",
  title: "Post",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      validation: (r) => r.required().min(10),
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
      title: "Descrição (SEO)",
      type: "text",
      rows: 3,
      validation: (r) => r.required().min(50).max(160),
      description: "Usada como meta description e no card do blog.",
    }),

    defineField({
      name: "author",
      title: "Autor",
      type: "reference",
      to: [{ type: "author" }],
    }),

    defineField({
      name: "mainImage",
      title: "Imagem principal",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Texto alternativo (alt)",
          type: "string",
          validation: (r) => r.required().min(5),
        }),
      ],
    }),

    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      description: "Use tags para 'Leia também' automático e cluster SEO.",
    }),

    // Se você quiser manter categories como referência, OK.
    // Para começar rápido, tags já resolve.

    defineField({
      name: "categories",
      title: "Categorias",
      type: "array",
      of: [
        defineArrayMember({ type: "reference", to: [{ type: "category" }] }),
      ],
    }),

    defineField({
      name: "publishedAt",
      title: "Publicado em",
      type: "datetime",
      validation: (r) => r.required(),
    }),

    defineField({
      name: "body",
      title: "Conteúdo",
      type: "blockContent",
      validation: (r) => r.required(),
    }),

    // Diferencial do seu site: interligar conteúdo -> ferramenta
    defineField({
      name: "primaryTool",
      title: "Ferramenta principal",
      type: "string",
      description:
        "ID da ferramenta principal (ex.: simulador-juros-compostos, calculadora-cet).",
    }),

    defineField({
      name: "relatedTools",
      title: "Ferramentas relacionadas",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      description:
        "2–3 IDs de ferramentas relacionadas (ex.: conversor-taxas, inflacao-vs-rendimento).",
    }),
  ],

  preview: {
    select: {
      title: "title",
      author: "author.name",
      media: "mainImage",
      publishedAt: "publishedAt",
    },
    prepare(selection) {
      const { author, publishedAt } = selection as {
        author?: string;
        publishedAt?: string;
      };

      const subtitleParts = [];
      if (author) subtitleParts.push(author);
      if (publishedAt)
        subtitleParts.push(new Date(publishedAt).toLocaleDateString("pt-BR"));

      return {
        ...selection,
        subtitle: subtitleParts.length ? subtitleParts.join(" • ") : undefined,
      };
    },
  },
});
