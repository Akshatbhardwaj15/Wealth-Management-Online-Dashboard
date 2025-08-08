"use client"

import { useEffect, useMemo, useState } from "react"
import { AlertCircle, BarChart3, LineChart, PieChart, RefreshCcw, FileDown } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { fetchAllocation, fetchHoldings, fetchPerformance, fetchSummary } from "@/lib/api"
import { formatCurrency, formatPercent, formatSignedCurrency } from "@/lib/utils-format"
import type { AllocationResponse, HoldingsItem, PerformanceResponse, SummaryResponse } from "@/types/portfolio"

import AllocationCharts from "./sections/allocation-charts"
import PerformanceChart from "./sections/performance-chart"
import HoldingsTable from "./sections/holdings-table"
import TopPerformers from "./sections/top-performers"
import { loadDemoData } from "@/lib/demo-data"
import { exportHoldingsToCSV } from "@/lib/export-csv"

type LoadState = "idle" | "loading" | "success" | "error"

export default function DashboardPage() {
  const [loadState, setLoadState] = useState<LoadState>("idle")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const [holdings, setHoldings] = useState<HoldingsItem[]>([])
  const [allocation, setAllocation] = useState<AllocationResponse | null>(null)
  const [performance, setPerformance] = useState<PerformanceResponse | null>(null)
  const [summary, setSummary] = useState<SummaryResponse | null>(null)

  const [query, setQuery] = useState("")

  const load = async () => {
    setLoadState("loading")
    setErrorMsg(null)
    try {
      const [h, a, p, s] = await Promise.all([
        fetchHoldings(),
        fetchAllocation(),
        fetchPerformance(),
        fetchSummary(),
      ])
      setHoldings(h)
      setAllocation(a)
      setPerformance(p)
      setSummary(s)
      setLoadState("success")
    } catch (err: any) {
      setErrorMsg(err?.message ?? "Failed to load data.")
      setLoadState("error")
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const filteredHoldings = useMemo(() => {
    if (!query) return holdings
    const q = query.toLowerCase()
    return holdings.filter(
      (h) =>
        h.symbol.toLowerCase().includes(q) ||
        h.name.toLowerCase().includes(q) ||
        (h.sector ?? "").toLowerCase().includes(q)
    )
  }, [holdings, query])

  const totalHoldings = holdings.length
  const totalValue = summary?.totalValue ?? holdings.reduce((sum, h) => sum + (h.value ?? h.currentPrice * h.quantity), 0)
  const totalInvested =
    summary?.totalInvested ??
    holdings.reduce((sum, h) => sum + h.avgPrice * h.quantity, 0)
  const totalGainLoss = summary?.totalGainLoss ?? (totalValue - totalInvested)
  const perfPct =
    summary?.totalGainLossPercent ?? (totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0)

  const isLoading = loadState === "loading" || loadState === "idle"

  return (
    <div className="min-h-[100svh] bg-white">
      <header className="sticky top-0 z-10 bg-white/75 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg p-2 bg-blue-50 text-blue-600">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">WealthManager.online</h1>
              <p className="text-sm text-muted-foreground">Portfolio Analytics Dashboard</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={load} className="gap-2">
                <RefreshCcw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-4 md:p-6 space-y-6">
        {isLoading ? (
          <LoadingSkeleton />
        ) : loadState === "error" ? (
          <ErrorState
            message={errorMsg ?? "Something went wrong."}
            onRetry={load}
            onUseDemo={() => {
              const { holdings: h, allocation: a, performance: p, summary: s } = loadDemoData()
              setHoldings(h)
              setAllocation(a)
              setPerformance(p)
              setSummary(s)
              setLoadState("success")
            }}
          />
        ) : (
          <>
            {/* Overview */}
            <section aria-labelledby="overview-title" className="space-y-3">
              <div className="flex items-center gap-2">
                <h2 id="overview-title" className="text-lg font-semibold">Portfolio Overview</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Total Portfolio Value</CardDescription>
                    <CardTitle className="text-2xl">{formatCurrency(totalValue)}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground">
                    Live valuation of your holdings.
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Total Gain/Loss</CardDescription>
                    <CardTitle className={`text-2xl ${totalGainLoss >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                      {formatSignedCurrency(totalGainLoss)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground">
                    Since initial investment.
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Performance %</CardDescription>
                    <CardTitle className={`text-2xl ${perfPct >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                      {formatPercent(perfPct)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground">
                    Relative to invested amount.
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Number of Holdings</CardDescription>
                    <CardTitle className="text-2xl">{totalHoldings}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground">
                    Stocks in your portfolio.
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Allocation */}
            <section aria-labelledby="allocation-title" className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="rounded-md p-1.5 bg-blue-50 text-blue-600">
                  <PieChart className="h-4 w-4" />
                </div>
                <h2 id="allocation-title" className="text-lg font-semibold">Asset Allocation</h2>
              </div>
              <AllocationCharts allocation={allocation ?? undefined} />
            </section>

            {/* Performance */}
            <section aria-labelledby="performance-title" className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="rounded-md p-1.5 bg-blue-50 text-blue-600">
                  <LineChart className="h-4 w-4" />
                </div>
                <h2 id="performance-title" className="text-lg font-semibold">Performance Comparison</h2>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Portfolio vs Nifty 50 vs Gold</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <PerformanceChart performance={performance ?? undefined} />

                  <Separator />
                  <div className="grid gap-4 sm:grid-cols-3">
                    <ReturnCard
                      title="Portfolio"
                      values={{
                        "1 month": performance?.returns?.portfolio?.["1month"] ?? 0,
                        "3 months": performance?.returns?.portfolio?.["3months"] ?? 0,
                        "1 year": performance?.returns?.portfolio?.["1year"] ?? 0,
                      }}
                    />
                    <ReturnCard
                      title="Nifty 50"
                      values={{
                        "1 month": performance?.returns?.nifty50?.["1month"] ?? 0,
                        "3 months": performance?.returns?.nifty50?.["3months"] ?? 0,
                        "1 year": performance?.returns?.nifty50?.["1year"] ?? 0,
                      }}
                    />
                    <ReturnCard
                      title="Gold"
                      values={{
                        "1 month": performance?.returns?.gold?.["1month"] ?? 0,
                        "3 months": performance?.returns?.gold?.["3months"] ?? 0,
                        "1 year": performance?.returns?.gold?.["1year"] ?? 0,
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Top Performers */}
            <section aria-labelledby="top-performers-title" className="space-y-3">
              <h2 id="top-performers-title" className="text-lg font-semibold">Top Performers & Insights</h2>
              <TopPerformers summary={summary ?? undefined} />
            </section>

            {/* Holdings */}
            <section aria-labelledby="holdings-title" className="space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 id="holdings-title" className="text-lg font-semibold">Holdings</h2>
                <div className="ml-auto w-full sm:w-auto flex items-center gap-2">
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by symbol, name, or sector"
                    aria-label="Search holdings"
                    className="w-full sm:w-72"
                  />
                  <Button
                    variant="outline"
                    className="whitespace-nowrap gap-2"
                    onClick={() => exportHoldingsToCSV(filteredHoldings)}
                    disabled={filteredHoldings.length === 0}
                    aria-disabled={filteredHoldings.length === 0}
                    title={filteredHoldings.length === 0 ? "No rows to export" : "Export holdings as CSV"}
                  >
                    <FileDown className="h-4 w-4 text-blue-600" />
                    Export CSV
                  </Button>
                </div>
              </div>
              <HoldingsTable data={filteredHoldings} />
            </section>
          </>
        )}
      </main>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-24 mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-40" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {[0, 1].map((i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-4 w-40 mb-4" />
            <Skeleton className="h-[280px] w-full" />
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <Skeleton className="h-4 w-40 mb-4" />
        <Skeleton className="h-[320px] w-full" />
      </Card>

      <Card className="p-6">
        <Skeleton className="h-4 w-40 mb-4" />
        <Skeleton className="h-[400px] w-full" />
      </Card>
    </div>
  )
}

function ErrorState({
  message = "Failed to load data.",
  onRetry = () => {},
  onUseDemo = () => {},
}: {
  message?: string
  onRetry?: () => void
  onUseDemo?: () => void
}) {
  return (
    <div className="max-w-3xl mx-auto">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Unable to load portfolio</AlertTitle>
        <AlertDescription className="mt-2">
          {message}
          <div className="mt-4 flex gap-2">
            <Button variant="outline" onClick={onRetry}>
              Retry
            </Button>
            <Button onClick={onUseDemo}>Use Demo Data</Button>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            If your API is hosted on a different origin, set NEXT_PUBLIC_API_BASE_URL accordingly and reload.
          </p>
        </AlertDescription>
      </Alert>
    </div>
  )
}

function ReturnCard({
  title = "Title",
  values = { "1 month": 0, "3 months": 0, "1 year": 0 },
}: {
  title?: string
  values?: Record<string, number>
}) {
  return (
    <div className="rounded-lg border p-4">
      <div className="text-sm font-medium">{title}</div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
        {Object.entries(values).map(([k, v]) => (
          <div key={k} className="flex flex-col rounded-md bg-blue-50/40 p-2">
            <span className="text-xs text-muted-foreground">{k}</span>
            <span className={`${v >= 0 ? "text-emerald-600" : "text-rose-600"} font-medium`}>
              {formatPercent(v)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
