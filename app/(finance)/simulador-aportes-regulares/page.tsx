"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { track } from "@/lib/analytics";

type Row = { year: number; total: number };

export default function SimuladorAportesRegularesPage() {
  const [initial, setInitial] = useState<number>(1000);
  const [contribution, setContribution] = useState<number>(200);
  const [monthlyRate, setMonthlyRate] = useState<number>(0.006); // ~0.6% monthly ~7.4% anual
  const [years, setYears] = useState<number>(10);

  useEffect(() => {
    track({
      event: "tool_viewed",
      page_path: "/finance/simulador-aportes-regulares",
      tool_name: "Simulador de Aportes Regulares",
    });
  }, []);

  const rows: Row[] = useMemo(() => {
    const r = monthlyRate;
    const months = years * 12;
    const data: Row[] = [];

    // compute balance each month then sample by year
    let balance = initial;
    for (let m = 1; m <= months; m++) {
      // contribution at end of month
      balance = balance * (1 + r) + contribution;
      if (m % 12 === 0) {
        data.push({ year: m / 12, total: Number(balance.toFixed(2)) });
      }
    }
    // include year 0
    data.unshift({ year: 0, total: initial });
    return data;
  }, [initial, contribution, monthlyRate, years]);

  const exportCSV = () => {
    const header = ["Ano", "Total"];
    const csv = [header.join(",")]
      .concat(rows.map((r) => [r.year, r.total.toFixed(2)].join(",")))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "simulacao_aportes_regulares.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Simulador de Aportes Regulares</h1>
        <p className="text-sm text-slate-600">
          Veja como aportes periódicos crescem ao longo do tempo.
        </p>
      </header>

      <section className="grid gap-6 rounded-lg border p-6">
        <div className="grid gap-3 sm:grid-cols-4">
          <label className="flex flex-col">
            <span className="text-sm text-slate-700">Capital inicial (R$)</span>
            <input
              type="number"
              value={initial}
              onChange={(e) => setInitial(Number(e.target.value))}
              className="mt-1 rounded border px-3 py-2"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm text-slate-700">Aporte mensal (R$)</span>
            <input
              type="number"
              value={contribution}
              onChange={(e) => setContribution(Number(e.target.value))}
              className="mt-1 rounded border px-3 py-2"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm text-slate-700">
              Taxa mensal (decimals)
            </span>
            <input
              step="0.001"
              type="number"
              value={monthlyRate}
              onChange={(e) => setMonthlyRate(Number(e.target.value))}
              className="mt-1 rounded border px-3 py-2"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm text-slate-700">Horizonte (anos)</span>
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="mt-1 rounded border px-3 py-2"
            />
          </label>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            className="rounded bg-sky-600 px-4 py-2 text-white"
          >
            Exportar CSV
          </button>
          <Link href="/" className="text-sm text-slate-600">
            Voltar
          </Link>
        </div>

        <div className="space-y-3">
          {rows.map((r) => (
            <div
              key={r.year}
              className="flex items-center justify-between text-sm text-slate-700"
            >
              <div>Ano {r.year}</div>
              <div>R$ {r.total.toFixed(2)}</div>
            </div>
          ))}
        </div>
      </section>
      <div className="mt-6 text-xs text-slate-600">
        <strong>Disclaimer:</strong> Este simulador fornece apenas estimativas e
        informações educativas; não substitui aconselhamento financeiro ou
        fiscal profissional.
      </div>
    </div>
  );
}
