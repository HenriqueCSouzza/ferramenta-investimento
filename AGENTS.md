# Finanças Fácil — Agent Guidelines

## Project Overview

Brazilian financial calculators and simulators built with Next.js. All UI text is Portuguese; code is English. Live at https://financasfacil.app.br.

## Tech Stack

- Next.js 16 (App Router), React 19, TypeScript 5 (strict)
- Tailwind CSS v4, shadcn/ui (New York style)
- Velite for MDX blog content, Recharts for charts
- React Hook Form + Zod (feature-architecture tools only)
- Google Tag Manager via `@next/third-parties`

## Build & Dev

```bash
npm run dev     # start dev server
npm run build   # production build (runs Velite automatically)
npm run lint    # ESLint
```

No test framework is configured.

## Architecture

### Route Group

All tools live under `app/(finance)/<tool-slug>/page.tsx`. The `(finance)` group does not affect URLs.

### Two Implementation Patterns for Tools

**Pattern A — Full Feature Architecture** (preferred for new tools):

- Example: `features/compound-interest/` with `domain/` (models, pure logic, CSV export) and `ui/` (form, layout, chart, table)
- Page is a thin wrapper: `app/(finance)/simulador-juros-compostos/page.tsx` imports the layout
- Uses React Hook Form + Zod, localStorage persistence, Recharts visualization

**Pattern B — Inline Page Component** (legacy, most existing tools):

- Single `"use client"` page component with inline `useState`, `useMemo`, calculation, and CSV export
- See `app/(finance)/calculadora-cet/page.tsx` as a representative example

### Content / Blog

- Source: `content/posts/*.mdx` with YAML frontmatter (slug, title, description, date, tags)
- Compiled by Velite into `.velite/`; re-exported via `content/index.ts`
- Routes: `/blog` (index) and `/blog/[slug]` (post with `generateStaticParams`)
- MDX components available: `BlogHeroImage`, `Image`, `LinkTool`

## Conventions

### Code Style

- Use `cn()` from `@/lib/utils` for class merging (clsx + tailwind-merge)
- shadcn/ui primitives live in `components/ui/` and use `data-slot` attributes
- Currency formatting: `new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })`
- Number parsing from input: `Number(v.replace(/,/g, "."))`

### Analytics

Every tool must track:

- `tool_viewed` on mount (useEffect)
- `tool_used` on calculation
- `export_result` on CSV export (if applicable)
  Use `track()` from `@/lib/analytics`.

### Tool Registry

When adding a new tool, register it in `lib/tools-catalog.ts` (add to `TOOLS` array). This drives the header dropdown and related-tools mappings.

### Related Content

- `lib/related.ts` — tag-based related posts scoring
- `lib/related-tools.ts` — curated `CURATED_BY_POST_SLUG` mapping
  Update these when adding posts or tools.

## Key Files

| File                   | Purpose                                    |
| ---------------------- | ------------------------------------------ |
| `lib/tools-catalog.ts` | Canonical tool registry                    |
| `lib/analytics.ts`     | GTM `dataLayer` helpers                    |
| `velite.config.ts`     | MDX content pipeline                       |
| `next.config.mjs`      | Velite build integration                   |
| `app/sitemap.ts`       | Static sitemap (update when adding routes) |

## Pitfalls

- Do not forget to update `app/sitemap.ts` when adding new pages.
- Do not forget to register new tools in `lib/tools-catalog.ts`.
- Velite runs automatically during build/dev; do not manually edit `.velite/`.
- The project has no backend; all calculations are client-side except the currency converter (Frankfurter API).
