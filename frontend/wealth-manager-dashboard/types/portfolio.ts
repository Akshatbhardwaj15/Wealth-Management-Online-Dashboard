export type HoldingsItem = {
  symbol: string
  name: string
  quantity: number
  avgPrice: number
  currentPrice: number
  sector?: string
  marketCap?: "Large" | "Mid" | "Small" | string
  value?: number
  gainLoss?: number
  gainLossPercent?: number
}

export type AllocationResponse = {
  bySector: Record<string, { value: number; percentage: number }>
  byMarketCap: Record<string, { value: number; percentage: number }>
}

export type PerformanceResponse = {
  timeline: Array<{
    date: string
    portfolio: number
    nifty50: number
    gold: number
  }>
  returns: {
    portfolio: { "1month": number; "3months": number; "1year": number }
    nifty50: { "1month": number; "3months": number; "1year": number }
    gold: { "1month": number; "3months": number; "1year": number }
  }
}

export type SummaryResponse = {
  totalValue: number
  totalInvested: number
  totalGainLoss: number
  totalGainLossPercent: number
  topPerformer: { symbol: string; name: string; gainPercent: number }
  worstPerformer: { symbol: string; name: string; gainPercent: number }
  diversificationScore: number
  riskLevel: "Low" | "Moderate" | "High" | string
}
