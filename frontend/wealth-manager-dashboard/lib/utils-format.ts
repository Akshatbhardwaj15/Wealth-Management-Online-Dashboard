export function formatCurrency(n: number, currency: string = "INR") {
  try {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 2 }).format(n)
  } catch {
    return `₹${formatNumber(n)}`
  }
}

export function formatSignedCurrency(n: number) {
  const sign = n >= 0 ? "+" : "-"
  return `${sign}${formatCurrency(Math.abs(n))}`
}

export function formatNumber(n: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(n)
}

export function formatPercent(n: number) {
  return `${n.toFixed(1)}%`
}
