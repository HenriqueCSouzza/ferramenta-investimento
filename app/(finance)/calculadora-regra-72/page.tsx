"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";

export default function Regra72Page() {
  const [annualPct, setAnnualPct] = useState<string>("8");

  useEffect(() => {
    track({
      event: "tool_viewed",
      page_path: "/finance/calculadora-regra-72",
      tool_name: "Calculadora da Regra dos 72",
    });
  }, []);
  const n = (v: string) => Number(v.replace(/,/g, ".") || 0);

  const result = useMemo(() => {
    const r = n(annualPct) / 100;
    const rule72 = r > 0 ? 72 / (r * 100) : Infinity; // note: formula expects percent
    const exact = r > 0 ? Math.log(2) / Math.log(1 + r) : Infinity;
    track({
      event: "tool_used",
      page_path: "/finance/calculadora-regra-72",
      tool_name: "Calculadora da Regra dos 72",
    });
    return { rule72, exact };
  }, [annualPct]);

  function exportCSV() {
    const rows = [
      ["Taxa anual (%)", "Tempo (anos) Regra 72", "Tempo (anos) exato"],
      [
        annualPct,
        result.rule72 === Infinity ? "-" : result.rule72.toFixed(4),
        result.exact === Infinity ? "-" : result.exact.toFixed(4),
      ],
    ];
    track({
      event: "export_result",
      page_path: "/finance/calculadora-regra-72",
      tool_name: "Calculadora da Regra dos 72",
      export_type: "csv",
    });
    const csv = rows.map((r) => r.join(";")).join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "regra_72.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className={cn("min-h-screen p-6 bg-white")}>
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold mb-4">Calculadora — Regra dos 72</h1>
        <p className="text-sm text-slate-600 mb-4">
          Estimativa de tempo para dobrar o patrimônio usando Regra dos 72 e
          cálculo exato.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Taxa anual (%)</label>
            <Input
              value={annualPct}
              onChange={(e) => setAnnualPct(e.target.value)}
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
                  Tempo (Regra dos 72):{" "}
                  <strong>
                    {isFinite(result.rule72)
                      ? result.rule72.toFixed(4) + " anos"
                      : "—"}
                  </strong>
                </div>
                <div className="mt-2">
                  Tempo (cálculo exato):{" "}
                  <strong>
                    {isFinite(result.exact)
                      ? result.exact.toFixed(4) + " anos"
                      : "—"}
                  </strong>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-6 text-xs text-slate-600">
          <strong>Disclaimer:</strong> valores são estimativas; Regra dos 72 é
          aproximação e não substitui planejamento financeiro.
        </div>
      </div>
    </main>
  );
}
