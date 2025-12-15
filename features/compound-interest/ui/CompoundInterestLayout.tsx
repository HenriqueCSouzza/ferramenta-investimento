// src/features/compound-interest/ui/CompoundInterestLayout.tsx
import CompoundInterestForm from "./CompoundInterestForm";

export default function CompoundInterestLayout() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
          Simulador de Juros Compostos
        </h1>
        <p className="mt-3 text-lg text-slate-600 max-w-2xl">
          Simule o crescimento dos seus investimentos ao longo do tempo. Ajuste
          aportes, taxa e período para explorar diferentes cenários.
        </p>
      </header>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <CompoundInterestForm />
      </div>
      <div className="mt-6 text-xs text-slate-600">
        <strong>Disclaimer:</strong> Este simulador fornece apenas estimativas e
        informações educativas; não substitui aconselhamento financeiro ou
        fiscal profissional.
      </div>
    </main>
  );
}
