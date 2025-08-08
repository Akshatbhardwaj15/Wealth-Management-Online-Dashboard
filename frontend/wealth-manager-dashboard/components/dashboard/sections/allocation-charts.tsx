"use client"

import { Pie, PieChart, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { AllocationResponse } from "@/types/portfolio"

const sectorPalette = [
  "#3b82f6", // blue-500
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#ef4444", // red-500
  "#8b5cf6", // violet-500
  "#14b8a6", // teal-500
  "#eab308", // yellow-500
]

const mcapPalette = ["#3b82f6", "#60a5fa", "#93c5fd"]

export default function AllocationCharts({
  allocation,
}: {
  allocation?: AllocationResponse
}) {
  const sectorData =
    Object.entries(allocation?.bySector ?? {}).map(([name, v]) => ({
      name,
      value: v.value,
      percentage: v.percentage,
    })) ?? []

  const mcapData =
    Object.entries(allocation?.byMarketCap ?? {}).map(([name, v]) => ({
      name,
      value: v.value,
      percentage: v.percentage,
    })) ?? []

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sector Distribution</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <ChartContainer
            config={{
              value: { label: "Value", color: "hsl(var(--chart-1))" },
            }}
            className="w-full h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
                <Legend verticalAlign="bottom" height={36} />
                <Pie
                  data={sectorData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={2}
                >
                  {sectorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={sectorPalette[index % sectorPalette.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            {sectorData.map((s, i) => (
              <div key={s.name} className="flex items-center gap-2 rounded-md border p-2">
                <span
                  className="inline-block size-2 rounded-sm"
                  style={{ backgroundColor: sectorPalette[i % sectorPalette.length] }}
                  aria-hidden="true"
                />
                <span className="truncate">{s.name}</span>
                <span className="ml-auto text-muted-foreground">{s.percentage}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Market Cap Distribution</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <ChartContainer
            config={{
              value: { label: "Value", color: "hsl(var(--chart-2))" },
            }}
            className="w-full h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
                <Legend verticalAlign="bottom" height={36} />
                <Pie
                  data={mcapData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={3}
                >
                  {mcapData.map((entry, index) => (
                    <Cell key={`cell-mcap-${index}`} fill={mcapPalette[index % mcapPalette.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
            {mcapData.map((s, i) => (
              <div key={s.name} className="flex items-center gap-2 rounded-md border p-2">
                <span
                  className="inline-block size-2 rounded-sm"
                  style={{ backgroundColor: mcapPalette[i % mcapPalette.length] }}
                  aria-hidden="true"
                />
                <span className="truncate">{s.name}</span>
                <span className="ml-auto text-muted-foreground">{s.percentage}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
