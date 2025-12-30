"use client";
import { useState, type ChangeEvent, useMemo, useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
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

export default function SimuladorRendaMensalDesejada() {
  const [desiredMonthly, setDesiredMonthly] = useState<number>(2000);
  const [annualYieldPct, setAnnualYieldPct] = useState<number>(0.06); // 6% ao ano
  const [scenariosRange, setScenariosRange] = useState<number>(2); // +/- percent points

  useEffect(() => {
    track({
      event: "tool_viewed",
      page_path: "/finance/simulador-renda-mensal-desejada",
      tool_name: "Simulador de Renda Mensal Desejada",
    });
  }, []);

  const monthlyYield = annualYieldPct / 12;

  const requiredCapital = monthlyYield > 0 ? desiredMonthly / monthlyYield : 0;
  const annualIncome = requiredCapital * annualYieldPct;

  const brl = useMemo(
    () =>
      new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }),
    []
  );

  const scenarios = useMemo(() => {
    const rows: { yield: number; requiredCapital: number }[] = [];
    const basePct = annualYieldPct * 100;
    for (let d = -scenariosRange; d <= scenariosRange; d++) {
      const pct = (basePct + d) / 100; // decimal
      const my = pct / 12;
      const cap = my > 0 ? desiredMonthly / my : 0;
      rows.push({ yield: pct, requiredCapital: cap });
    }
    return rows;
  }, [desiredMonthly, annualYieldPct, scenariosRange]);

  const chartData = useMemo(
    () =>
      scenarios.map((s) => ({
        yieldPct: Number((s.yield * 100).toFixed(2)),
        required: Number(s.requiredCapital.toFixed(2)),
      })),
    [scenarios]
  );

  function exportCSV() {
    const header = ["Yield (%)", "Capital necessário"];
    const lines = scenarios.map((s) =>
      [(s.yield * 100).toFixed(2) + "%", brl.format(s.requiredCapital)].join(
        ";"
      )
    );
    const csv = [header.join(";"), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "simulador_renda_mensal_scenarios.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">
          Simulador de Renda Mensal Desejada
        </h1>
        <p className="text-sm text-slate-600">
          Informe quanto você quer receber por mês e o rendimento anual esperado
          para calcular o capital necessário.
        </p>
      </header>

      <section className="grid gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <div>
            <label className="text-sm text-slate-700">
              Renda mensal desejada (R$)
            </label>
            <Input
              type="number"
              value={String(desiredMonthly)}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setDesiredMonthly(Number(e.target.value))
              }
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-slate-700">
              Rendimento anual esperado (%)
            </label>
            <Input
              type="number"
              step="0.01"
              value={String((annualYieldPct * 100).toFixed(2))}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setAnnualYieldPct(Number(e.target.value) / 100)
              }
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-slate-700">
              Variação de cenários (pontos percentuais)
            </label>
            <Input
              type="number"
              value={String(scenariosRange)}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setScenariosRange(Number(e.target.value))
              }
              className="mt-1"
            />
          </div>

          <div className="sm:col-span-3 flex gap-2">
            <Button onClick={exportCSV}>Exportar cenários CSV</Button>
            <Link href="/" className="text-sm text-slate-600 self-center">
              Voltar
            </Link>
          </div>
        </div>

        <div className="grid gap-2">
          <div className="text-sm text-slate-700">Resultado</div>
          <div className="mt-2 text-xl font-semibold">
            Capital necessário: {brl.format(requiredCapital)}
          </div>
          <div className="text-sm text-slate-600">
            Rendimento anual estimado: {brl.format(annualIncome)}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-medium mb-2">
            Cenários próximos ({scenariosRange}pp)
          </h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Yield (%)</TableHead>
                <TableHead className="text-right">
                  Capital necessário (R$)
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scenarios.map((s, i) => (
                <TableRow key={i}>
                  <TableCell>{(s.yield * 100).toFixed(2)}%</TableCell>
                  <TableCell className="text-right">
                    {brl.format(s.requiredCapital)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {chartData.length > 0 && (
            <div className="mt-6 w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="yieldPct"
                    label={{
                      value: "Yield (%)",
                      position: "insideBottom",
                      offset: -5,
                    }}
                  />
                  <YAxis tickFormatter={(v) => brl.format(Number(v))} />
                  <Tooltip
                    formatter={(value: number) =>
                      typeof value === "number" ? brl.format(value) : value
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="required"
                    stroke="#10b981"
                    name="Capital necessário"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
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
