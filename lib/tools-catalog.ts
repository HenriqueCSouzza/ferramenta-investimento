export type Tool = {
  id: string; // slug único
  href: string; // rota no site
  label: string; // texto do CTA
  tags: string[]; // para fallback por tags
};

export const TOOLS: Tool[] = [
  {
    id: "calculadora-cet",
    href: "/calculadora-cet",
    label: "Calculadora de CET",
    tags: ["crédito", "empréstimos", "financiamento", "taxas", "juros"],
  },
  {
    id: "calculadora-inflacao-acumulada",
    href: "/calculadora-inflacao-acumulada",
    label: "Calculadora de inflação acumulada",
    tags: ["inflação", "ipca", "poder de compra", "economia"],
  },
  {
    id: "calculadora-regra-72",
    href: "/calculadora-regra-72",
    label: "Calculadora da Regra dos 72",
    tags: ["juros", "tempo", "rentabilidade", "crescimento"],
  },
  {
    id: "calculadora-rendimento-liquido",
    href: "/calculadora-rendimento-liquido",
    label: "Calculadora de rendimento líquido",
    tags: ["renda fixa", "impostos", "rentabilidade", "retorno"],
  },
  {
    id: "calculadora-reserva-emergencia",
    href: "/calculadora-reserva-emergencia",
    label: "Calculadora de reserva de emergência",
    tags: ["reserva", "planejamento", "orçamento", "finanças pessoais"],
  },
  {
    id: "conversor-de-moedas",
    href: "/conversor-de-moedas",
    label: "Conversor de moedas",
    tags: ["câmbio", "moedas", "viagem", "dólar", "euro"],
  },
  {
    id: "conversor-taxas",
    href: "/conversor-taxas",
    label: "Conversor de taxas",
    tags: ["taxas", "juros", "mensal", "anual", "capitalização"],
  },
  {
    id: "inflacao-vs-rendimento",
    href: "/inflacao-vs-rendimento",
    label: "Inflação vs rendimento",
    tags: ["inflação", "retorno real", "poder de compra", "investimentos"],
  },
  {
    id: "simulador-aportes-regulares",
    href: "/simulador-aportes-regulares",
    label: "Simulador de aportes regulares",
    tags: ["aportes", "disciplina", "juros compostos", "metas"],
  },
  {
    id: "simulador-carteira",
    href: "/simulador-carteira",
    label: "Simulador de carteira",
    tags: ["carteira", "alocação", "diversificação", "risco"],
  },
  {
    id: "simulador-dividendos",
    href: "/simulador-dividendos",
    label: "Simulador de dividendos",
    tags: ["dividendos", "ações", "renda passiva", "proventos"],
  },
  {
    id: "simulador-fiis",
    href: "/simulador-fiis",
    label: "Simulador de FIIs",
    tags: ["fiis", "fundos imobiliários", "renda mensal", "aluguéis"],
  },
  {
    id: "simulador-imposto-de-renda",
    href: "/simulador-imposto-de-renda",
    label: "Simulador de imposto de renda",
    tags: ["imposto", "ir", "declaração", "tributação", "investimentos"],
  },
  {
    id: "simulador-ipva",
    href: "/simulador-ipva",
    label: "Simulador de IPVA",
    tags: ["ipva", "carro", "impostos", "planejamento"],
  },
  {
    id: "simulador-juros-compostos",
    href: "/simulador-juros-compostos",
    label: "Simulador de juros compostos",
    tags: ["juros compostos", "investimentos", "crescimento", "longo prazo"],
  },
  {
    id: "simulador-juros-simples",
    href: "/simulador-juros-simples",
    label: "Simulador de juros simples",
    tags: ["juros simples", "matemática financeira", "cálculo"],
  },
  {
    id: "simulador-renda-mensal-desejada",
    href: "/simulador-renda-mensal-desejada",
    label: "Simulador de renda mensal desejada",
    tags: ["renda passiva", "metas", "planejamento", "investimentos"],
  },
];

export const TOOLS_BY_ID = new Map(TOOLS.map((t) => [t.id, t]));
