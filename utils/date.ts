const fmt = new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" });

export function formatDate(date: Date) {
  return fmt.format(date);
}
