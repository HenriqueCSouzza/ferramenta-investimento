"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";

export default function RendimentoLiquidoPage() {
  const [grossPct, setGrossPct] = useState<string>("10");
  const [taxPct, setTaxPct] = useState<string>("15");
  const [feesPct, setFeesPct] = useState<string>("0.5");
  const [amount, setAmount] = useState<string>("1000");

  useEffect(() => {
    track({
      event: "tool_viewed",
      page_path: "/finance/calculadora-rendimento-liquido",
      tool_name: "Calculadora de Rendimento Líquido",
    });
  }, []);

  const n = (v: string) => Number(v.replace(/,/g, ".") || 0);

  const result = useMemo(() => {
    const gross = n(grossPct) / 100;
    const tax = n(taxPct) / 100;
    const fees = n(feesPct) / 100;
    const netPct = gross * (1 - tax) - fees;
    const invested = Number(n(amount) || 0);
    const netAmount = invested * (1 + netPct);
    track({
      event: "tool_used",
      page_path: "/finance/calculadora-rendimento-liquido",
      tool_name: "Calculadora de Rendimento Líquido",
    });
    return { netPct: netPct * 100, netAmount };
  }, [grossPct, taxPct, feesPct, amount]);

  function exportCSV() {
    const brl = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    const rows = [
      [
        "Rendimento bruto (%)",
        "IR (%)",
        "Taxas (%)",
        "Rendimento líquido (%)",
        "Valor líquido (R$)",
      ],
      [
        grossPct,
        taxPct,
        feesPct,
        result.netPct.toFixed(6),
        brl.format(result.netAmount),
      ],
    ];
    track({
      event: "export_result",
      page_path: "/finance/calculadora-rendimento-liquido",
      tool_name: "Calculadora de Rendimento Líquido",
      export_type: "csv",
    });
    const csv = rows.map((r) => r.join(";")).join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rendimento_liquido.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className={cn("min-h-screen p-6 bg-white")}>
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold mb-4">
          Calculadora de Rendimento Líquido
        </h1>
        <p className="text-sm text-slate-600 mb-4">
          Estima rendimento após impostos e taxas (porcentagens aplicadas sobre
          o rendimento).
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Rendimento bruto (%)</label>
            <Input
              value={grossPct}
              onChange={(e) => setGrossPct(e.target.value)}
            />

            <label className="mt-3 text-sm font-medium">
              Imposto sobre ganho (%)
            </label>
            <Input value={taxPct} onChange={(e) => setTaxPct(e.target.value)} />

            <label className="mt-3 text-sm font-medium">
              Taxas (% absolutas)
            </label>
            <Input
              value={feesPct}
              onChange={(e) => setFeesPct(e.target.value)}
            />

            <label className="mt-3 text-sm font-medium">
              Valor investido (R$)
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
                  Rendimento líquido (%):{" "}
                  <strong>{result.netPct.toFixed(6)}%</strong>
                </div>
                <div className="mt-2">
                  Valor líquido estimado:{" "}
                  <strong>
                    {result.netAmount.toLocaleString("pt-BR", {
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
          <strong>Disclaimer:</strong> estimativas para fins educativos;
          impostos e taxas podem variar conforme legislação e instituições.
        </div>
      </div>
    </main>
  );
}
