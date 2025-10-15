export function formatCurrency(valueInCents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valueInCents / 100);
}

export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[^\d,]/g, "");
  const normalized = cleaned.replace(",", ".");
  const floatValue = parseFloat(normalized);

  return Math.round(floatValue * 100);
}
