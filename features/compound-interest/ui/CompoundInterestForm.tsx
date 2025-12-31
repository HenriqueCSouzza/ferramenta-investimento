// src/features/compound-interest/ui/CompoundInterestForm.tsx
"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { calculateCompoundInterest } from "../domain/calculate-compound-interest";
import { buildSimulationCsv } from "../domain/csv-export";
import { SimulationResult, InterestRateType } from "../domain/models";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import SimulationResultTable from "./SimulationResultTable";
import SimulationChart from "./SimulationChart";
import { track } from "@/lib/analytics";

const simulationSchema = z.object({
  initialAmount: z
    .number({ error: "O valor inicial é obrigatório" })
    .min(0, "O valor inicial deve ser maior ou igual a zero"),
  monthlyContribution: z
    .number({ error: "O aporte mensal é obrigatório" })
    .min(0, "O aporte mensal deve ser maior ou igual a zero"),
  interestRate: z
    .number({ error: "A taxa de juros é obrigatória" })
    .min(0, "A taxa de juros deve ser maior ou igual a zero"),
  interestRateType: z.enum(["monthly", "annual"]),
  months: z
    .number({ error: "O número de meses é obrigatório" })
    .min(1, "O período deve ter pelo menos 1 mês"),
});

type SimulationFormValues = z.infer<typeof simulationSchema>;

interface SavedSimulation extends SimulationFormValues {
  id: string;
  createdAt: string;
  result: SimulationResult;
}

