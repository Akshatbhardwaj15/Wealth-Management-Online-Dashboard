"use client"

import type { AllocationResponse, HoldingsItem, PerformanceResponse, SummaryResponse } from "@/types/portfolio"

const DEFAULT_BASE_URL = ""

function baseUrl() {
  // Reads from NEXT_PUBLIC_API_BASE_URL on the client; falls back to same-origin
  // Example: https://api.yourdomain.com
  const env = typeof window !== "undefined" ? (process?.env?.NEXT_PUBLIC_API_BASE_URL as string | undefined) : undefined
  return env?.trim() || DEFAULT_BASE_URL
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${baseUrl()}${path}`
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    // Avoid caching stale data
    cache: "no-store",
  })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`Request failed (${res.status}): ${text || res.statusText}`)
  }
  return (await res.json()) as T
}

export async function fetchHoldings(): Promise<HoldingsItem[]> {
  return request<HoldingsItem[]>("/api/portfolio/holdings")
}

export async function fetchAllocation(): Promise<AllocationResponse> {
  return request<AllocationResponse>("/api/portfolio/allocation")
}

export async function fetchPerformance(): Promise<PerformanceResponse> {
  return request<PerformanceResponse>("/api/portfolio/performance")
}

export async function fetchSummary(): Promise<SummaryResponse> {
  return request<SummaryResponse>("/api/portfolio/summary")
}
