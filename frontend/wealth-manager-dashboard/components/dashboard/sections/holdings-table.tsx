"use client"

import { useMemo, useState } from "react"
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils-format"
import type { HoldingsItem } from "@/types/portfolio"

type SortKey = "symbol" | "name" | "sector" | "value" | "gainLoss" | "gainLossPercent" | "currentPrice"
type SortDir = "asc" | "desc"

export default function HoldingsTable({ data = [] as HoldingsItem[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("value")
  const [sortDir, setSortDir] = useState<SortDir>("desc")

  const sorted = useMemo(() => {
    const arr = [...data]
    arr.sort((a, b) => {
      const aVal = getValue(a, sortKey)
      const bVal = getValue(b, sortKey)
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1
      return 0
    })
    return arr
  }, [data, sortKey, sortDir])

  function setSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir("desc")
    }
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <HeadCell label="Symbol" onClick={() => setSort("symbol")} active={sortKey === "symbol"} dir={sortDir} />
                <HeadCell label="Name" onClick={() => setSort("name")} active={sortKey === "name"} dir={sortDir} />
                <HeadCell label="Sector" onClick={() => setSort("sector")} active={sortKey === "sector"} dir={sortDir} />
                <HeadCell
                  label="Qty"
                  onClick={() => setSort("name")} // keep as secondary non-sorting or tie to name
                  active={false}
                  dir={sortDir}
                  className="text-right"
                />
                <HeadCell
                  label="Avg Price"
                  onClick={() => setSort("currentPrice")}
                  active={sortKey === "currentPrice"}
                  dir={sortDir}
                  className="text-right"
                />
                <HeadCell
                  label="Current"
                  onClick={() => setSort("currentPrice")}
                  active={sortKey === "currentPrice"}
                  dir={sortDir}
                  className="text-right"
                />
                <HeadCell
                  label="Value"
                  onClick={() => setSort("value")}
                  active={sortKey === "value"}
                  dir={sortDir}
                  className="text-right"
                />
                <HeadCell
                  label="G/L"
                  onClick={() => setSort("gainLoss")}
                  active={sortKey === "gainLoss"}
                  dir={sortDir}
                  className="text-right"
                />
                <HeadCell
                  label="G/L %"
                  onClick={() => setSort("gainLossPercent")}
                  active={sortKey === "gainLossPercent"}
                  dir={sortDir}
                  className="text-right"
                />
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((h) => {
                const value = h.value ?? h.currentPrice * h.quantity
                const gainLoss = h.gainLoss ?? (h.currentPrice - h.avgPrice) * h.quantity
                const glPct =
                  h.gainLossPercent ?? (h.avgPrice > 0 ? ((h.currentPrice - h.avgPrice) / h.avgPrice) * 100 : 0)
                const gain = gainLoss >= 0

                return (
                  <TableRow key={h.symbol}>
                    <TableCell className="font-medium">{h.symbol}</TableCell>
                    <TableCell className="min-w-[200px]">{h.name}</TableCell>
                    <TableCell>{h.sector}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatNumber(h.quantity)}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatCurrency(h.avgPrice)}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatCurrency(h.currentPrice)}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatCurrency(value)}</TableCell>
                    <TableCell className={`text-right tabular-nums ${gain ? "text-emerald-600" : "text-rose-600"}`}>
                      {gain ? "+" : "-"}
                      {formatCurrency(Math.abs(gainLoss))}
                    </TableCell>
                    <TableCell className={`text-right tabular-nums ${gain ? "text-emerald-600" : "text-rose-600"}`}>
                      {gain ? "+" : ""}
                      {formatPercent(glPct)}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

function HeadCell({
  label = "Col",
  onClick = () => {},
  active = false,
  dir = "desc",
  className = "",
}: {
  label?: string
  onClick?: () => void
  active?: boolean
  dir?: SortDir
  className?: string
}) {
  return (
    <TableHead className={`whitespace-nowrap ${className}`}>
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center gap-1 text-left hover:text-blue-600"
        title={`Sort by ${label}`}
      >
        <span>{label}</span>
        {active ? (
          dir === "asc" ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />
        ) : (
          <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </button>
    </TableHead>
  )
}

function getValue(h: HoldingsItem, key: SortKey): string | number {
  switch (key) {
    case "symbol":
      return h.symbol
    case "name":
      return h.name
    case "sector":
      return h.sector ?? ""
    case "value":
      return h.value ?? h.currentPrice * h.quantity
    case "gainLoss":
      return h.gainLoss ?? (h.currentPrice - h.avgPrice) * h.quantity
    case "gainLossPercent":
      return h.gainLossPercent ?? (h.avgPrice > 0 ? ((h.currentPrice - h.avgPrice) / h.avgPrice) * 100 : 0)
    case "currentPrice":
      return h.currentPrice
    default:
      return 0
  }
}
