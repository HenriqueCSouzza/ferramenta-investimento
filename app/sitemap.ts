import type { MetadataRoute } from "next";
import { posts } from "@/content";

const siteUrl = "https://financasfacil.app.br";

const tools = [
  "/calculadora-cet",
  "/calculadora-inflacao-acumulada",
  "/calculadora-regra-72",
  "/calculadora-rendimento-liquido",
  "/calculadora-reserva-emergencia",
  "/conversor-de-moedas",
  "/conversor-taxas",
  "/inflacao-vs-rendimento",
  "/simulador-aportes-regulares",
  "/simulador-carteira",
  "/simulador-dividendos",
  "/simulador-fiis",
  "/simulador-imposto-de-renda",
  "/simulador-ipva",
  "/simulador-juros-compostos",
  "/simulador-juros-simples",
  "/simulador-renda-mensal-desejada",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const base = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
  ];

  const toolEntries: MetadataRoute.Sitemap = tools.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...base, ...toolEntries, ...postEntries];
}
