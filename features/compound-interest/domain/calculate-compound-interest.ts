// src/features/compound-interest/domain/calculate-compound-interest.ts
import { SimulationInput, SimulationResult, SimulationRow } from "./models";

function toMonthlyRate(
  interestRate: number,
  type: "monthly" | "annual"
): number {
  const rate = interestRate / 100;

  if (type === "monthly") {
    return rate;
  }

  // annual → monthly: (1 + i_a)^(1/12) - 1
  return Math.pow(1 + rate, 1 / 12) - 1;
}

export function calculateCompoundInterest(
  input: SimulationInput
): SimulationResult {
  const {
    initialAmount,
    monthlyContribution,
    interestRate,
    interestRateType,
    months,
  } = input;

  if (months <= 0) {
    return {
      totalInvested: 0,
      finalAmount: initialAmount,
      rows: [],
    };
  }

  const monthlyRate = toMonthlyRate(interestRate, interestRateType);

  let balance = initialAmount;
  const rows: SimulationRow[] = [];

  for (let month = 1; month <= months; month++) {
    const interest = balance * monthlyRate;
    balance = balance + interest + monthlyContribution;

    rows.push({
      month,
      contribution: monthlyContribution,
      interest: Number(interest.toFixed(2)),
      balance: Number(balance.toFixed(2)),
    });
  }

  const totalInvested = initialAmount + monthlyContribution * months;

  return {
    totalInvested: Number(totalInvested.toFixed(2)),
    finalAmount: Number(balance.toFixed(2)),
    rows,
  };
}
