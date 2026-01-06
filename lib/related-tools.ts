import type { Post } from "@/content";
import { TOOLS, TOOLS_BY_ID, type Tool } from "@/lib/tools-catalog";

const CURATED_BY_POST_SLUG: Record<string, string[]> = {
  // ===== Juros / Crescimento =====
  "juros-compostos": [
    "conversor-taxas",
    "simulador-aportes-regulares",
    "inflacao-vs-rendimento",
  ],
  "juros-simples": [
    "simulador-juros-compostos",
    "conversor-taxas",
    "calculadora-regra-72",
  ],
  "regra-dos-72": [
    "simulador-juros-compostos",
    "conversor-taxas",
    "simulador-aportes-regulares",
  ],

  // ===== Inflação / Retorno real =====
  "inflacao-acumulada": [
    "inflacao-vs-rendimento",
    "conversor-taxas",
    "simulador-aportes-regulares",
  ],
  "inflacao-vs-rendimento": [
    "calculadora-inflacao-acumulada",
    "calculadora-rendimento-liquido",
    "conversor-taxas",
  ],

  // ===== Renda fixa / Impostos =====
  "rendimento-liquido": [
    "simulador-imposto-de-renda",
    "inflacao-vs-rendimento",
    "conversor-taxas",
  ],
  "simulador-imposto-de-renda": [
    "calculadora-rendimento-liquido",
    "simulador-dividendos",
    "simulador-fiis",
  ],

  // ===== Planejamento / Metas =====
  "reserva-de-emergencia": [
    "calculadora-reserva-emergencia",
    "simulador-aportes-regulares",
    "calculadora-rendimento-liquido",
  ],
  "aportes-regulares": [
    "simulador-juros-compostos",
    "simulador-renda-mensal-desejada",
    "inflacao-vs-rendimento",
  ],
  "renda-mensal-desejada": [
    "simulador-aportes-regulares",
    "simulador-dividendos",
    "simulador-fiis",
  ],

  // ===== Carteira / Renda variável =====
  "simulador-de-carteira": [
    "simulador-dividendos",
    "simulador-fiis",
    "inflacao-vs-rendimento",
  ],
  "simulador-de-dividendos": [
    "simulador-renda-mensal-desejada",
    "simulador-carteira",
    "simulador-fiis",
  ],
  "simulador-de-fiis": [
    "simulador-renda-mensal-desejada",
    "simulador-dividendos",
    "simulador-carteira",
  ],

  // ===== Crédito =====
  cet: ["calculadora-cet", "conversor-taxas", "calculadora-rendimento-liquido"],

  // ===== Câmbio =====
  "conversor-de-moedas": [
    "conversor-de-moedas",
    "conversor-taxas",
    "inflacao-vs-rendimento",
  ],

  // ===== Conversões =====
  "conversor-de-taxas": [
    "conversor-taxas",
    "simulador-juros-compostos",
    "calculadora-regra-72",
  ],

  // ===== Impostos / Veículos =====
  "simulador-de-ipva": [
    "simulador-ipva",
    "calculadora-reserva-emergencia",
    "simulador-aportes-regulares",
  ],
};

function normalizeTags(tags?: string[]) {
  return (tags ?? []).map((t) => t.trim().toLowerCase());
}

function toolForPrimary(post: Post): Tool | undefined {
  // Regra automática: tenta mapear slug do post para rota/ferramenta.
  // Ex.: post.slug "juros-compostos" -> id "simulador-juros-compostos"
  const directIdCandidates = [
    post.slug, // se slug do post = id do tool
    `simulador-${post.slug}`,
    `calculadora-${post.slug}`,
  ];

  for (const id of directIdCandidates) {
    const found = TOOLS_BY_ID.get(id);
    if (found) return found;
  }

  return undefined;
}

function fallbackByTags(
  post: Post,
  excludeIds: Set<string>,
  limit: number
): Tool[] {
  const postTags = new Set(normalizeTags(post.tags));
  if (postTags.size === 0) return [];

  const scored = TOOLS.filter((t) => !excludeIds.has(t.id))
    .map((t) => {
      const tTags = normalizeTags(t.tags);
      let score = 0;
      for (const tag of tTags) {
        if (postTags.has(tag)) score += 2;
      }
      return { tool: t, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.tool);

  return scored;
}

export function getRelatedTools(post: Post, limit = 4): Tool[] {
  const result: Tool[] = [];
  const used = new Set<string>();

  // 1) Ferramenta principal automática
  const primary = toolForPrimary(post);
  if (primary) {
    result.push(primary);
    used.add(primary.id);
  }

  // 2) Curados (2–3)
  const curatedIds = CURATED_BY_POST_SLUG[post.slug] ?? [];
  for (const id of curatedIds) {
    if (result.length >= limit) break;
    if (used.has(id)) continue;

    const t = TOOLS_BY_ID.get(id);
    if (!t) continue;

    result.push(t);
    used.add(t.id);
  }

  // 3) Fallback por tags (completa até o limite)
  if (result.length < limit) {
    const remaining = limit - result.length;
    const fallback = fallbackByTags(post, used, remaining);
    for (const t of fallback) {
      if (result.length >= limit) break;
      if (used.has(t.id)) continue;
      result.push(t);
      used.add(t.id);
    }
  }

  // 4) Último fallback: ferramentas “gerais” (se ainda faltar)
  if (result.length < limit) {
    const remaining = limit - result.length;
    const generals = [
      "conversor-taxas",
      "inflacao-vs-rendimento",
      "simulador-aportes-regulares",
    ]
      .map((id) => TOOLS_BY_ID.get(id))
      .filter(Boolean) as Tool[];

    for (const t of generals) {
      if (result.length >= limit) break;
      if (used.has(t.id)) continue;
      result.push(t);
      used.add(t.id);
    }

    // se ainda assim faltar, completa pela lista geral
    for (const t of TOOLS) {
      if (result.length >= limit) break;
      if (used.has(t.id)) continue;
      result.push(t);
      used.add(t.id);
    }
  }

  return result.slice(0, limit);
}
