"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { track } from "@/lib/analytics";

type Row = { year: number; nominalTotal: number; realTotal: number };

export default function InflacaoVsRendimentoPage() {
  const [principal, setPrincipal] = useState<number>(1000);
  const [nominalRate, setNominalRate] = useState<number>(0.07); // 7% ao ano
  const [inflationRate, setInflationRate] = useState<number>(0.03); // 3% ao ano
  const [years, setYears] = useState<number>(10);

  useEffect(() => {
    track({
      event: "tool_viewed",
      page_path: "/finance/inflacao-vs-rendimento",
      tool_name: "Inflação x Rendimento",
    });
  }, []);

  // real rate = (1+nominal)/(1+inflation) - 1
  const realRate = useMemo(
    () => (1 + nominalRate) / (1 + inflationRate) - 1,
    [nominalRate, inflationRate]
  );

  const rows: Row[] = useMemo(() => {
    const arr: Row[] = [];
    for (let y = 0; y <= years; y++) {
      const nominalTotal = principal * Math.pow(1 + nominalRate, y);
      const realTotal = principal * Math.pow(1 + realRate, y);
      arr.push({
        year: y,
        nominalTotal: Number(nominalTotal.toFixed(2)),
        realTotal: Number(realTotal.toFixed(2)),
      });
    }
    track({
      event: "tool_used",
      page_path: "/finance/inflacao-vs-rendimento",
      tool_name: "Inflação x Rendimento",
    });
    return arr;
  }, [principal, nominalRate, realRate, years]);

  const exportCSV = () => {
    const header = ["Ano", "Total Nominal", "Total Real"];
    const csv = [header.join(",")]
      .concat(
        rows.map((r) =>
          [r.year, r.nominalTotal.toFixed(2), r.realTotal.toFixed(2)].join(",")
        )
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inflacao_vs_rendimento.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Inflação x Rendimento</h1>
        <p className="text-sm text-slate-600">
          Compare rendimento nominal com rendimento real ajustado pela inflação.
        </p>
      </header>

      <section className="grid gap-6 rounded-lg border p-6">
        <div className="grid gap-3 sm:grid-cols-4">
          <label className="flex flex-col">
            <span className="text-sm text-slate-700">Capital inicial (R$)</span>
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
              className="mt-1 rounded border px-3 py-2"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm text-slate-700">
              Rendimento nominal anual (decimal)
            </span>
            <input
              step="0.001"
              type="number"
              value={nominalRate}
              onChange={(e) => setNominalRate(Number(e.target.value))}
              className="mt-1 rounded border px-3 py-2"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm text-slate-700">
              Inflação anual (decimal)
            </span>
            <input
              step="0.001"
              type="number"
              value={inflationRate}
              onChange={(e) => setInflationRate(Number(e.target.value))}
              className="mt-1 rounded border px-3 py-2"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm text-slate-700">Período (anos)</span>
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

        <div className="overflow-hidden rounded-md border">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2 text-left">Ano</th>
                <th className="px-4 py-2 text-right">Total Nominal (R$)</th>
                <th className="px-4 py-2 text-right">Total Real (R$)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.year} className="border-t">
                  <td className="px-4 py-2">{r.year}</td>
                  <td className="px-4 py-2 text-right">
                    {r.nominalTotal.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {r.realTotal.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
