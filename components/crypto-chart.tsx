"use client"

import { useMemo } from "react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { format } from "date-fns"

type MetricRecord = {
  date: string
  price_usd: number
  market_cap: number
  total_volume: number
  z_score_price: number | null
  z_score_market_cap: number | null
  z_score_volume: number | null
  anomaly_price: boolean
  anomaly_market_cap: boolean
  anomaly_volume: boolean
}

type CryptoChartProps = {
  data: MetricRecord[]
  metricType: "price" | "market_cap" | "volume"
  coinType: "bitcoin" | "ethereum"
}

export default function CryptoChart({ data, metricType, coinType }: CryptoChartProps) {
  // Map metric type to data key and anomaly key
  const metricMapping = {
    price: {
      dataKey: "price_usd",
      zScoreKey: "z_score_price",
      anomalyKey: "anomaly_price",
      label: "Price (USD)",
    },
    market_cap: {
      dataKey: "market_cap",
      zScoreKey: "z_score_market_cap",
      anomalyKey: "anomaly_market_cap",
      label: "Market Cap (USD)",
    },
    volume: {
      dataKey: "total_volume",
      zScoreKey: "z_score_volume",
      anomalyKey: "anomaly_volume",
      label: "Volume (USD)",
    },
  }

  const { dataKey, zScoreKey, anomalyKey, label } = metricMapping[metricType]

  // Get color based on coin type
  const coinColor = coinType === "bitcoin" ? "#F7931A" : "#627EEA"

  // Format data for the chart
  const chartData = useMemo(() => {
    return data.map((record) => {
      const isAnomaly = record[anomalyKey] as boolean
      return {
        date: record.date,
        value: record[dataKey] as number,
        zScore: record[zScoreKey] as number | null,
        isAnomaly,
        // Add a special point for anomalies
        anomalyPoint: isAnomaly ? (record[dataKey] as number) : null,
      }
    })
  }, [data, dataKey, zScoreKey, anomalyKey])

  // Format large numbers
  const formatYAxis = (value: number) => {
    if (value >= 1_000_000_000) {
      return `$${(value / 1_000_000_000).toFixed(1)}B`
    } else if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(1)}M`
    } else if (value >= 1_000) {
      return `$${(value / 1_000).toFixed(1)}K`
    }
    return `$${value.toFixed(0)}`
  }

  // Format date for x-axis
  const formatXAxis = (dateStr: string) => {
    return format(new Date(dateStr), "MMM d")
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-[#222222] p-3 border border-gray-800 rounded-md shadow-lg">
          <p className="text-gray-300">{format(new Date(label), "MMM d, yyyy")}</p>
          <p className="text-white font-bold">
            {formatYAxis(data.value)}
            {data.isAnomaly && <span className="ml-2 text-red-500 text-xs font-normal">Anomaly Detected</span>}
          </p>
          {data.zScore !== null && (
            <p className="text-gray-400 text-xs">
              Z-Score:{" "}
              <span className={Math.abs(data.zScore) > 1.5 ? "text-red-400" : "text-gray-300"}>
                {data.zScore.toFixed(2)}
              </span>
            </p>
          )}
        </div>
      )
    }
    return null
  }

  // Calculate min and max for y-axis
  const minValue = Math.min(...chartData.map((item) => item.value))
  const maxValue = Math.max(...chartData.map((item) => item.value))
  const yAxisDomain = [minValue * 0.9, maxValue * 1.1]

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id={`colorValue-${coinType}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={coinColor} stopOpacity={0.3} />
              <stop offset="95%" stopColor={coinColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#333333" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={formatXAxis}
            tick={{ fontSize: 12, fill: "#999999" }}
            tickMargin={10}
            minTickGap={30}
            axisLine={{ stroke: "#333333" }}
            tickLine={{ stroke: "#333333" }}
          />
          <YAxis
            tickFormatter={formatYAxis}
            tick={{ fontSize: 12, fill: "#999999" }}
            width={80}
            domain={yAxisDomain}
            axisLine={{ stroke: "#333333" }}
            tickLine={{ stroke: "#333333" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke={coinColor}
            fillOpacity={1}
            fill={`url(#colorValue-${coinType})`}
            strokeWidth={2}
            dot={{ r: 3, fill: coinColor, stroke: coinColor }}
            activeDot={{ r: 6, fill: coinColor, stroke: "#fff", strokeWidth: 2 }}
          />
          <Area
            type="monotone"
            dataKey="anomalyPoint"
            stroke="#FF0000"
            fill="#FF0000"
            strokeWidth={0}
            dot={{ r: 6, strokeWidth: 2, stroke: "#FF0000", fill: "#FF0000" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
