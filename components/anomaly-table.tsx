"use client"

import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

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

type AnomalyTableProps = {
  anomalies: MetricRecord[]
}

export default function AnomalyTable({ anomalies }: AnomalyTableProps) {
  if (anomalies.length === 0) {
    return <p className="text-muted-foreground">No anomalies detected in the current time period.</p>
  }

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

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Metric</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Z-Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {anomalies.flatMap((record) => {
            const rows = []

            if (record.anomaly_price) {
              rows.push(
                <TableRow key={`${record.date}-price`}>
                  <TableCell>{format(new Date(record.date), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    <Badge variant="outline">Price</Badge>
                  </TableCell>
                  <TableCell>{formatValue(record.price_usd)}</TableCell>
                  <TableCell>
                    <Badge variant="destructive">{record.z_score_price?.toFixed(2)}</Badge>
                  </TableCell>
                </TableRow>,
              )
            }

            if (record.anomaly_market_cap) {
              rows.push(
                <TableRow key={`${record.date}-market-cap`}>
                  <TableCell>{format(new Date(record.date), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    <Badge variant="outline">Market Cap</Badge>
                  </TableCell>
                  <TableCell>{formatValue(record.market_cap)}</TableCell>
                  <TableCell>
                    <Badge variant="destructive">{record.z_score_market_cap?.toFixed(2)}</Badge>
                  </TableCell>
                </TableRow>,
              )
            }

            if (record.anomaly_volume) {
              rows.push(
                <TableRow key={`${record.date}-volume`}>
                  <TableCell>{format(new Date(record.date), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    <Badge variant="outline">Volume</Badge>
                  </TableCell>
                  <TableCell>{formatValue(record.total_volume)}</TableCell>
                  <TableCell>
                    <Badge variant="destructive">{record.z_score_volume?.toFixed(2)}</Badge>
                  </TableCell>
                </TableRow>,
              )
            }

            return rows
          })}
        </TableBody>
      </Table>
    </div>
  )
}
