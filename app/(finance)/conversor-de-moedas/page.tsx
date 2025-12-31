"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { track } from "@/lib/analytics";

type HistoryItem = {
  from: string;
  to: string;
  amount: number;
  result: number;
  date: string;
};

const COMMON = ["BRL", "USD", "EUR", "GBP", "JPY", "CNY", "ARS"];

export default function ConversorDeMoedasPage() {
  const [from, setFrom] = useState<string>("USD");
  const [to, setTo] = useState<string>("BRL");
  const [amount, setAmount] = useState<number>(100);
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [rate, setRate] = useState<number | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    track({
      event: "tool_viewed",
      page_path: "/finance/conversor-de-moedas",
      tool_name: "Conversor de Moedas",
    });
  }, []);

  async function convert() {
    if (from === to) return;
    setLoading(true);
    setResult(null);
    setRate(null);
    try {
      const resp = await fetch(
        `https://api.frankfurter.dev/v1/latest?base=${encodeURIComponent(
          from
        )}&symbols=${encodeURIComponent(to)}`
      );
      const json = await resp.json();
      const fetchedRate = json?.rates?.[to];
      const converted =
        typeof fetchedRate === "number" ? amount * fetchedRate : 0;
      setResult(Number(converted ?? 0));
      setRate(typeof fetchedRate === "number" ? fetchedRate : null);
      setHistory((h) => [
        {
          from,
          to,
          amount,
          result: Number(converted ?? 0),
          date: new Date().toISOString(),
        },
        ...h,
      ]);
      track({
        event: "tool_used",
        page_path: "/finance/conversor-de-moedas",
        tool_name: "Conversor de Moedas",
      });
    } catch (e) {
      console.error(e);
      alert("Erro ao converter moedas. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  function exportCSV() {
    const header = ["From", "To", "Amount", "Result", "Date"];
    const rows = history.map((h) =>
      [h.from, h.to, h.amount.toString(), h.result.toFixed(6), h.date].join(",")
    );
    track({
      event: "export_result",
      page_path: "/finance/conversor-de-moedas",
      tool_name: "Conversor de Moedas",
      export_type: "csv",
    });
    const csv = [header.join(";"), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "conversoes_moedas.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Conversor de Moedas</h1>
        <p className="text-sm text-slate-600">
          Converta valores entre moedas comuns rapidamente.
        </p>
      </header>

      <section className="grid gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-4">
          <div className="flex-1">
            <label className="text-sm text-slate-700">De</label>
            <Select value={from} onValueChange={(v) => setFrom(v)}>
              <SelectTrigger className="mt-1 w-full">
                <SelectValue placeholder={from} />
              </SelectTrigger>
              <SelectContent>
                {COMMON.filter((c) => c !== to).map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <label className="text-sm text-slate-700">Para</label>
            <Select value={to} onValueChange={(v) => setTo(v)}>
              <SelectTrigger className="mt-1 w-full">
                <SelectValue placeholder={to} />
              </SelectTrigger>
              <SelectContent>
                {COMMON.filter((c) => c !== from).map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-36">
            <label className="text-sm text-slate-700">Valor</label>
            <Input
              type="number"
              value={String(amount)}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="mt-1 w-full"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={convert} disabled={loading || from === to}>
              {loading ? "Convertendo..." : "Converter"}
            </Button>
            <Button
              variant="ghost"
              onClick={exportCSV}
              disabled={history.length === 0}
            >
              Exportar CSV
            </Button>
            <Link href="/" className="text-sm text-slate-600 self-center">
              Voltar
            </Link>
          </div>
        </div>

        <div>
          <div className="text-sm text-slate-700">Resultado</div>
          <div className="mt-2 text-xl font-semibold">
            {result === null ? "—" : `${result.toFixed(6)} ${to}`}
          </div>
          {rate !== null && (
            <div className="mt-2 text-sm text-slate-700">
              <div>
                1 {from} = {rate.toFixed(6)} {to}
              </div>
              <div>
                1 {to} = {(1 / rate).toFixed(6)} {from}
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium">Histórico</h2>
            <div className="text-sm text-slate-500">
              {history.length} conversões
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>De → Para</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="text-right">Resultado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((h, i) => (
                <TableRow key={i}>
                  <TableCell>{new Date(h.date).toLocaleString()}</TableCell>
                  <TableCell>
                    {h.from} → {h.to}
                  </TableCell>
                  <TableCell className="text-right">{h.amount}</TableCell>
                  <TableCell className="text-right">
                    {h.result.toFixed(6)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
      <div className="mt-6 text-xs text-slate-600">
        <strong>Disclaimer:</strong> Taxas obtidas de API pública
        (frankfurter.dev). Valores apresentados são estimativas e podem variar;
        não substituem aconselhamento financeiro.
      </div>
    </div>
  );
}
