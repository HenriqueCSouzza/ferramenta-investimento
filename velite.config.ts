import { defineConfig, s } from "velite";

export default defineConfig({
  collections: {
    posts: {
      name: "Post",
      pattern: "posts/*.mdx",
      schema: s.object({
        slug: s.slug("posts"),
        title: s.string().max(120),
        description: s.string().max(180),
        date: s.isodate(),
        tags: s.array(s.string()).optional(),

        // úteis
        metadata: s.metadata(),
        excerpt: s.excerpt(),

        // mdx compilado
        code: s.mdx(),
      }),
    },
  },
});
