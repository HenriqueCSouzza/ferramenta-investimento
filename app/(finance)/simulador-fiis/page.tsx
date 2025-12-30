"use client";
import { useState, useMemo, type ChangeEvent, useEffect } from "react";
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
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { track } from "@/lib/analytics";

type YearRow = {
  year: number;
  priceStart: number;
  unitsEnd: number;
  dividendsYear: number;
  accumulated: number;
};

export default function SimuladorFiisPage() {
  const [units, setUnits] = useState<number>(100);
  const [price, setPrice] = useState<number>(100); // price per unit
  // internal as decimal (e.g. 0.006 = 0.6%) but inputs show percent (0.6)
  const [monthlyYieldPct, setMonthlyYieldPct] = useState<number>(0.006); // 0.6% monthly
  const [annualPriceGrowth, setAnnualPriceGrowth] = useState<number>(0.0); // price appreciation per year (decimal)
  const [years, setYears] = useState<number>(10);
  const [reinvest, setReinvest] = useState<boolean>(true);
  const [rows, setRows] = useState<YearRow[]>([]);

  useEffect(() => {
    track({
      event: "tool_viewed",
      page_path: "/finance/simulador-fiis",
      tool_name: "Simulador de FIIs",
    });
  }, []);

  function simulate() {
    const result: YearRow[] = [];
    let currentUnits = Number(units) || 0;
    let currentPrice = Number(price) || 0;
    const monthlyYield = Number(monthlyYieldPct) || 0;
    const monthlyPriceGrowth =
      Math.pow(1 + Number(annualPriceGrowth || 0), 1 / 12) - 1;
    let accumulated = 0;

    for (let y = 1; y <= years; y++) {
      const priceStart = currentPrice;
      let dividendsThisYear = 0;

      for (let m = 0; m < 12; m++) {
        const div = currentUnits * currentPrice * monthlyYield;
        dividendsThisYear += div;
        accumulated += div;

        if (reinvest && currentPrice > 0) {
          const newUnits = div / currentPrice;
          currentUnits += newUnits;
        }

        // apply monthly price growth
        currentPrice = currentPrice * (1 + monthlyPriceGrowth);
      }

      result.push({
        year: y,
        priceStart: Number(priceStart),
        unitsEnd: Number(currentUnits),
        dividendsYear: Number(dividendsThisYear),
        accumulated: Number(accumulated),
      });
    }

    setRows(result);
  }

  const chartData = useMemo(
    () =>
      rows.map((r) => ({
        year: String(r.year),
        dividends: Number(r.dividendsYear.toFixed(6)),
        acumulado: Number(r.accumulated.toFixed(6)),
        cotas: Number(r.unitsEnd.toFixed(6)),
      })),
    [rows]
  );

  function exportCSV() {
    if (rows.length === 0) return;
    const header = [
      "Ano",
      "PreçoInício",
      "CotasFim",
      "RendimentosAno",
      "Acumulado",
    ];
    const lines = rows.map((r) =>
      [
        r.year,
        r.priceStart.toFixed(6),
        r.unitsEnd.toFixed(6),
        r.dividendsYear.toFixed(6),
        r.accumulated.toFixed(6),
      ].join(",")
    );
    const csv = [header.join(";"), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "simulador_fiis.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Simulador de FIIs</h1>
        <p className="text-sm text-slate-600">
          Simule rendimentos mensais de FIIs com opção de reinvestimento.
        </p>
      </header>

      <section className="grid gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <div>
            <label className="text-sm text-slate-700">Cotas</label>
            <Input
              type="number"
              value={String(units)}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setUnits(Number(e.target.value))
              }
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-slate-700">
              Preço por cota (R$)
            </label>
            <Input
              type="number"
              step="0.01"
              value={String(price)}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPrice(Number(e.target.value))
              }
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-slate-700">
              Rendimento mensal (%)
            </label>
            <Input
              type="number"
              step="0.01"
              value={String((monthlyYieldPct * 100).toFixed(2))}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setMonthlyYieldPct(Number(e.target.value) / 100)
              }
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-slate-700">
              Crescimento anual do preço (%)
            </label>
            <Input
              type="number"
              step="0.01"
              value={String((annualPriceGrowth * 100).toFixed(2))}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setAnnualPriceGrowth(Number(e.target.value) / 100)
              }
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-slate-700">Anos</label>
            <Input
              type="number"
              value={String(years)}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setYears(Number(e.target.value))
              }
              className="mt-1"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm">
              <input
                type="checkbox"
                checked={reinvest}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setReinvest(e.target.checked)
                }
                className="mr-2"
              />{" "}
              Reinvestir
            </label>
          </div>

          <div className="sm:col-span-3 flex gap-2">
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
                <TableHead>Preço início</TableHead>
                <TableHead className="text-right">Cotas fim</TableHead>
                <TableHead className="text-right">Rendimentos (R$)</TableHead>
                <TableHead className="text-right">Acumulado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.year}>
                  <TableCell>{r.year}</TableCell>
                  <TableCell>{r.priceStart.toFixed(6)}</TableCell>
                  <TableCell className="text-right">
                    {r.unitsEnd.toFixed(6)}
                  </TableCell>
                  <TableCell className="text-right">
                    {r.dividendsYear.toFixed(6)}
                  </TableCell>
                  <TableCell className="text-right">
                    {r.accumulated.toFixed(6)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {rows.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Visualizações</h3>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorAcum" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="acumulado"
                    stroke="#2563eb"
                    fillOpacity={1}
                    fill="url(#colorAcum)"
                    name="Acumulado (R$)"
                  />
                  <Line
                    type="monotone"
                    dataKey="dividends"
                    stroke="#ef4444"
                    dot={false}
                    name="Rendimentos/ano (R$)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </section>
      <div className="mt-6 text-xs text-slate-600">
        <strong>Disclaimer:</strong> Este simulador fornece apenas estimativas e
        informações educativas; não substitui aconselhamento financeiro ou
        fiscal profissional.
      </div>
    </div>
  );
}
