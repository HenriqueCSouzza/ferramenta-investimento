import Link from "next/link";
import { posts } from "@/content";

const fmt = new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" });

export default function BlogIndexPage() {
  const sorted = [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Blog</h1>

      <div className="mt-8 space-y-6">
        {sorted.map((p) => (
          <article key={p.slug} className="space-y-1">
            <Link href={`/blog/${p.slug}`} className="text-xl underline">
              {p.title}
            </Link>
            <p className="text-sm text-muted-foreground">{p.description}</p>
            <p className="text-xs text-muted-foreground">
              {fmt.format(new Date(p.date))}
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}
