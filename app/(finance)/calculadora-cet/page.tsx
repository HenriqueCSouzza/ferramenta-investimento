"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";

export default function CalculadoraCETPage() {
  const [principal, setPrincipal] = useState<string>("10000");
  const [months, setMonths] = useState<string>("12");
  const [monthlyRatePct, setMonthlyRatePct] = useState<string>("1");

  useEffect(() => {
    track({
      event: "tool_viewed",
      page_path: "/finance/calculadora-cet",
      tool_name: "Calculadora CET (simplificada)",
    });
  }, []);

  const n = (v: string) => Number(v.replace(/,/g, ".") || 0);

  const result = useMemo(() => {
    const pv = n(principal);
    const nMonths = Math.max(1, Math.floor(n(months)));
    const r = n(monthlyRatePct) / 100;

    // annuity payment
    const payment =
      r > 0 ? (r * pv) / (1 - Math.pow(1 + r, -nMonths)) : pv / nMonths;
    const totalPaid = payment * nMonths;
    // annualized CET approximation
    const cetAnnual = Math.pow(totalPaid / pv, 12 / nMonths) - 1;
    return { payment, totalPaid, cetAnnual: cetAnnual * 100 };
  }, [principal, months, monthlyRatePct]);

  function exportCSV() {
    const brl = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    const rows = [
      [
        "Principal",
        "Meses",
        "Taxa mensal (%)",
        "Parcela (R$)",
        "Total pago (R$)",
        "CET anual aproximado (%)",
      ],
      [
        principal,
        months,
        monthlyRatePct,
        result.payment.toFixed(2),
        brl.format(result.totalPaid),
        result.cetAnnual.toFixed(6),
      ],
    ];
    const csv = rows.map((r) => r.join(";")).join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "calculadora_cet.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className={cn("min-h-screen p-6 bg-white")}>
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold mb-4">
          Calculadora CET (simplificada)
        </h1>
        <p className="text-sm text-slate-600 mb-4">
          Calcula parcela mensal, total pago e CET anual aproximado
          (simplificado).
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Principal (R$)</label>
            <Input
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
            />

            <label className="mt-3 text-sm font-medium">Meses</label>
            <Input value={months} onChange={(e) => setMonths(e.target.value)} />

            <label className="mt-3 text-sm font-medium">Taxa mensal (%)</label>
            <Input
              value={monthlyRatePct}
              onChange={(e) => setMonthlyRatePct(e.target.value)}
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
                  Parcela mensal: <strong>{result.payment.toFixed(2)}</strong>
                </div>
                <div className="mt-2">
                  Total pago:{" "}
                  <strong>
                    {result.totalPaid.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </strong>
                </div>
                <div className="mt-2">
                  CET anual aproximado:{" "}
                  <strong>{result.cetAnnual.toFixed(6)}%</strong>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-6 text-xs text-slate-600">
          <strong>Disclaimer:</strong> cálculo simplificado do CET para fins
          educativos; cálculo oficial pode incluir tarifas, seguros e outros
          encargos.
        </div>
      </div>
    </main>
  );
}