export default function CompoundInterestForm() {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [savedSimulations, setSavedSimulations] = useState<SavedSimulation[]>(
    []
  );
  const [simulationName, setSimulationName] = useState("");

  const form = useForm<SimulationFormValues>({
    resolver: zodResolver(simulationSchema),
    defaultValues: {
      initialAmount: 0,
      monthlyContribution: 0,
      interestRate: 0,
      interestRateType: "monthly",
      months: 12,
    },
  });

  // Carregar simulações do localStorage ao montar o componente
  useEffect(() => {
    const stored = localStorage.getItem("savedSimulations");
    if (stored) {
      try {
        setSavedSimulations(JSON.parse(stored));
      } catch (error) {
        console.error("Erro ao carregar simulações salvas:", error);
      }
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = form;

  const onSubmit = (values: SimulationFormValues) => {
    track({
      event: "tool_used",
      page_path: "/finance/simulador-juros-compostos",
      tool_name: "Simulador de Juros Compostos",
    });
    const simulationResult = calculateCompoundInterest({
      initialAmount: values.initialAmount,
      monthlyContribution: values.monthlyContribution,
      interestRate: values.interestRate,
      interestRateType: values.interestRateType as InterestRateType,
      months: values.months,
    });

    setResult(simulationResult);
  };

  const handleDownloadCsv = () => {
    if (!result) return;

    track({
      event: "export_result",
      page_path: "/finance/simulador-juros-compostos",
      tool_name: "Simulador de Juros Compostos",
      export_type: "csv",
    });
    const csv = buildSimulationCsv(result);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "simulacao-juros-compostos.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSaveSimulation = (values: SimulationFormValues) => {
    if (!result || !simulationName.trim()) {
      alert("Por favor, dê um nome à simulação");
      return;
    }

    const newSavedSimulation: SavedSimulation = {
      ...values,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      result,
    };

    const updatedSimulations = [...savedSimulations, newSavedSimulation];
    setSavedSimulations(updatedSimulations);
    localStorage.setItem(
      "savedSimulations",
      JSON.stringify(updatedSimulations)
    );
    setSimulationName("");
    alert("Simulação salva com sucesso!");
  };

  const handleDeleteSimulation = (id: string) => {
    const updatedSimulations = savedSimulations.filter((sim) => sim.id !== id);
    setSavedSimulations(updatedSimulations);
    localStorage.setItem(
      "savedSimulations",
      JSON.stringify(updatedSimulations)
    );
  };

  const handleLoadSimulation = (simulation: SavedSimulation) => {
    const {
      initialAmount,
      monthlyContribution,
      interestRate,
      interestRateType,
      months,
    } = simulation;

    form.reset({
      initialAmount,
      monthlyContribution,
      interestRate,
      interestRateType,
      months,
    });

    setResult(simulation.result);
  };

  return (
    <div className="space-y-6">
      <Card className="border-emerald-100 bg-emerald-50/40">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-emerald-900">
            Simulador de Juros Compostos
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid gap-4 md:grid-cols-2"
          >
            {/* Valor Inicial */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="initialAmount">Valor inicial (R$)</Label>
              <Input
                id="initialAmount"
                type="number"
                step="0.01"
                {...register("initialAmount", { valueAsNumber: true })}
              />
              {errors.initialAmount && (
                <p className="text-sm text-red-500">
                  {errors.initialAmount.message}
                </p>
              )}
            </div>

            {/* Aporte mensal */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="monthlyContribution">Aporte mensal (R$)</Label>
              <Input
                id="monthlyContribution"
                type="number"
                step="0.01"
                {...register("monthlyContribution", { valueAsNumber: true })}
              />
              {errors.monthlyContribution && (
                <p className="text-sm text-red-500">
                  {errors.monthlyContribution.message}
                </p>
              )}
            </div>

            {/* Taxa de juros */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="interestRate">Taxa de juros (%)</Label>
              <Input
                id="interestRate"
                type="number"
                step="0.01"
                {...register("interestRate", { valueAsNumber: true })}
              />
              {errors.interestRate && (
                <p className="text-sm text-red-500">
                  {errors.interestRate.message}
                </p>
              )}
            </div>

            {/* Tipo de taxa */}
            <div className="flex flex-col space-y-1.5">
              <Label>Tipo da taxa</Label>
              <Select
                value={watch("interestRateType")}
                onValueChange={(value) =>
                  setValue("interestRateType", value as InterestRateType)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de taxa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Mensal</SelectItem>
                  <SelectItem value="annual">Anual</SelectItem>
                </SelectContent>
              </Select>
              {errors.interestRateType && (
                <p className="text-sm text-red-500">
                  {errors.interestRateType.message}
                </p>
              )}
            </div>

            {/* Meses */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="months">Período (meses)</Label>
              <Input
                id="months"
                type="number"
                {...register("months", { valueAsNumber: true })}
              />
              {errors.months && (
                <p className="text-sm text-red-500">{errors.months.message}</p>
              )}
            </div>

            {/* Botão de simular */}
            <div className="flex items-end">
              <Button
                type="submit"
                className="w-full btn-primary rounded-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Calculando..." : "Simular"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Resultado */}
      {result && (
        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Resultado da simulação</span>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleDownloadCsv}>
                  Exportar CSV
                </Button>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Salvar simulação */}
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Nome da simulação"
                value={simulationName}
                onChange={(e) => setSimulationName(e.target.value)}
              />
              <Button
                onClick={() => handleSaveSimulation(form.getValues())}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Salvar simulação
              </Button>
            </div>

            {/* Gráfico */}
            <SimulationChart result={result} />

            {/* Resumo */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-slate-500">Total investido</p>
                <p className="text-xl font-semibold text-slate-900">
                  R$ {result.totalInvested.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Montante final</p>
                <p className="text-xl font-semibold text-emerald-700">
                  R$ {result.finalAmount.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Tabela */}
            <SimulationResultTable result={result} />
          </CardContent>
        </Card>
      )}

      {/* Simulações Salvas */}
      {savedSimulations.length > 0 && (
        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-900">
              Simulações Salvas
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              {savedSimulations.map((simulation) => (
                <div
                  key={simulation.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 p-4 hover:bg-slate-50"
                >
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">
                      {simulation.createdAt}
                    </p>
                    <p className="text-sm text-slate-500">
                      Inicial: R$ {simulation.initialAmount.toFixed(2)} |
                      Aporte: R$ {simulation.monthlyContribution.toFixed(2)} |
                      Taxa: {simulation.interestRate}% (
                      {simulation.interestRateType === "monthly"
                        ? "mensal"
                        : "anual"}
                      ) | Período: {simulation.months}m
                    </p>
                    <p className="text-sm font-semibold text-emerald-700">
                      Montante final: R${" "}
                      {simulation.result.finalAmount.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleLoadSimulation(simulation)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Carregar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteSimulation(simulation.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Deletar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
