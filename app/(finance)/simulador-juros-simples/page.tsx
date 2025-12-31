"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { track } from "@/lib/analytics";

type Row = { year: number; interest: number; total: number };

export default function SimuladorJurosSimplesPage() {
  const [principal, setPrincipal] = useState<number>(1000);
  const [rate, setRate] = useState<number>(0.05); // taxa anual (5%)
  const [years, setYears] = useState<number>(5);

  useEffect(() => {
    track({
      event: "tool_viewed",
      page_path: "/finance/simulador-juros-simples",
      tool_name: "Simulador de Juros Simples",
    });
  }, []);

  const rows: Row[] = useMemo(() => {
    const data: Row[] = [];
    for (let y = 0; y <= years; y++) {
      const interest = principal * rate * y;
      const total = principal + interest;
      data.push({
        year: y,
        interest: Number(interest.toFixed(2)),
        total: Number(total.toFixed(2)),
      });
    }
    track({
      event: "tool_used",
      page_path: "/finance/simulador-juros-simples",
      tool_name: "Simulador de Juros Simples",
    });
    return data;
  }, [principal, rate, years]);

  const exportCSV = () => {
    track({
      event: "export_result",
      page_path: "/finance/simulador-juros-simples",
      tool_name: "Simulador de Juros Simples",
      export_type: "csv",
    });
    const header = ["Ano", "Juros", "Total"];
    const csv = [header.join(",")]
      .concat(
        rows.map((r) =>
          [r.year, r.interest.toFixed(2), r.total.toFixed(2)].join(",")
        )
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "simulacao_juros_simples.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Simulador de Juros Simples</h1>
        <p className="text-sm text-slate-600">
          Calcule juros simples por ano e exporte os resultados.
        </p>
      </header>

      <section className="grid gap-6 rounded-lg border p-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="flex flex-col">
            <span className="text-sm text-slate-700">Principal (R$)</span>
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
              className="mt-1 rounded border px-3 py-2"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm text-slate-700">Taxa anual (decimal)</span>
            <input
              step="0.001"
              type="number"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
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
                <th className="px-4 py-2 text-right">Juros (R$)</th>
                <th className="px-4 py-2 text-right">Total (R$)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.year} className="border-t">
                  <td className="px-4 py-2">{r.year}</td>
                  <td className="px-4 py-2 text-right">
                    {r.interest.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-right">{r.total.toFixed(2)}</td>
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
