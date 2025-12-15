"use client";

import React, { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function ConversorTaxasPage() {
  const [monthlyPct, setMonthlyPct] = useState<string>("1");

  const numeric = (v: string) => Number(v.replace(/,/g, ".") || 0);

  const result = useMemo(() => {
    const m = numeric(monthlyPct) / 100;
    const effectiveAnnual = Math.pow(1 + m, 12) - 1;
    const nominalAnnual = m * 12;
    return {
      effectiveAnnual: effectiveAnnual * 100,
      nominalAnnual: nominalAnnual * 100,
    };
  }, [monthlyPct]);

  function exportCSV() {
    const rows = [
      ["Taxa mensal (%)", "Taxa nominal anual (%)", "Taxa efetiva anual (%)"],
      [
        monthlyPct,
        result.nominalAnnual.toFixed(6),
        result.effectiveAnnual.toFixed(6),
      ],
    ];
    const csv = rows.map((r) => r.join(";")).join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "conversor_taxas.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className={cn("min-h-screen p-6 bg-white")}>
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold mb-4">
          Conversor de Taxas (% mês → % ano)
        </h1>
        <p className="text-sm text-slate-600 mb-4">
          Converte taxa mensal para taxa nominal anual e taxa efetiva anual.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Taxa mensal (%)</label>
            <Input
              value={monthlyPct}
              onChange={(e) => setMonthlyPct(e.target.value)}
            />
            <div className="mt-4">
              <Button onClick={exportCSV}>Salvar como CSV</Button>
            </div>
          </div>

          <div>
            <Card className="p-4">
              <h2 className="font-semibold">Resultado</h2>
              <div className="mt-3 text-sm text-slate-700">
                <div>
                  Taxa nominal anual:{" "}
                  <strong>{result.nominalAnnual.toFixed(6)}%</strong>
                </div>
                <div className="mt-2">
                  Taxa efetiva anual:{" "}
                  <strong>{result.effectiveAnnual.toFixed(6)}%</strong>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-6 text-xs text-slate-600">
          <strong>Disclaimer:</strong> resultados são estimativas para fins
          educativos; não substituem análise financeira profissional.
        </div>
      </div>
    </main>
  );
}
