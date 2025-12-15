// src/features/compound-interest/domain/csv-export.ts
import { SimulationResult } from "./models";

export function buildSimulationCsv(result: SimulationResult): string {
  const header = "Month,Contribution,Interest,Balance\n";

  const rows = result.rows
    .map((row) =>
      [
        row.month,
        row.contribution.toFixed(2),
        row.interest.toFixed(2),
        row.balance.toFixed(2),
      ].join(",")
    )
    .join("\n");

  return header + rows;
}
