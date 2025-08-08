import type { HoldingsItem } from "@/types/portfolio"

/**
 * Safely wrap and escape a CSV field.
 * Always wrap in double quotes and escape internal quotes by doubling them.
 */
function csvField(value: unknown): string {
  const s =
    value === null || value === undefined
      ? ""
      : typeof value === "string"
      ? value
      : String(value)
  return `"${s.replace(/"/g, '""')}"`
}

function toFilename(prefix: string) {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, "0")
  const name = `${prefix}-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}.csv`
  return name
}

function downloadCSV(content: string, filename = toFilename("portfolio-holdings")) {
  // Prepend UTF-8 BOM for Excel support
  const BOM = "\uFEFF"
  const blob = new Blob([BOM + content], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Export holdings to CSV with computed fallbacks
 * Columns:
 * Symbol, Name, Sector, Market Cap, Quantity, Avg Price, Current Price, Value, Gain/Loss, Gain/Loss %
 */
export function exportHoldingsToCSV(holdings: HoldingsItem[]) {
  const headers = [
    "Symbol",
    "Name",
    "Sector",
    "Market Cap",
    "Quantity",
    "Avg Price",
    "Current Price",
    "Value",
    "Gain/Loss",
    "Gain/Loss %",
  ]

  const lines: string[] = []
  lines.push(headers.map(csvField).join(","))

  for (const h of holdings) {
    const value = h.value ?? h.currentPrice * h.quantity
    const gainLoss = h.gainLoss ?? (h.currentPrice - h.avgPrice) * h.quantity
    const gainLossPercent =
      h.gainLossPercent ?? (h.avgPrice > 0 ? ((h.currentPrice - h.avgPrice) / h.avgPrice) * 100 : 0)

    const row = [
      h.symbol,
      h.name,
      h.sector ?? "",
      h.marketCap ?? "",
      h.quantity,
      Number(h.avgPrice.toFixed(2)),
      Number(h.currentPrice.toFixed(2)),
      Number(value.toFixed(2)),
      Number(gainLoss.toFixed(2)),
      Number(gainLossPercent.toFixed(2)),
    ]

    lines.push(row.map(csvField).join(","))
  }

  downloadCSV(lines.join("\r\n"))
}
