"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";

const STATE_RATES: { code: string; name: string; rate: number }[] = [
  { code: "SP", name: "São Paulo", rate: 4 },
  { code: "RJ", name: "Rio de Janeiro", rate: 4 },
  { code: "MG", name: "Minas Gerais", rate: 4 },
  { code: "RS", name: "Rio Grande do Sul", rate: 3 },
  { code: "BA", name: "Bahia", rate: 3 },
  { code: "DF", name: "Distrito Federal", rate: 3 },
];

export default function SimuladorIPVAPage() {
  const [vehicleValue, setVehicleValue] = useState<string>("");
  const [stateCode, setStateCode] = useState<string>(STATE_RATES[0].code);
  const [customRate, setCustomRate] = useState<string>("");

  useEffect(() => {
    track({
      event: "tool_viewed",
      page_path: "/finance/simulador-ipva",
      tool_name: "Simulador de IPVA",
    });
  }, []);

  const numeric = (v: string) =>
    Number(v.replace(/[^0-9.,-]/g, "").replace(/,/g, ".") || 0);

  const appliedRate = useMemo(() => {
    if (customRate) return numeric(customRate);
    const s = STATE_RATES.find((s) => s.code === stateCode);
    return s ? s.rate : 0;
  }, [stateCode, customRate]);

  const result = useMemo(() => {
    const value = numeric(vehicleValue);
    const tax = value * (appliedRate / 100);
    track({
      event: "tool_used",
      page_path: "/finance/simulador-ipva",
      tool_name: "Simulador de IPVA",
    });
    return { value, rate: appliedRate, tax };
  }, [vehicleValue, appliedRate]);

  function exportCSV() {
    const brl = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    const rows = [
      ["Valor do veículo", "Estado", "Alíquota (%)", "IPVA (R$)"],
      [
        brl.format(result.value),
        stateCode,
        result.rate.toFixed(2) + "%",
        brl.format(result.tax),
      ],
    ];
    track({
      event: "export_result",
      page_path: "/finance/simulador-ipva",
      tool_name: "Simulador de IPVA",
      export_type: "csv",
    });
    const csv = rows.map((r) => r.join(";")).join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "simulador-ipva.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <main className={cn("min-h-screen p-6 bg-white")}>
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-bold mb-4">Simulador de IPVA</h1>

        <p className="text-sm text-slate-600 mb-4">
          Estimativa do IPVA baseada no valor do veículo e na alíquota do estado
          escolhido. Valores aproximados.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Valor do veículo (R$)</label>
            <Input
              value={vehicleValue}
              onChange={(e) => setVehicleValue(e.target.value)}
              placeholder="Ex: 50000"
            />

            <label className="mt-3 text-sm font-medium">Estado</label>
            <select
              className="w-full rounded-md border px-3 py-2"
              value={stateCode}
              onChange={(e) => setStateCode(e.target.value)}
            >
              {STATE_RATES.map((s) => (
                <option
                  key={s.code}
                  value={s.code}
                >{`${s.name} (${s.code}) — ${s.rate}%`}</option>
              ))}
            </select>

            <label className="mt-3 text-sm font-medium">
              Alíquota customizada (%) — opcional
            </label>
            <Input
              value={customRate}
              onChange={(e) => setCustomRate(e.target.value)}
              placeholder="Deixe vazio para usar a alíquota do estado"
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
                  Valor do veículo:{" "}
                  <strong>
                    {result.value.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </strong>
                </div>
                <div className="mt-2">
                  Alíquota aplicada: <strong>{result.rate.toFixed(2)}%</strong>
                </div>
                <div className="mt-2">
                  IPVA estimado:{" "}
                  <strong>
                    {result.tax.toLocaleString("pt-BR", {
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
          <strong>Disclaimer:</strong> este simulador é apenas uma estimativa e
          não substitui consultas à Secretaria da Fazenda do seu estado.
        </div>
      </div>
    </main>
  );
}
