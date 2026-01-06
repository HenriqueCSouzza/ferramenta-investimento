export type ToolLink = { href: string; label: string };

export const toolsByPostSlug: Record<string, ToolLink[]> = {
  "juros-compostos": [
    {
      href: "/simulador-juros-compostos",
      label: "Simulador de juros compostos",
    },
    { href: "/conversor-taxas", label: "Conversor de taxas" },
    {
      href: "/simulador-aportes-regulares",
      label: "Simulador de aportes regulares",
    },
  ],
  "inflacao-acumulada": [
    {
      href: "/calculadora-inflacao-acumulada",
      label: "Calculadora de inflação acumulada",
    },
    { href: "/inflacao-vs-rendimento", label: "Inflação vs rendimento" },
  ],
  // ... complete aos poucos (ou gere via tags)
};

export function getRelatedTools(postSlug: string): ToolLink[] {
  return toolsByPostSlug[postSlug] ?? [];
}
