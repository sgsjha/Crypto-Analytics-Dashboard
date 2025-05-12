import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type DataSummaryProps = {
  coinName: string
  latestPrice: number
  latestMarketCap: number
  latestVolume: number
  priceChange: number
  marketCapChange: number
  volumeChange: number
}

export default function DataSummary({
  coinName,
  latestPrice,
  latestMarketCap,
  latestVolume,
  priceChange,
  marketCapChange,
  volumeChange,
}: DataSummaryProps) {
  // Format large numbers
  const formatValue = (value: number) => {
    if (value >= 1_000_000_000) {
      return `$${(value / 1_000_000_000).toFixed(2)}B`
    } else if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(2)}M`
    } else if (value >= 1_000) {
      return `$${(value / 1_000).toFixed(2)}K`
    }
    return `$${value.toFixed(2)}`
  }

  // Format percentage change
  const formatChange = (change: number) => {
    return `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`
  }

  // Determine color based on change
  const getChangeColor = (change: number) => {
    return change >= 0 ? "text-green-500" : "text-red-500"
  }

  // Determine icon based on change
  const getChangeIcon = (change: number) => {
    return change >= 0 ? (
      <ArrowUpIcon className="h-4 w-4 text-green-500" />
    ) : (
      <ArrowDownIcon className="h-4 w-4 text-red-500" />
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Current Price</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatValue(latestPrice)}</div>
          <div className="flex items-center mt-1">
            {getChangeIcon(priceChange)}
            <span className={`text-sm ${getChangeColor(priceChange)} ml-1`}>{formatChange(priceChange)}</span>
            <span className="text-xs text-muted-foreground ml-2">90d</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Market Cap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatValue(latestMarketCap)}</div>
          <div className="flex items-center mt-1">
            {getChangeIcon(marketCapChange)}
            <span className={`text-sm ${getChangeColor(marketCapChange)} ml-1`}>{formatChange(marketCapChange)}</span>
            <span className="text-xs text-muted-foreground ml-2">90d</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">24h Volume</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatValue(latestVolume)}</div>
          <div className="flex items-center mt-1">
            {getChangeIcon(volumeChange)}
            <span className={`text-sm ${getChangeColor(volumeChange)} ml-1`}>{formatChange(volumeChange)}</span>
            <span className="text-xs text-muted-foreground ml-2">90d</span>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
