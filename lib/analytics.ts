type AnalyticsEvent = {
  event: string;
  [key: string]: string | number | boolean;
};
export type NavClickEvent = {
  event: "nav_click";
  nav_location: "header";
  nav_item: string; // ex: "inicio", "simulador_juros_compostos"
  nav_label?: string; // ex: "Simulador de Juros Compostos"
  nav_href?: string; // ex: "/simulador-juros-compostos"
};

export function track(event: AnalyticsEvent) {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).dataLayer.push(event);
}

export function trackNavClick(
  payload: Omit<NavClickEvent, "event" | "nav_location">
) {
  track({
    event: "nav_click",
    nav_location: "header",
    ...payload,
  } satisfies NavClickEvent);
}
