import type { Post } from "@/content";

type RelatedPost = Post & { _score: number };

function normalizeTags(tags?: string[]) {
  return (tags ?? []).map((t) => t.trim().toLowerCase());
}

export function getRelatedPosts(
  allPosts: Post[],
  currentSlug: string,
  limit = 4
): Post[] {
  const current = allPosts.find((p) => p.slug === currentSlug);
  if (!current) return [];

  const currentTags = new Set(normalizeTags(current.tags));

  const scored: RelatedPost[] = allPosts
    .filter((p) => p.slug !== currentSlug)
    .map((p) => {
      const tags = normalizeTags(p.tags);
      let score = 0;

      // Pontuação: tags em comum valem mais
      for (const t of tags) {
        if (currentTags.has(t)) score += 3;
      }

      // Preferir posts mais recentes levemente
      const daysDiff =
        (Date.now() - new Date(p.date).getTime()) / (1000 * 60 * 60 * 24);
      if (daysDiff <= 30) score += 1;
      if (daysDiff <= 7) score += 1;

      return { ...p, _score: score };
    })
    .filter((p) => p._score > 0)
    .sort((a, b) => b._score - a._score);

  // Fallback: se não houver tags em comum, retorna os mais recentes
  if (scored.length === 0) {
    return [...allPosts]
      .filter((p) => p.slug !== currentSlug)
      .sort((a, b) => (a.date < b.date ? 1 : -1))
      .slice(0, limit);
  }

  return scored.slice(0, limit).map(({ _score, ...rest }) => rest);
}
