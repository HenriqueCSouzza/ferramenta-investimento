import Link from "next/link";
import type { Post } from "@/content";
import { formatDate } from "@/utils/date";

export function RelatedPosts({ posts }: { posts: Post[] }) {
  if (!posts?.length) return null;

  return (
    <section className="mt-12">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Leia também</h2>
        <Link href="/blog" className="text-sm underline">
          Ver todos
        </Link>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {posts.map((p) => (
          <article
            key={p.slug}
            className="rounded-2xl border bg-white/40 p-4 shadow-sm"
          >
            <Link
              href={`/blog/${p.slug}`}
              className="text-base font-semibold underline"
            >
              {p.title}
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              {p.description}
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              {formatDate(new Date(p.date))}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
