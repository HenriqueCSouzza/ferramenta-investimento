"use client";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  return (
    <header className="w-full border-b bg-white/60 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold">
          Ferramentas de Investimento
        </Link>

        <nav>
          <ul className="flex gap-4 items-center">
            <li>
              <Link
                href="/"
                className="text-sm text-slate-700 hover:text-slate-900"
              >
                Início
              </Link>
            </li>

            <li>
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex items-center rounded px-3 py-1 text-sm border border-slate-200 bg-white text-slate-700 hover:bg-slate-50">
                  Ferramentas
                </DropdownMenuTrigger>
                <DropdownMenuContent sideOffset={8} className="w-56">
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Simuladores</DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuGroup>
                          <DropdownMenuItem asChild>
                            <Link href="/simulador-carteira">
                              Simulador de Carteira
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/simulador-aportes-regulares">
                              Simulador de Aportes
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/simulador-juros-simples">
                              Simulador de Juros Simples
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/simulador-juros-compostos">
                              Simulador de Juros Compostos
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/simulador-dividendos">
                              Simulador de Dividendos
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/simulador-fiis">
                              Simulador de FIIs
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/simulador-renda-mensal-desejada">
                              Simulador Renda Mensal
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/simulador-ipva">Simulador IPVA</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/simulador-imposto-de-renda">
                              Simulador Imposto de Renda (PF)
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>

                  <DropdownMenuSeparator />

                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      Calculadoras & Utilitários
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuGroup>
                          <DropdownMenuItem asChild>
                            <Link href="/calculadora-reserva-emergencia">
                              Calculadora Reserva de Emergência
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/conversor-de-moedas">
                              Conversor de Moedas
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/conversor-taxas">
                              Conversor de Taxas
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/calculadora-rendimento-liquido">
                              Rendimento Líquido
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/calculadora-inflacao-acumulada">
                              Inflação Acumulada
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/calculadora-cet">Calculadora CET</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/calculadora-regra-72">
                              Regra dos 72
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/inflacao-vs-rendimento">
                              Inflação x Rendimento
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/#features">Ver funcionalidades</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
