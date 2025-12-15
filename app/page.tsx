import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Ferramentas de Investimento — Calculadoras e Simuladores Financeiros",
  description:
    "Coleção de ferramentas para investidores: simuladores, gráficos, exportação CSV e utilitários para decisões financeiras mais rápidas.",
  openGraph: {
    title: "Ferramentas de Investimento",
    description:
      "Simuladores e utilitários financeiros — veja projeções, exporte resultados e tome decisões melhores.",
    images: [
      "https://images.unsplash.com/photo-1559526324-593bc073d938?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=7b4b9d8f0d4d2b3c",
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex flex-col-reverse gap-10 lg:flex-row lg:items-center">
          <div className="lg:w-1/2">
            <h1 className="text-4xl font-extrabold text-slate-900 leading-tight">
              Simuladores, calculadoras e utilitários financeiros
            </h1>
            <p className="mt-4 max-w-xl text-lg text-slate-600">
              Um conjunto completo de ferramentas para investidores: simuladores
              de rendimento, calculadoras de impostos, conversores,
              visualizações e exportação em CSV — tudo em português e pronto
              para uso.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href="#tools"
                className="inline-flex items-center rounded-md bg-sky-600 px-5 py-3 text-white shadow hover:bg-sky-700"
              >
                Explorar Ferramentas
              </a>
              <a
                href="#features"
                className="inline-flex items-center rounded-md border border-slate-200 px-5 py-3 text-slate-700 hover:bg-slate-50"
              >
                Ver categorias
              </a>
            </div>
          </div>

          <div className="lg:w-1/2">
            <div
              className="relative w-full overflow-hidden rounded-lg shadow-lg"
              style={{ height: 420 }}
            >
              <Image
                src="https://images.unsplash.com/photo-1559526324-593bc073d938?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=7b4b9d8f0d4d2b3c"
                alt="Finance dashboard"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="border-t bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-bold text-slate-900">Categorias</h2>
          <p className="mt-2 text-slate-600">
            Nossas ferramentas estão organizadas em categorias para facilitar o
            acesso: simuladores (projeções), calculadoras (impostos, inflação,
            CET), conversores e visualizações/exports.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border p-6">
              <h3 className="font-semibold text-slate-800">Simuladores</h3>
              <p className="mt-2 text-sm text-slate-600">
                Ferramentas para projetar investimentos, dividendos, FIIs, IPVA
                e evoluções de carteira ao longo do tempo.
              </p>
              <a
                href="#tools"
                className="mt-3 inline-block text-sm text-sky-600"
              >
                Ver simuladores →
              </a>
            </div>

            <div className="rounded-lg border p-6">
              <h3 className="font-semibold text-slate-800">Calculadoras</h3>
              <p className="mt-2 text-sm text-slate-600">
                Calculadoras rápidas para IRPF, reserva de emergência, inflação
                acumulada, CET e regra dos 72.
              </p>
              <a
                href="#tools"
                className="mt-3 inline-block text-sm text-sky-600"
              >
                Ver calculadoras →
              </a>
            </div>

            <div className="rounded-lg border p-6">
              <h3 className="font-semibold text-slate-800">Conversores</h3>
              <p className="mt-2 text-sm text-slate-600">
                Conversor de moedas (API pública) e conversor de taxas (mês ↔
                ano) com histórico e CSV.
              </p>
              <a
                href="#tools"
                className="mt-3 inline-block text-sm text-sky-600"
              >
                Ver conversores →
              </a>
            </div>

            <div className="rounded-lg border p-6">
              <h3 className="font-semibold text-slate-800">
                Visualização & Export
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Gráficos interativos e exportação em CSV para facilitar análise
                e compartilhamento dos resultados.
              </p>
              <a
                href="#tools"
                className="mt-3 inline-block text-sm text-sky-600"
              >
                Ver export/visualizações →
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="tools" className="border-t bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Ferramentas disponíveis
          </h2>
          <p className="mt-2 text-slate-600">
            Descrição rápida e link para cada utilitário e simulador disponível
            na plataforma.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border p-6">
              <h3 className="font-semibold text-slate-800">
                Simulador de Juros Compostos
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Projete o crescimento de investimentos com aportes regulares,
                escolha taxa mensal ou anual e exporte os resultados.
              </p>
              <a
                href="/simulador-juros-compostos"
                className="mt-3 inline-block text-sm text-sky-600"
              >
                Abrir ferramenta →
              </a>
            </div>

            <div className="rounded-lg border p-6">
              <h3 className="font-semibold text-slate-800">
                Conversor de Moedas
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Converte entre moedas usando a API pública Frankfurter, mantém
                histórico e exporta conversões em CSV.
              </p>
              <a
                href="/conversor-de-moedas"
                className="mt-3 inline-block text-sm text-sky-600"
              >
                Abrir ferramenta →
              </a>
            </div>

            <div className="rounded-lg border p-6">
              <h3 className="font-semibold text-slate-800">
                Simulador de Carteira
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Projete a evolução de uma carteira por alocação (ações, renda
                fixa, caixa) ao longo do tempo.
              </p>
              <a
                href="/simulador-carteira"
                className="mt-3 inline-block text-sm text-sky-600"
              >
                Abrir ferramenta →
              </a>
            </div>

            <div className="rounded-lg border p-6">
              <h3 className="font-semibold text-slate-800">
                Simulador de Aportes Regulares
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Veja como aportes mensais impactam o patrimônio no longo prazo,
                com amostragem por ano e exportação CSV.
              </p>
              <a
                href="/simulador-aportes-regulares"
                className="mt-3 inline-block text-sm text-sky-600"
              >
                Abrir ferramenta →
              </a>
            </div>

            <div className="rounded-lg border p-6">
              <h3 className="font-semibold text-slate-800">
                Simulador de Juros Simples
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Calcule juros simples ano a ano e exporte o detalhamento em CSV.
              </p>
              <a
                href="/simulador-juros-simples"
                className="mt-3 inline-block text-sm text-sky-600"
              >
                Abrir ferramenta →
              </a>
            </div>

            <div className="rounded-lg border p-6">
              <h3 className="font-semibold text-slate-800">
                Simulador de Dividendos
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Projete pagamentos de dividendos, reinvestimento automático e
                acompanhe acumulados por ano.
              </p>
              <a
                href="/simulador-dividendos"
                className="mt-3 inline-block text-sm text-sky-600"
              >
                Abrir ferramenta →
              </a>
            </div>

            <div className="rounded-lg border p-6">
              <h3 className="font-semibold text-slate-800">
                Simulador de FIIs
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Simule rendimentos mensais de fundos imobiliários, com opção de
                reinvestir rendimentos e visualizar gráficos.
              </p>
              <a
                href="/simulador-fiis"
                className="mt-3 inline-block text-sm text-sky-600"
              >
                Abrir ferramenta →
              </a>
            </div>

            <div className="rounded-lg border p-6">
              <h3 className="font-semibold text-slate-800">
                Simulador Renda Mensal Desejada
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Calcule o capital necessário para gerar uma renda mensal
                desejada em diferentes cenários de rendimento.
              </p>
              <a
                href="/simulador-renda-mensal-desejada"
                className="mt-3 inline-block text-sm text-sky-600"
              >
                Abrir ferramenta →
              </a>
            </div>

            <div className="rounded-lg border p-6">
              <h3 className="font-semibold text-slate-800">
                Simulador Imposto de Renda (PF)
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Estimativa de IRPF com base em renda anual, deduções e
                dependentes; inclui exportação CSV.
              </p>
              <a
                href="/simulador-imposto-de-renda"
                className="mt-3 inline-block text-sm text-sky-600"
              >
                Abrir ferramenta →
              </a>
            </div>

            <div className="rounded-lg border p-6">
              <h3 className="font-semibold text-slate-800">
                Calculadora Reserva de Emergência
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Calcule quanto guardar para um período de emergência
                considerando meses desejados e buffer de segurança.
              </p>
              <a
                href="/calculadora-reserva-emergencia"
                className="mt-3 inline-block text-sm text-sky-600"
              >
                Abrir ferramenta →
              </a>
            </div>

            <div className="rounded-lg border p-6">
              <h3 className="font-semibold text-slate-800">
                Conversor de Taxas
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Converta taxas mensais para taxas nominais e efetivas anuais
                (efetiva anual = (1+i)^12 - 1).
              </p>
              <a
                href="/conversor-taxas"
                className="mt-3 inline-block text-sm text-sky-600"
              >
                Abrir ferramenta →
              </a>
            </div>

            <div className="rounded-lg border p-6">
              <h3 className="font-semibold text-slate-800">
                Rendimento Líquido
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Calcule rendimento líquido após impostos e taxas com um valor
                investido de referência.
              </p>
              <a
                href="/calculadora-rendimento-liquido"
                className="mt-3 inline-block text-sm text-sky-600"
              >
                Abrir ferramenta →
              </a>
            </div>

            <div className="rounded-lg border p-6">
              <h3 className="font-semibold text-slate-800">
                Inflação Acumulada
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Calcule o fator de inflação acumulada e ajuste valores ao longo
                de N anos.
              </p>
              <a
                href="/calculadora-inflacao-acumulada"
                className="mt-3 inline-block text-sm text-sky-600"
              >
                Abrir ferramenta →
              </a>
            </div>

            <div className="rounded-lg border p-6">
              <h3 className="font-semibold text-slate-800">
                Calculadora CET (simplificada)
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Estimativa simplificada de parcela, total pago e CET anual
                aproximado para empréstimos.
              </p>
              <a
                href="/calculadora-cet"
                className="mt-3 inline-block text-sm text-sky-600"
              >
                Abrir ferramenta →
              </a>
            </div>

            <div className="rounded-lg border p-6">
              <h3 className="font-semibold text-slate-800">Regra dos 72</h3>
              <p className="mt-2 text-sm text-slate-600">
                Estimativa rápida de anos para dobrar patrimônio pela Regra dos
                72 e cálculo exato logarítmico.
              </p>
              <a
                href="/calculadora-regra-72"
                className="mt-3 inline-block text-sm text-sky-600"
              >
                Abrir ferramenta →
              </a>
            </div>

            <div className="rounded-lg border p-6">
              <h3 className="font-semibold text-slate-800">Simulador IPVA</h3>
              <p className="mt-2 text-sm text-slate-600">
                Estimativa de IPVA a partir do valor do veículo e alíquotas por
                estado, com opção de alíquota customizada.
              </p>
              <a
                href="/simulador-ipva"
                className="mt-3 inline-block text-sm text-sky-600"
              >
                Abrir ferramenta →
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Como funciona</h3>
            <p className="mt-3 text-slate-600">
              Escolha o tipo de cálculo, preencha os parâmetros (taxa, prazo,
              aporte) e veja projeções instantâneas. Você pode exportar os
              resultados ou visualizar o gráfico de evolução.
            </p>
            <ul className="mt-4 space-y-2 text-slate-600">
              <li>• Sem necessidade de cadastro</li>
              <li>• Resultados exportáveis em CSV</li>
              <li>• Interface responsiva para mobile</li>
            </ul>
          </div>

          <div>
            <div
              className="relative w-full overflow-hidden rounded-lg shadow"
              style={{ height: 320 }}
            >
              <Image
                src="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=2b9b1a9f6c3e8b7d"
                alt="Graphs and analytics"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t bg-white py-8">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm text-slate-600">
          © {new Date().getFullYear()} Ferramentas de Investimento — Projetado
          para facilitar cálculos financeiros.
        </div>
      </footer>
    </main>
  );
}
