"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { track } from "@/lib/analytics";

type Row = {
  year: number;
  total: number;
  stocks: number;
  bonds: number;
  cash: number;
};

export default function SimuladorCarteiraPage() {
  const [initial, setInitial] = useState<number>(10000);
  const [years, setYears] = useState<number>(10);
  const [alloc, setAlloc] = useState({ stocks: 60, bonds: 30, cash: 10 });
  const returnsRate = { stocks: 0.08, bonds: 0.04, cash: 0.01 };

  useEffect(() => {
    track({
      event: "tool_viewed",
      page_path: "/finance/simulador-carteira",
      tool_name: "Simulador de Carteira",
    });
  }, []);

  const compute = (): Row[] => {
    const rows: Row[] = [];
    let stocks = (alloc.stocks / 100) * initial;
    let bonds = (alloc.bonds / 100) * initial;
    let cash = (alloc.cash / 100) * initial;
    rows.push({ year: 0, total: initial, stocks, bonds, cash });
    for (let y = 1; y <= years; y++) {
      stocks = stocks * (1 + returnsRate.stocks);
      bonds = bonds * (1 + returnsRate.bonds);
      cash = cash * (1 + returnsRate.cash);
      rows.push({ year: y, total: stocks + bonds + cash, stocks, bonds, cash });
    }
    track({
      event: "tool_used",
      page_path: "/finance/simulador-carteira",
      tool_name: "Simulador de Carteira",
    });
    return rows;
  };

  const rows = compute();

  const exportCSV = () => {
    const header = ["Ano", "Total", "Ações", "Renda Fixa", "Caixa"];
    const csv = [header.join(",")]
      .concat(
        rows.map((r) =>
          [
            r.year,
            r.total.toFixed(2),
            r.stocks.toFixed(2),
            r.bonds.toFixed(2),
            r.cash.toFixed(2),
          ].join(",")
        )
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "simulacao_carteira.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const maxTotal = Math.max(...rows.map((r) => r.total));

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Simulador de Carteira</h1>
        <p className="text-sm text-slate-600">
          Projete a evolução da sua carteira por alocação.
        </p>
      </header>

      <section className="grid gap-6 rounded-lg border p-6">
        <div className="grid gap-3 sm:grid-cols-3">
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
            <span className="text-sm text-slate-700">Horizonte (anos)</span>
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="mt-1 rounded border px-3 py-2"
            />
          </label>

          <div>
            <span className="text-sm text-slate-700">Alocações (%)</span>
            <div className="mt-1 space-y-2">
              <div className="flex gap-2">
                <input
                  type="number"
                  value={alloc.stocks}
                  onChange={(e) =>
                    setAlloc({ ...alloc, stocks: Number(e.target.value) })
                  }
                  className="w-20 rounded border px-2 py-1"
                />
                <span className="text-sm">Ações</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={alloc.bonds}
                  onChange={(e) =>
                    setAlloc({ ...alloc, bonds: Number(e.target.value) })
                  }
                  className="w-20 rounded border px-2 py-1"
                />
                <span className="text-sm">Renda Fixa</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={alloc.cash}
                  onChange={(e) =>
                    setAlloc({ ...alloc, cash: Number(e.target.value) })
                  }
                  className="w-20 rounded border px-2 py-1"
                />
                <span className="text-sm">Caixa</span>
              </div>
            </div>
          </div>
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
            <div key={r.year} className="space-y-1">
              <div className="flex items-center justify-between text-sm text-slate-700">
                <div>Ano {r.year}</div>
                <div>R$ {r.total.toFixed(2)}</div>
              </div>
              <div className="flex gap-2">
                <div
                  className="h-4 rounded bg-sky-500"
                  style={{ width: `${(r.total / maxTotal) * 100}%` }}
                />
              </div>
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
