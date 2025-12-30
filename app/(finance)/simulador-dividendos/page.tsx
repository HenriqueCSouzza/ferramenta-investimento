"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { track } from "@/lib/analytics";

type Row = {
  year: number;
  dividendPerShare: number;
  annualDividend: number;
  sharesEnd: number;
  accumulatedDividends: number;
};

export default function SimuladorDividendosPage() {
  const [shares, setShares] = useState<number>(100);
  const [divPerShare, setDivPerShare] = useState<number>(0.5); // currency per share
  const [pricePerShare, setPricePerShare] = useState<number>(10);
  const [growthRate, setGrowthRate] = useState<number>(0.02); // 2%
  const [years, setYears] = useState<number>(10);
  const [reinvest, setReinvest] = useState<boolean>(false);
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    track({
      event: "tool_viewed",
      page_path: "/finance/simulador-dividendos",
      tool_name: "Simulador de Dividendos",
    });
  }, []);

  function simulate() {
    const result: Row[] = [];
    let currentShares = Number(shares) || 0;
    let currentDiv = Number(divPerShare) || 0;
    const gr = Number(growthRate) || 0;
    let accumulated = 0;

    for (let y = 1; y <= years; y++) {
      currentDiv = currentDiv * (1 + gr);
      const annualDividend = currentShares * currentDiv;
      accumulated += annualDividend;

      if (reinvest && pricePerShare > 0) {
        const newShares = annualDividend / Number(pricePerShare);
        currentShares += newShares;
      }

      result.push({
        year: y,
        dividendPerShare: Number(currentDiv),
        annualDividend: Number(annualDividend),
        sharesEnd: Number(currentShares),
        accumulatedDividends: Number(accumulated),
      });
    }

    setRows(result);
  }

  function exportCSV() {
    if (rows.length === 0) return;
    const header = [
      "Year",
      "Div/Share",
      "Annual Dividend",
      "Shares End",
      "Accumulated",
    ];
    const lines = rows.map((r) =>
      [
        r.year,
        r.dividendPerShare.toFixed(6),
        r.annualDividend.toFixed(6),
        r.sharesEnd.toFixed(6),
        r.accumulatedDividends.toFixed(6),
      ].join(",")
    );
    const csv = [header.join(";"), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "simulador_dividendos.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Simulador de Dividendos</h1>
        <p className="text-sm text-slate-600">
          Projete dividendos anuais e veja o efeito do reinvestimento.
        </p>
      </header>

      <section className="grid gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
          <div>
            <label className="text-sm text-slate-700">Ações (shares)</label>
            <Input
              type="number"
              value={String(shares)}
              onChange={(e) => setShares(Number(e.target.value))}
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-slate-700">Dividendo por ação</label>
            <Input
              type="number"
              step="0.000001"
              value={String(divPerShare)}
              onChange={(e) => setDivPerShare(Number(e.target.value))}
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-slate-700">
              Preço por ação (p/ reinvest)
            </label>
            <Input
              type="number"
              step="0.01"
              value={String(pricePerShare)}
              onChange={(e) => setPricePerShare(Number(e.target.value))}
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-slate-700">Anos</label>
            <Input
              type="number"
              value={String(years)}
              onChange={(e) => setYears(Number(e.target.value))}
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-slate-700">
              Crescimento anual do dividendo (%)
            </label>
            <Input
              type="number"
              step="0.0001"
              value={String(growthRate)}
              onChange={(e) => setGrowthRate(Number(e.target.value))}
              className="mt-1"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm">
              <input
                type="checkbox"
                checked={reinvest}
                onChange={(e) => setReinvest(e.target.checked)}
                className="mr-2"
              />{" "}
              Reinvestir dividendos
            </label>
          </div>

          <div className="sm:col-span-4 flex gap-2">
            <Button onClick={simulate}>Simular</Button>
            <Button
              variant="ghost"
              onClick={exportCSV}
              disabled={rows.length === 0}
            >
              Exportar CSV
            </Button>
            <Link href="/" className="text-sm text-slate-600 self-center">
              Voltar
            </Link>
          </div>
        </div>

        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ano</TableHead>
                <TableHead>Div/ação</TableHead>
                <TableHead className="text-right">Dividendos (R$)</TableHead>
                <TableHead className="text-right">Ações fim</TableHead>
                <TableHead className="text-right">Acumulado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.year}>
                  <TableCell>{r.year}</TableCell>
                  <TableCell>{r.dividendPerShare.toFixed(6)}</TableCell>
                  <TableCell className="text-right">
                    {r.annualDividend.toFixed(6)}
                  </TableCell>
                  <TableCell className="text-right">
                    {r.sharesEnd.toFixed(6)}
                  </TableCell>
                  <TableCell className="text-right">
                    {r.accumulatedDividends.toFixed(6)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
