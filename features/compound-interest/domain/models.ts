// src/features/compound-interest/domain/models.ts
export type InterestRateType = "monthly" | "annual";

export interface SimulationInput {
  initialAmount: number;
  monthlyContribution: number;
  interestRate: number; // percentage (e.g. 1.5 = 1.5%)
  interestRateType: InterestRateType;
  months: number;
}

export interface SimulationRow {
  month: number;
  contribution: number;
  interest: number;
  balance: number;
}

export interface SimulationResult {
  totalInvested: number;
  finalAmount: number;
  rows: SimulationRow[];
}
