---
name: add-financial-tool
description: "Add a new financial calculator or simulator to the Finanças Fácil app. Use when creating a new tool page, adding tool registry entries, or implementing calculation logic with CSV export and analytics tracking."
---

# Add Financial Tool

## When to Use

- Creating a new calculator or simulator under `app/(finance)/`
- Adding a tool to the canonical registry
- Implementing the full feature architecture (domain + UI separation)

## Procedure

### 1. Choose Implementation Pattern

**For simple tools** (few inputs, no chart): Use Pattern B — inline page component.
**For complex tools** (many inputs, chart, table, persistence): Use Pattern A — full feature architecture.

### 2. Create the Route

Create `app/(finance)/<tool-slug>/page.tsx`.

- Slug must be Portuguese kebab-case (e.g., `simulador-renda-fixa`, `calculadora-iof`)
- Page component name: `<ToolSlug>PascalCase>Page`
- Add `"use client"` directive

### 3. Implement the Tool

**Pattern A (Full Feature)** — see `features/compound-interest/`:

```
features/<tool-kebab>/
  domain/
    models.ts          # Input/Result/Row types
    calculate-<tool>.ts # Pure calculation function
    csv-export.ts      # Build CSV string from result rows
  ui/
    <Tool>Form.tsx     # React Hook Form + Zod schema
    <Tool>Layout.tsx   # Page wrapper + analytics tracking
    <Tool>Chart.tsx    # Recharts visualization (optional)
    <Tool>ResultTable.tsx # shadcn/ui Table display (optional)
```

**Pattern B (Inline Page)** — see `app/(finance)/calculadora-cet/page.tsx`:

- Single component with `useState` for inputs
- `useMemo` for calculations
- Inline `exportCSV()` function
- `useEffect` with `track({ event: "tool_viewed", ... })`
- Call `track({ event: "tool_used", ... })` on calculation

### 4. Register the Tool

Add the tool to `lib/tools-catalog.ts` in the `TOOLS` array:

```ts
{
  id: "<tool-slug>",
  href: "/<tool-slug>",
  label: "<Portuguese label>",
  tags: ["tag1", "tag2", "tag3"],
}
```

### 5. Update Sitemap

Add the new route to `app/sitemap.ts`.

### 6. Add Related Blog Post (Optional)

If a blog post covers this tool:

- Add the post to `content/posts/<slug>.mdx`
- Map it in `lib/related-tools.ts` under `CURATED_BY_POST_SLUG`

## Conventions

- Currency formatting: `new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })`
- Number parsing from inputs: `Number(v.replace(/,/g, "."))`
- Analytics events: `tool_viewed`, `tool_used`, `export_result`
- CSV separator: semicolon (`;`) for Brazilian Excel compatibility
- All UI labels and helper text must be in Portuguese

## References

- [Feature architecture example](../../../features/compound-interest/)
- [Inline page example](<../../../app/(finance)/calculadora-cet/page.tsx>)
- [Tool registry](../../../lib/tools-catalog.ts)
