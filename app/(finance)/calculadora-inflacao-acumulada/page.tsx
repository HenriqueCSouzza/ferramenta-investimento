"use client";

import React, { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function InflacaoAcumuladaPage() {
  const [annualPct, setAnnualPct] = useState<string>("3");
  const [years, setYears] = useState<string>("5");
  const [amount, setAmount] = useState<string>("1000");

  const n = (v: string) => Number(v.replace(/,/g, ".") || 0);

  const result = useMemo(() => {
    const r = n(annualPct) / 100;
    const y = Math.max(0, Math.floor(n(years)));
    const factor = Math.pow(1 + r, y);
    const inflationPct = (factor - 1) * 100;
    const adjusted = n(amount) * factor;
    return { factor, inflationPct, adjusted };
  }, [annualPct, years, amount]);

  function exportCSV() {
    const brl = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    const rows = [
      [
        "Inflação anual (%)",
        "Anos",
        "Fator acumulado",
        "Inflação acumulada (%)",
        "Valor ajustado (R$)",
      ],
      [
        annualPct,
        years,
        result.factor.toFixed(6),
        result.inflationPct.toFixed(6),
        brl.format(result.adjusted),
      ],
    ];
    const csv = rows.map((r) => r.join(";")).join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inflacao_acumulada.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className={cn("min-h-screen p-6 bg-white")}>
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold mb-4">
          Calculadora de Inflação Acumulada
        </h1>
        <p className="text-sm text-slate-600 mb-4">
          Calcula inflação acumulada e valor ajustado pelo período informado.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Inflação anual (%)</label>
            <Input
              value={annualPct}
              onChange={(e) => setAnnualPct(e.target.value)}
            />

            <label className="mt-3 text-sm font-medium">Anos</label>
            <Input value={years} onChange={(e) => setYears(e.target.value)} />

            <label className="mt-3 text-sm font-medium">
              Valor inicial (R$)
            </label>
            <Input value={amount} onChange={(e) => setAmount(e.target.value)} />

            <div className="mt-4">
              <Button onClick={exportCSV}>Salvar como CSV</Button>
            </div>
          </div>

          <div>
            <Card className="p-4">
              <h2 className="font-semibold">Resultado</h2>
              <div className="mt-3 text-sm text-slate-700">
                <div>
                  Fator acumulado: <strong>{result.factor.toFixed(6)}</strong>
                </div>
                <div className="mt-2">
                  Inflação acumulada:{" "}
                  <strong>{result.inflationPct.toFixed(6)}%</strong>
                </div>
                <div className="mt-2">
                  Valor ajustado:{" "}
                  <strong>
                    {result.adjusted.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </strong>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-6 text-xs text-slate-600">
          <strong>Disclaimer:</strong> valores estimados para fins educativos;
          inflação real pode variar conforme índices oficiais.
        </div>
      </div>
    </main>
  );
}
