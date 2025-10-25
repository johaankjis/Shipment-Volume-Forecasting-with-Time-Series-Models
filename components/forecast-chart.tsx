"use client"

import { Line, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer, Area, AreaChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface ForecastChartProps {
  data: {
    historical: Array<{ date: string; value: number }>
    forecast: Array<{ date: string; value: number; lower: number; upper: number }>
  }
  showHistorical?: boolean
}

export function ForecastChart({ data, showHistorical = false }: ForecastChartProps) {
  const chartData = showHistorical
    ? [
        ...data.historical.map((d) => ({ ...d, type: "actual" })),
        ...data.forecast.map((d) => ({ ...d, type: "forecast" })),
      ]
    : data.forecast

  const config = {
    value: {
      label: "Shipment Index",
      color: "hsl(var(--chart-1))",
    },
    lower: {
      label: "Lower Bound",
      color: "hsl(var(--chart-2))",
    },
    upper: {
      label: "Upper Bound",
      color: "hsl(var(--chart-3))",
    },
  }

  return (
    <ChartContainer config={config} className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="confidenceInterval" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="date"
            className="text-xs"
            tickFormatter={(value) => {
              const date = new Date(value)
              return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
            }}
          />
          <YAxis className="text-xs" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          {!showHistorical && (
            <>
              <Area type="monotone" dataKey="upper" stroke="none" fill="url(#confidenceInterval)" fillOpacity={1} />
              <Area type="monotone" dataKey="lower" stroke="none" fill="hsl(var(--background))" fillOpacity={1} />
            </>
          )}
          <Line
            type="monotone"
            dataKey="value"
            stroke="hsl(var(--chart-1))"
            strokeWidth={2}
            dot={false}
            name="Forecast"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
