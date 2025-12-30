"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";

const dependenteDeduction = 2276.26; // valor anual aproximado por dependente (exemplo)

type Bracket = { upTo: number | null; rate: number; deduction: number };

// Faixas exemplares (valores em BRL) - aproximado e sujeito a atualização
const BRAZIL_BRACKETS: Bracket[] = [
  { upTo: 22847.76, rate: 0, deduction: 0 },
  { upTo: 33919.8, rate: 0.075, deduction: 1713.58 },
  { upTo: 45012.6, rate: 0.15, deduction: 4257.57 },
  { upTo: 55976.16, rate: 0.225, deduction: 7633.51 },
  { upTo: null, rate: 0.275, deduction: 10432.32 },
];

function calculateIRPF(taxableIncome: number) {
  if (taxableIncome <= 0) return { tax: 0, effectiveRate: 0 };

  // Encontrar faixa aplicável (simplificação: cálculo por tabela progressiva com parcela a deduzir)
  let tax = 0;
  for (const br of BRAZIL_BRACKETS) {
    if (br.upTo === null || taxableIncome <= br.upTo) {
      tax = taxableIncome * br.rate - br.deduction;
      break;
    }
  }
  if (tax < 0) tax = 0;

  track({
    event: "tool_used",
    page_path: "/finance/simulador-imposto-de-renda",
    tool_name: "Simulador de Imposto de Renda",
  });
  return { tax, effectiveRate: tax / taxableIncome };
}

export default function SimuladorIRPFPage() {
  const [annualIncome, setAnnualIncome] = useState<string>("");
  const [deductions, setDeductions] = useState<string>("");
  const [dependents, setDependents] = useState<string>("0");

  useEffect(() => {
    track({
      event: "tool_viewed",
      page_path: "/finance/simulador-imposto-de-renda",
      tool_name: "Simulador de Imposto de Renda",
    });
  }, []);

  const numeric = (v: string) =>
    Number(v.replace(/[^0-9.,-]/g, "").replace(/,/g, ".") || 0);

  const taxable = useMemo(() => {
    const gross = numeric(annualIncome);
    const ded =
      numeric(deductions) + Number(dependents || 0) * dependenteDeduction;
    const t = Math.max(0, gross - ded);
    return t;
  }, [annualIncome, deductions, dependents]);

  const result = useMemo(() => calculateIRPF(taxable), [taxable]);

  function exportCSV() {
    const brl = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    const rows = [
      [
        "Renda anual bruta",
        "Deduções",
        "Dependentes",
        "Renda tributável",
        "Imposto estimado",
        "Alíquota efetiva",
      ],
      [
        brl.format(Number(annualIncome || 0)),
        brl.format(Number(deductions || 0)),
        String(Number(dependents || 0)),
        brl.format(taxable),
        brl.format(result.tax),
        (result.effectiveRate * 100).toFixed(2) + "%",
      ],
    ];

    // semicolon delimiter for pt-BR compatibility
    const csv = rows.map((r) => r.join(";")).join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "simulador-irpf.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <main className={cn("min-h-screen p-6 bg-white")}>
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold mb-4">
          Simulador de Imposto de Renda (Pessoa Física)
        </h1>

        <p className="text-sm text-slate-600 mb-4">
          Este simulador fornece apenas uma estimativa aproximada — não
          substitui um contador.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">
              Renda anual bruta (R$)
            </label>
            <Input
              value={annualIncome}
              onChange={(e) => setAnnualIncome(e.target.value)}
              placeholder="Ex: 60000"
            />

            <label className="mt-3 text-sm font-medium">Deduções (R$)</label>
            <Input
              value={deductions}
              onChange={(e) => setDeductions(e.target.value)}
              placeholder="INSS, despesas médicas, etc."
            />

            <label className="mt-3 text-sm font-medium">Dependentes</label>
            <Input
              value={dependents}
              onChange={(e) => setDependents(e.target.value)}
              placeholder="0"
            />

            <div className="mt-4">
              <Button onClick={exportCSV}>Salvar como CSV</Button>
            </div>
          </div>

          <div>
            <Card className="p-4">
              <h2 className="font-semibold">Resultado (estimado)</h2>
              <div className="mt-3 text-sm text-slate-700">
                <div>
                  Renda tributável:{" "}
                  <strong>
                    R${" "}
                    {taxable.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </strong>
                </div>
                <div className="mt-2">
                  Imposto estimado:{" "}
                  <strong>
                    R${" "}
                    {result.tax.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </strong>
                </div>
                <div className="mt-2">
                  Alíquota efetiva:{" "}
                  <strong>{(result.effectiveRate * 100).toFixed(2)}%</strong>
                </div>
              </div>

              <div className="mt-4 text-xs text-slate-600">
                <strong>Observação:</strong> faixas e parcelas dedutíveis usadas
                aqui são apenas para simulação e podem não refletir a tabela
                oficial vigente.
              </div>
            </Card>

            <Card className="mt-4 p-3">
              <h3 className="font-medium">Tabela de faixas (aplicada)</h3>
              <ul className="mt-2 text-sm">
                {BRAZIL_BRACKETS.map((b, i) => (
                  <li key={i}>
                    {b.upTo
                      ? `Até R$ ${b.upTo.toLocaleString("pt-BR")}`
                      : "Acima"}{" "}
                    — {b.rate * 100}% — parcela a deduzir R${" "}
                    {b.deduction.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>

        <div className="mt-6 text-xs text-slate-600">
          <strong>Disclaimer:</strong> esse simulador não substitui um contador;
          trata-se de uma simulação aproximada.
        </div>
      </div>
    </main>
  );
}
