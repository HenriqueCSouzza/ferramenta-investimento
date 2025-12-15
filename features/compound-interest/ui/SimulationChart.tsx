// src/features/compound-interest/ui/SimulationChart.tsx

"use client";

import { SimulationResult } from "../domain/models";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SimulationChartProps {
  result: SimulationResult;
}

export default function SimulationChart({ result }: SimulationChartProps) {
  if (!result.rows.length) return null;

  const data = result.rows.map((row) => ({
    month: row.month,
    balance: row.balance,
    interest: row.interest,
  }));

  return (
    <div className="w-full h-80 rounded-md border border-slate-200 bg-white p-4">
      <h3 className="mb-3 text-lg font-semibold text-slate-800">
        Balance Evolution Chart
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />

          <XAxis
            dataKey="month"
            tick={{ fontSize: 12 }}
            label={{
              value: "Month",
              position: "insideBottomRight",
              offset: -5,
              fontSize: 12,
            }}
          />

          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(v) => `R$ ${v.toFixed(0)}`}
          />

          <Tooltip
            formatter={(value: number) => [`R$ ${value.toFixed(2)}`, ""]}
            contentStyle={{
              borderRadius: "6px",
              borderColor: "#e2e8f0",
            }}
          />

          <Line
            type="monotone"
            dataKey="balance"
            stroke="#059669" // emerald-600
            strokeWidth={3}
            dot={false}
            name="Balance"
          />

          <Line
            type="monotone"
            dataKey="interest"
            stroke="#6366f1" // indigo-500
            strokeWidth={2}
            dot={false}
            name="Monthly Interest"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
