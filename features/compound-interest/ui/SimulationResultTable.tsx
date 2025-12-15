// src/features/compound-interest/ui/SimulationResultTable.tsx
import { SimulationResult } from "../domain/models";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";

interface SimulationResultTableProps {
  result: SimulationResult;
}

export default function SimulationResultTable({
  result,
}: SimulationResultTableProps) {
  if (!result.rows.length) {
    return null;
  }

  return (
    <div className="max-h-96 overflow-auto rounded-md border border-slate-200">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead>Month</TableHead>
            <TableHead>Contribution (R$)</TableHead>
            <TableHead>Interest (R$)</TableHead>
            <TableHead>Balance (R$)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {result.rows.map((row) => (
            <TableRow key={row.month}>
              <TableCell>{row.month}</TableCell>
              <TableCell>{row.contribution.toFixed(2)}</TableCell>
              <TableCell>{row.interest.toFixed(2)}</TableCell>
              <TableCell>{row.balance.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
