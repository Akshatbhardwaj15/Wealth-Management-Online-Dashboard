# WealthManager.online - Portfolio Analytics Dashboard (Frontend)

A responsive, interactive portfolio analytics UI built with Next.js App Router, shadcn/ui, and Recharts. It consumes your backend API:

- GET /api/portfolio/holdings
- GET /api/portfolio/allocation
- GET /api/portfolio/performance
- GET /api/portfolio/summary

## Features

- Overview cards: total value, gain/loss, performance %, holdings count
- Asset allocation: Sector & Market Cap donut charts with tooltips and legends
- Holdings table: sortable columns, search/filter, color-coded P&L, responsive horizontal scroll
- Performance comparison: Portfolio vs Nifty 50 vs Gold time-series chart with hover tooltip and return metrics (1m / 3m / 1y)
- Top performers and insights: Best/Worst, diversification score, risk level
- Loading skeletons, error messages with retry and Demo Mode fallback for local preview
- Light theme with subtle blue accents and accessible semantics

## Getting Started

1. Ensure your backend is reachable from the browser (CORS as needed).
2. If your backend runs on a different origin, set:
   - NEXT_PUBLIC_API_BASE_URL=https://your.api.origin

By default, the frontend requests relative paths (same origin).

### Running Locally

- Use v0’s "Download Code" to install.
- `pnpm dev` / `npm run dev` (if converting to a full Next.js project outside of Next.js).

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- Recharts

## API Contract

- Holdings: Array of items with symbol, name, quantity, avgPrice, currentPrice, sector, marketCap, value, gainLoss, gainLossPercent
- Allocation: { bySector: Record<string, {value, percentage}>, byMarketCap: same }
- Performance: { timeline: [{date, portfolio, nifty50, gold}], returns: { portfolio, nifty50, gold } with 1month, 3months, 1year keys }
- Summary: { totalValue, totalInvested, totalGainLoss, totalGainLossPercent, topPerformer, worstPerformer, diversificationScore, riskLevel }

## Calculations (in UI)

For validation and compatibility, the frontend gracefully computes fields if missing:
- value = currentPrice × quantity
- gainLoss = (currentPrice − avgPrice) × quantity
- gainLossPercent = avgPrice > 0 ? ((currentPrice − avgPrice)/avgPrice) × 100 : 0
- performance% (overview) = totalGainLossPercent from summary; fallback: (totalValue − totalInvested)/totalInvested × 100

## AI Usage

- Model assistance: v0 (Vercel’s AI) for scaffolding components, state management, and chart configuration.
- AI-generated: Component structure, charts setup, table sorting logic, demo data mapping, error/loading UI.
- Hand-written/refined: Business logic validations, props defaults (Next.js requirement), accessibility, formatting utilities, and documentation.
- How AI helped: Accelerated UI iteration, ensured consistency in components, reduced boilerplate for charts and tables, and quickly integrated loading/error states.

## Demo Mode

If the API is unreachable, you’ll see an error alert with:
- Retry
- Use Demo Data (loads embedded sample dataset)

This is for local preview only and should not be used in production.

## Notes

- Visual design emphasizes light theme with subtle blue accents (e.g., badges, highlights) and green/red for gains/losses.
- All charts are responsive; the table horizontally scrolls on small screens for usability.
