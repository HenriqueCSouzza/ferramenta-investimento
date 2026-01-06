import { notFound } from "next/navigation";
import Link from "next/link";
import { posts } from "@/content";
import { MDXContent } from "@/components/mdx-content";
import Image from "next/image";
import { BlogHeroImage } from "@/components/ui/BlogHeroImage";
import { formatDate } from "@/utils/date";
import { getRelatedPosts } from "@/lib/related";
import { RelatedPosts } from "@/components/RelatedPosts";
import { getRelatedTools } from "@/lib/tools";
import { RelatedTools } from "@/components/RelatedTools";
interface LinkToolProps {
  href: string;
  children: React.ReactNode;
}
const siteUrl = "https://financasfacil.app.br";

function LinkTool(props: LinkToolProps) {
  return (
    <Link
      href={props.href}
      className="inline-flex items-center rounded-md border px-3 py-2 text-sm underline"
    >
      {props.children}
    </Link>
  );
}

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `${siteUrl}/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `${siteUrl}/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return notFound();

  const related = getRelatedPosts(posts, post.slug, 4);
  const relatedTools = getRelatedTools(post.slug);
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">{post.title}</h1>
        <p className="text-sm text-muted-foreground">{post.description}</p>
        <p className="text-xs text-muted-foreground">
          {formatDate(new Date(post.date))}
        </p>
      </header>

      <article className="prose mt-10 max-w-none">
        <MDXContent
          code={post.code}
          components={{
            LinkTool: LinkTool as never,
            Image: Image as never,
            BlogHeroImage: BlogHeroImage as never,
          }}
        />
      </article>
      <RelatedTools tools={relatedTools} />
      <RelatedPosts posts={related} />
    </main>
  );
}
