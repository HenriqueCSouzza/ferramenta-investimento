import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { POSTS_LIST_QUERY } from "@/lib/sanity/queries";

type PostListItem = {
  _id: string;
  title: string;
  description?: string;
  publishedAt?: string;
  slug: string;
  mainImage?: { alt?: string; asset?: { url?: string } };
  author?: { name?: string; slug?: string };
  categories?: { title?: string; slug?: string }[];
};

export const revalidate = 3600; // ISR: revalida a cada 1h (ajuste como quiser)

export default async function BlogIndexPage() {
  const posts = await client.fetch<PostListItem[]>(POSTS_LIST_QUERY);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Blog</h1>
        <p className="mt-2 text-sm text-slate-600">
          Guias práticos para usar as ferramentas do FinançasFácil com decisões
          mais conscientes.
        </p>
      </header>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <article
            key={p._id}
            className="overflow-hidden rounded-2xl border bg-white/40 shadow-sm"
          >
            <Link href={`/blog/${p.slug}`} className="block">
              <div className="relative aspect-[16/9] w-full bg-slate-100">
                {p.mainImage?.asset?.url ? (
                  <Image
                    src={p.mainImage.asset.url}
                    alt={p.mainImage.alt ?? p.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : null}
              </div>

              <div className="p-5">
                <h2 className="text-lg font-semibold leading-snug">
                  {p.title}
                </h2>

                {p.description ? (
                  <p className="mt-2 line-clamp-3 text-sm text-slate-600">
                    {p.description}
                  </p>
                ) : null}

                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  {p.publishedAt ? (
                    <span>
                      {new Date(p.publishedAt).toLocaleDateString("pt-BR")}
                    </span>
                  ) : null}

                  {p.author?.name ? <span>• {p.author.name}</span> : null}

                  {p.categories?.length ? (
                    <span className="ml-auto inline-flex flex-wrap gap-1">
                      {p.categories.slice(0, 2).map((c) => (
                        <span
                          key={c.slug}
                          className="rounded-full border bg-white/60 px-2 py-0.5"
                        >
                          {c.title}
                        </span>
                      ))}
                    </span>
                  ) : null}
                </div>
              </div>
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
