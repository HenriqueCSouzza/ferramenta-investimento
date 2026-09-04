---
name: add-blog-post
description: "Add a new blog post to the Finanças Fácil content collection. Use when creating MDX content, updating related posts/tools mappings, or adding SEO metadata for articles."
---

# Add Blog Post

## When to Use

- Creating a new educational article in `content/posts/`
- Updating related content mappings for posts
- Adding frontmatter and MDX components to blog content

## Procedure

### 1. Create the MDX File

Create `content/posts/<slug>.mdx` with this frontmatter:

```yaml
---
title: "<Portuguese title, max 120 chars>"
description: "<Portuguese description, max 180 chars>"
date: "YYYY-MM-DD"
tags: ["tag1", "tag2"]
slug: "<post-slug>"
---
```

### 2. Write Content

- Use Markdown with optional MDX components
- Available components: `BlogHeroImage`, `Image`, `LinkTool`
- Example hero image:
  ```mdx
  <BlogHeroImage
    src="/images/placeholder.jpg"
    alt="Description"
    fill
    sizes="(max-width: 1024px) 100vw, 50vw"
    className="object-cover"
    priority
  />
  ```
- Link to related tools with `<LinkTool href="/tool-slug">Label</LinkTool>`
- Keep content educational and accessible to Brazilian Portuguese readers

### 3. Map Related Tools

If the post relates to existing tools, add the mapping in `lib/related-tools.ts`:

```ts
"<post-slug>": ["tool-id-1", "tool-id-2"],
```

Tool IDs are defined in `lib/tools-catalog.ts`.

### 4. Verify Build

Run `npm run build` to ensure Velite compiles the new post without errors.

## Conventions

- Slug must match the filename (without `.mdx`)
- Date format: ISO 8601 (`YYYY-MM-DD`)
- Tags should overlap with tool tags for better related-content matching
- All content must be in Portuguese
- Maximum title length: 120 characters
- Maximum description length: 180 characters

## References

- [Velite config](../../../velite.config.ts)
- [Existing post example](../../../content/posts/juros-compostos.mdx)
- [Related tools mapping](../../../lib/related-tools.ts)
- [Tool registry](../../../lib/tools-catalog.ts)
