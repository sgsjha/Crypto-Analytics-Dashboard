"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Bitcoin, EclipseIcon as Ethereum, Clock } from "lucide-react"
import CryptoChart from "@/components/crypto-chart"
import { cn } from "@/lib/utils"

// Define types based on the provided script
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

type MarketData = {
  bitcoin: MetricRecord[]
  ethereum: MetricRecord[]
}

export default function Home() {
  const [data, setData] = useState<MarketData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCoin, setSelectedCoin] = useState<"bitcoin" | "ethereum">("bitcoin")
  const [selectedMetric, setSelectedMetric] = useState<"price" | "market_cap" | "volume">("price")

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, we would use the script to generate the data
        // For this demo, we'll fetch the data directly from the API
        const response = await fetch("/api/market-data")
        if (!response.ok) {
          throw new Error("Failed to fetch market data")
        }
        const marketData = await response.json()
        setData(marketData)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load market data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Get the latest data for Bitcoin and Ethereum
  const latestBitcoin = data?.bitcoin ? data.bitcoin[data.bitcoin.length - 1] : null
  const latestEthereum = data?.ethereum ? data.ethereum[data.ethereum.length - 1] : null

  // Calculate combined market cap and volume
  const combinedMarketCap = (latestBitcoin?.market_cap || 0) + (latestEthereum?.market_cap || 0)
  const combinedVolume = (latestBitcoin?.total_volume || 0) + (latestEthereum?.total_volume || 0)

  // Calculate daily percentage change
  const calculateDailyChange = (data: MetricRecord[] | undefined) => {
    if (!data || data.length < 2) return 0
    const today = data[data.length - 1].price_usd
    const yesterday = data[data.length - 2].price_usd
    return ((today - yesterday) / yesterday) * 100
  }

  const bitcoinDailyChange = calculateDailyChange(data?.bitcoin)
  const ethereumDailyChange = calculateDailyChange(data?.ethereum)

  // Format large numbers
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
      notation: value >= 1_000_000 ? "compact" : "standard",
    }).format(value)
  }

  // Format large numbers with commas
  const formatLargeNumber = (value: number) => {
    return new Intl.NumberFormat("en-US").format(value)
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Crypto Analytics Dashboard</h1>
          <p className="text-gray-400">Real-time cryptocurrency data analysis and visualization</p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Bitcoin Price Card */}
          <Card className="bg-[#111111] border-gray-800 p-4 rounded-lg">
            <div className="text-sm text-gray-400 mb-1">Bitcoin Price</div>
            <div className="flex items-center">
              <Bitcoin className="h-5 w-5 text-[#F7931A] mr-2" />
              <span className="text-[#F7931A] text-2xl font-bold">
                ${latestBitcoin ? latestBitcoin.price_usd.toLocaleString("en-US", { maximumFractionDigits: 2 }) : "..."}
              </span>
            </div>
            <div className="mt-1">
              <span className={cn("text-sm", bitcoinDailyChange >= 0 ? "text-green-500" : "text-red-500")}>
                {bitcoinDailyChange >= 0 ? "↑" : "↓"} {Math.abs(bitcoinDailyChange).toFixed(1)}% today
              </span>
            </div>
          </Card>

          {/* Ethereum Price Card */}
          <Card className="bg-[#111111] border-gray-800 p-4 rounded-lg">
            <div className="text-sm text-gray-400 mb-1">Ethereum Price</div>
            <div className="flex items-center">
              <Ethereum className="h-5 w-5 text-[#627EEA] mr-2" />
              <span className="text-[#627EEA] text-2xl font-bold">
                $
                {latestEthereum
                  ? latestEthereum.price_usd.toLocaleString("en-US", { maximumFractionDigits: 2 })
                  : "..."}
              </span>
            </div>
            <div className="mt-1">
              <span className={cn("text-sm", ethereumDailyChange >= 0 ? "text-green-500" : "text-red-500")}>
                {ethereumDailyChange >= 0 ? "↑" : "↓"} {Math.abs(ethereumDailyChange).toFixed(1)}% today
              </span>
            </div>
          </Card>

          {/* Market Cap Card */}
          <Card className="bg-[#111111] border-gray-800 p-4 rounded-lg">
            <div className="text-sm text-gray-400 mb-1">Market Cap</div>
            <div className="text-2xl font-bold text-white">
              ${combinedMarketCap ? formatLargeNumber(combinedMarketCap) : "..."}
            </div>
            <div className="mt-1 flex items-center text-sm text-gray-400">
              <Clock className="h-3 w-3 mr-1" /> Combined market cap
            </div>
          </Card>

          {/* 24h Volume Card */}
          <Card className="bg-[#111111] border-gray-800 p-4 rounded-lg">
            <div className="text-sm text-gray-400 mb-1">24h Volume</div>
            <div className="text-2xl font-bold text-white">
              ${combinedVolume ? formatLargeNumber(combinedVolume) : "..."}
            </div>
            <div className="mt-1 flex items-center text-sm text-gray-400">
              <Clock className="h-3 w-3 mr-1" /> Combined 24h volume
            </div>
          </Card>
        </div>

        {/* Analysis Section */}
        <div className="space-y-4">
          <div className="flex items-center">
            {selectedCoin === "bitcoin" ? (
              <Bitcoin className="h-6 w-6 text-[#F7931A] mr-2" />
            ) : (
              <Ethereum className="h-6 w-6 text-[#627EEA] mr-2" />
            )}
            <h2 className="text-xl font-bold">{selectedCoin === "bitcoin" ? "Bitcoin" : "Ethereum"} Analysis</h2>
          </div>

          {/* Coin Selection Tabs */}
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedCoin("bitcoin")}
              className={cn(
                "px-4 py-2 rounded-md flex items-center",
                selectedCoin === "bitcoin"
                  ? "bg-[#F7931A]/10 text-[#F7931A] border border-[#F7931A]/30"
                  : "bg-[#111111] text-gray-400 border border-gray-800 hover:bg-[#222222]",
              )}
            >
              <Bitcoin className="h-4 w-4 mr-2" /> Bitcoin
            </button>
            <button
              onClick={() => setSelectedCoin("ethereum")}
              className={cn(
                "px-4 py-2 rounded-md flex items-center",
                selectedCoin === "ethereum"
                  ? "bg-[#627EEA]/10 text-[#627EEA] border border-[#627EEA]/30"
                  : "bg-[#111111] text-gray-400 border border-gray-800 hover:bg-[#222222]",
              )}
            >
              <Ethereum className="h-4 w-4 mr-2" /> Ethereum
            </button>
          </div>

          {/* Metric Selection Tabs */}
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setSelectedMetric("price")}
              className={cn(
                "px-4 py-1 rounded-md text-sm",
                selectedMetric === "price" ? "bg-white text-black" : "bg-[#111111] text-gray-400 hover:bg-[#222222]",
              )}
            >
              Price
            </button>
            <button
              onClick={() => setSelectedMetric("market_cap")}
              className={cn(
                "px-4 py-1 rounded-md text-sm",
                selectedMetric === "market_cap"
                  ? "bg-white text-black"
                  : "bg-[#111111] text-gray-400 hover:bg-[#222222]",
              )}
            >
              Market Cap
            </button>
            <button
              onClick={() => setSelectedMetric("volume")}
              className={cn(
                "px-4 py-1 rounded-md text-sm",
                selectedMetric === "volume" ? "bg-white text-black" : "bg-[#111111] text-gray-400 hover:bg-[#222222]",
              )}
            >
              Volume
            </button>
          </div>

          {/* Chart */}
          <Card className="bg-[#111111] border-gray-800 p-4 rounded-lg">
            {loading ? (
              <div className="h-[300px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
              </div>
            ) : data ? (
              <CryptoChart data={data[selectedCoin]} metricType={selectedMetric} coinType={selectedCoin} />
            ) : (
              <div className="h-[300px] flex items-center justify-center text-red-500">
                {error || "Failed to load data"}
              </div>
            )}
          </Card>
        </div>
      </div>
    </main>
  )
}
