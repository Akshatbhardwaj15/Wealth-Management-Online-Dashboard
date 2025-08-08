"use client"

import { ArrowDownRight, ArrowUpRight, Shield } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { SummaryResponse } from "@/types/portfolio"

export default function TopPerformers({
  summary,
}: {
  summary?: SummaryResponse | null
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Best Performer</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-3">
          <div className="rounded-md p-2 bg-emerald-50 text-emerald-600">
            <ArrowUpRight className="h-5 w-5" />
          </div>
          <div>
            <div className="font-medium">{summary?.topPerformer?.name ?? "—"}</div>
            <div className="text-sm text-muted-foreground">{summary?.topPerformer?.symbol ?? ""}</div>
          </div>
          <div className="ml-auto text-emerald-600 font-semibold">
            {summary?.topPerformer ? `${summary.topPerformer.gainPercent.toFixed(1)}%` : "—"}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Worst Performer</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-3">
          <div className="rounded-md p-2 bg-rose-50 text-rose-600">
            <ArrowDownRight className="h-5 w-5" />
          </div>
          <div>
            <div className="font-medium">{summary?.worstPerformer?.name ?? "—"}</div>
            <div className="text-sm text-muted-foreground">{summary?.worstPerformer?.symbol ?? ""}</div>
          </div>
          <div className="ml-auto text-rose-600 font-semibold">
            {summary?.worstPerformer ? `${summary.worstPerformer.gainPercent.toFixed(1)}%` : "—"}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Risk & Diversification</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-3">
          <div className="rounded-md p-2 bg-blue-50 text-blue-600">
            <Shield className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Diversification Score</div>
            <div className="font-semibold">{summary?.diversificationScore?.toFixed(1) ?? "—"} / 10</div>
          </div>
          <div className="ml-auto text-right">
            <div className="text-sm text-muted-foreground">Risk Level</div>
            <div className="font-semibold">{summary?.riskLevel ?? "—"}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
