"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";

export default function CalculadoraReservaPage() {
  const [monthlyExpense, setMonthlyExpense] = useState<string>("");
  const [months, setMonths] = useState<string>("6");
  const [safetyBufferPct, setSafetyBufferPct] = useState<string>("0");

  useEffect(() => {
    track({
      event: "tool_viewed",
      page_path: "/finance/calculadora-reserva-emergencia",
      tool_name: "Calculadora de Reserva de Emergência  ",
    });
  }, []);

  const numeric = (v: string) =>
    Number(v.replace(/[^0-9.,-]/g, "").replace(/,/g, ".") || 0);

  const required = useMemo(() => {
    const m = numeric(monthlyExpense);
    const mo = Math.max(0, Math.floor(Number(months) || 0));
    const base = m * mo;
    const buffer = base * (numeric(safetyBufferPct) / 100);
    track({
      event: "tool_used",
      page_path: "/finance/calculadora-reserva-emergencia",
      tool_name: "Calculadora de Reserva de Emergência",
    });
    return { base, buffer, total: base + buffer };
  }, [monthlyExpense, months, safetyBufferPct]);

  function exportCSV() {
    const brl = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    const rows = [
      [
        "Despesa mensal",
        "Meses desejados",
        "Buffer (%)",
        "Reserva base",
        "Buffer",
        "Reserva total",
      ],
      [
        brl.format(numeric(monthlyExpense)),
        String(Number(months || 0)),
        Number(safetyBufferPct || 0).toFixed(2) + "%",
        brl.format(required.base),
        brl.format(required.buffer),
        brl.format(required.total),
      ],
    ];
    track({
      event: "export_result",
      page_path: "/finance/calculadora-reserva-emergencia",
      tool_name: "Calculadora de Reserva de Emergência",
      export_type: "csv",
    });
    const csv = rows.map((r) => r.join(";")).join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reserva-emergencia.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <main className={cn("min-h-screen p-6 bg-white")}>
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-bold mb-4">
          Calculadora de Reserva de Emergência
        </h1>

        <p className="text-sm text-slate-600 mb-4">
          Calcule quanto você precisa guardar para cobrir despesas por um
          período de emergência. Este é um cálculo aproximado.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">
              Despesa mensal média (R$)
            </label>
            <Input
              value={monthlyExpense}
              onChange={(e) => setMonthlyExpense(e.target.value)}
              placeholder="Ex: 2500"
            />

            <label className="mt-3 text-sm font-medium">Meses desejados</label>
            <Input
              value={months}
              onChange={(e) => setMonths(e.target.value)}
              placeholder="Ex: 6"
            />

            <label className="mt-3 text-sm font-medium">
              Buffer de segurança (%)
            </label>
            <Input
              value={safetyBufferPct}
              onChange={(e) => setSafetyBufferPct(e.target.value)}
              placeholder="Ex: 10"
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
                  Reserva base:{" "}
                  <strong>
                    {required.base.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </strong>
                </div>
                <div className="mt-2">
                  Buffer:{" "}
                  <strong>
                    {required.buffer.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </strong>
                </div>
                <div className="mt-2">
                  Reserva total:{" "}
                  <strong>
                    {required.total.toLocaleString("pt-BR", {
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
          <strong>Disclaimer:</strong> esse cálculo é aproximado e não substitui
          planejamento financeiro profissional.
        </div>
      </div>
    </main>
  );
}
