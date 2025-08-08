"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { PerformanceResponse } from "@/types/portfolio"

export default function PerformanceChart({
  performance,
}: {
  performance?: PerformanceResponse
}) {
  const data = performance?.timeline ?? []

  return (
    <ChartContainer
      config={{
        portfolio: { label: "Portfolio", color: "hsl(var(--chart-1))" },
        nifty50: { label: "Nifty 50", color: "hsl(var(--chart-2))" },
        gold: { label: "Gold", color: "hsl(var(--chart-3))" },
      }}
      className="w-full h-[320px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="portfolio"
            stroke="var(--color-portfolio)"
            strokeWidth={2}
            dot={false}
            name="Portfolio"
          />
          <Line type="monotone" dataKey="nifty50" stroke="var(--color-nifty50)" strokeWidth={2} dot={false} name="Nifty 50" />
          <Line type="monotone" dataKey="gold" stroke="var(--color-gold)" strokeWidth={2} dot={false} name="Gold" />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
