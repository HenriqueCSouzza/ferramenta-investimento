"use client";

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { trackNavClick } from "@/lib/analytics";

export default function Header() {
  return (
    <header className="w-full border-b bg-white/60 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="text-lg font-semibold"
          onClick={() =>
            trackNavClick({
              nav_item: "brand_home",
              nav_label: "Ferramentas de Investimento",
              nav_href: "/",
            })
          }
        >
          Ferramentas de Investimento
        </Link>

        <nav>
          <ul className="flex gap-4 items-center">
            <li>
              <Link
                href="/"
                className="text-sm text-slate-700 hover:text-slate-900"
                onClick={() =>
                  trackNavClick({
                    nav_item: "inicio",
                    nav_label: "Início",
                    nav_href: "/",
                  })
                }
              >
                Início
              </Link>
            </li>
            <li>
              <Link
                href="/blog"
                className="text-sm text-slate-700 hover:text-slate-900"
                onClick={() =>
                  trackNavClick({
                    nav_item: "blog",
                    nav_label: "Blog",
                    nav_href: "/blog",
                  })
                }
              >
                Blog
              </Link>
            </li>

            <li>
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="inline-flex items-center rounded px-3 py-1 text-sm border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  onClick={() =>
                    trackNavClick({
                      nav_item: "menu_ferramentas_open",
                      nav_label: "Ferramentas",
                    })
                  }
                >
                  Ferramentas
                </DropdownMenuTrigger>

                <DropdownMenuContent sideOffset={8} className="w-56">
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Simuladores</DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuGroup>
                          <DropdownMenuItem asChild>
                            <Link
                              href="/simulador-carteira"
                              onClick={() =>
                                trackNavClick({
                                  nav_item: "simulador_carteira",
                                  nav_label: "Simulador de Carteira",
                                  nav_href: "/simulador-carteira",
                                })
                              }
                            >
                              Simulador de Carteira
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuItem asChild>
                            <Link
                              href="/simulador-aportes-regulares"
                              onClick={() =>
                                trackNavClick({
                                  nav_item: "simulador_aportes",
                                  nav_label: "Simulador de Aportes",
                                  nav_href: "/simulador-aportes-regulares",
                                })
                              }
                            >
                              Simulador de Aportes
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuItem asChild>
                            <Link
                              href="/simulador-juros-simples"
                              onClick={() =>
                                trackNavClick({
                                  nav_item: "simulador_juros_simples",
                                  nav_label: "Simulador de Juros Simples",
                                  nav_href: "/simulador-juros-simples",
                                })
                              }
                            >
                              Simulador de Juros Simples
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuItem asChild>
                            <Link
                              href="/simulador-juros-compostos"
                              onClick={() =>
                                trackNavClick({
                                  nav_item: "simulador_juros_compostos",
                                  nav_label: "Simulador de Juros Compostos",
                                  nav_href: "/simulador-juros-compostos",
                                })
                              }
                            >
                              Simulador de Juros Compostos
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuItem asChild>
                            <Link
                              href="/simulador-dividendos"
                              onClick={() =>
                                trackNavClick({
                                  nav_item: "simulador_dividendos",
                                  nav_label: "Simulador de Dividendos",
                                  nav_href: "/simulador-dividendos",
                                })
                              }
                            >
                              Simulador de Dividendos
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuItem asChild>
                            <Link
                              href="/simulador-fiis"
                              onClick={() =>
                                trackNavClick({
                                  nav_item: "simulador_fiis",
                                  nav_label: "Simulador de FIIs",
                                  nav_href: "/simulador-fiis",
                                })
                              }
                            >
                              Simulador de FIIs
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuItem asChild>
                            <Link
                              href="/simulador-renda-mensal-desejada"
                              onClick={() =>
                                trackNavClick({
                                  nav_item: "simulador_renda_mensal",
                                  nav_label: "Simulador Renda Mensal",
                                  nav_href: "/simulador-renda-mensal-desejada",
                                })
                              }
                            >
                              Simulador Renda Mensal
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuItem asChild>
                            <Link
                              href="/simulador-ipva"
                              onClick={() =>
                                trackNavClick({
                                  nav_item: "simulador_ipva",
                                  nav_label: "Simulador IPVA",
                                  nav_href: "/simulador-ipva",
                                })
                              }
                            >
                              Simulador IPVA
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuItem asChild>
                            <Link
                              href="/simulador-imposto-de-renda"
                              onClick={() =>
                                trackNavClick({
                                  nav_item: "simulador_irpf",
                                  nav_label: "Simulador Imposto de Renda (PF)",
                                  nav_href: "/simulador-imposto-de-renda",
                                })
                              }
                            >
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
                            <Link
                              href="/calculadora-reserva-emergencia"
                              onClick={() =>
                                trackNavClick({
                                  nav_item: "calc_reserva_emergencia",
                                  nav_label:
                                    "Calculadora Reserva de Emergência",
                                  nav_href: "/calculadora-reserva-emergencia",
                                })
                              }
                            >
                              Calculadora Reserva de Emergência
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuItem asChild>
                            <Link
                              href="/conversor-de-moedas"
                              onClick={() =>
                                trackNavClick({
                                  nav_item: "conversor_moedas",
                                  nav_label: "Conversor de Moedas",
                                  nav_href: "/conversor-de-moedas",
                                })
                              }
                            >
                              Conversor de Moedas
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuItem asChild>
                            <Link
                              href="/conversor-taxas"
                              onClick={() =>
                                trackNavClick({
                                  nav_item: "conversor_taxas",
                                  nav_label: "Conversor de Taxas",
                                  nav_href: "/conversor-taxas",
                                })
                              }
                            >
                              Conversor de Taxas
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuItem asChild>
                            <Link
                              href="/calculadora-rendimento-liquido"
                              onClick={() =>
                                trackNavClick({
                                  nav_item: "calc_rendimento_liquido",
                                  nav_label: "Rendimento Líquido",
                                  nav_href: "/calculadora-rendimento-liquido",
                                })
                              }
                            >
                              Rendimento Líquido
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuItem asChild>
                            <Link
                              href="/calculadora-inflacao-acumulada"
                              onClick={() =>
                                trackNavClick({
                                  nav_item: "calc_inflacao_acumulada",
                                  nav_label: "Inflação Acumulada",
                                  nav_href: "/calculadora-inflacao-acumulada",
                                })
                              }
                            >
                              Inflação Acumulada
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuItem asChild>
                            <Link
                              href="/calculadora-cet"
                              onClick={() =>
                                trackNavClick({
                                  nav_item: "calc_cet",
                                  nav_label: "Calculadora CET",
                                  nav_href: "/calculadora-cet",
                                })
                              }
                            >
                              Calculadora CET
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuItem asChild>
                            <Link
                              href="/calculadora-regra-72"
                              onClick={() =>
                                trackNavClick({
                                  nav_item: "calc_regra_72",
                                  nav_label: "Regra dos 72",
                                  nav_href: "/calculadora-regra-72",
                                })
                              }
                            >
                              Regra dos 72
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuItem asChild>
                            <Link
                              href="/inflacao-vs-rendimento"
                              onClick={() =>
                                trackNavClick({
                                  nav_item: "inflacao_vs_rendimento",
                                  nav_label: "Inflação x Rendimento",
                                  nav_href: "/inflacao-vs-rendimento",
                                })
                              }
                            >
                              Inflação x Rendimento
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link
                      href="/#features"
                      onClick={() =>
                        trackNavClick({
                          nav_item: "ver_funcionalidades",
                          nav_label: "Ver funcionalidades",
                          nav_href: "/#features",
                        })
                      }
                    >
                      Ver funcionalidades
                    </Link>
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
