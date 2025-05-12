import { NextResponse } from "next/server"
import axios from "axios"

// Define types
type BaseData = {
  date: string
  price_usd: number
  market_cap: number
  total_volume: number
}

type MetricRecord = BaseData & {
  z_score_price: number | null
  z_score_market_cap: number | null
  z_score_volume: number | null
  anomaly_price: boolean
  anomaly_market_cap: boolean
  anomaly_volume: boolean
}

// Helper function to calculate mean
function mean(values: number[]): number {
  return values.reduce((sum, val) => sum + val, 0) / values.length
}

// Helper function to calculate standard deviation
function std(values: number[]): number {
  const avg = mean(values)
  const squareDiffs = values.map((value) => Math.pow(value - avg, 2))
  const avgSquareDiff = mean(squareDiffs)
  return Math.sqrt(avgSquareDiff)
}

async function fetchMarketData(coinId: string, threshold = 1.5): Promise<MetricRecord[]> {
  const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`
  const { data } = await axios.get(url, {
    params: { vs_currency: "usd", days: "90", interval: "daily" },
  })

  const baseData: BaseData[] = data.prices.map((_: any, i: number) => {
    const [timestamp] = data.prices[i]
    return {
      date: new Date(timestamp).toISOString().slice(0, 10),
      price_usd: data.prices[i][1],
      market_cap: data.market_caps[i][1],
      total_volume: data.total_volumes[i][1],
    }
  })

  return baseData.map((record, i): MetricRecord => {
    const window = baseData.slice(Math.max(0, i - 6), i + 1)

    const calcZ = (values: number[], current: number): number | null => {
      const avg = mean(values)
      const deviation = std(values)
      return typeof avg === "number" && typeof deviation === "number" && deviation !== 0
        ? (current - avg) / deviation
        : null
    }

    const z_price = calcZ(
      window.map((r: BaseData) => r.price_usd),
      record.price_usd,
    )
    const z_cap = calcZ(
      window.map((r: BaseData) => r.market_cap),
      record.market_cap,
    )
    const z_vol = calcZ(
      window.map((r: BaseData) => r.total_volume),
      record.total_volume,
    )

    return {
      ...record,
      z_score_price: z_price !== null ? +z_price.toFixed(2) : null,
      z_score_market_cap: z_cap !== null ? +z_cap.toFixed(2) : null,
      z_score_volume: z_vol !== null ? +z_vol.toFixed(2) : null,
      anomaly_price: z_price !== null && Math.abs(z_price) > threshold,
      anomaly_market_cap: z_cap !== null && Math.abs(z_cap) > threshold,
      anomaly_volume: z_vol !== null && Math.abs(z_vol) > threshold,
    }
  })
}

export async function GET() {
  try {
    const [bitcoin, ethereum] = await Promise.all([fetchMarketData("bitcoin"), fetchMarketData("ethereum")])

    return NextResponse.json({ bitcoin, ethereum })
  } catch (error) {
    console.error("Error fetching market data:", error)
    return NextResponse.json({ error: "Failed to fetch market data" }, { status: 500 })
  }
}
