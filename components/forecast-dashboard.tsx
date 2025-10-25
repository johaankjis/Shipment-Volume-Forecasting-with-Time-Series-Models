"use client"

import { useState } from "react"
import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from "recharts"
import { TrendingUp, Activity, BarChart3, AlertCircle } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface ForecastData {
  historical: Array<{ date: string; actual: number; predicted: number }>
  forecasts: Array<{
    date: string
    predicted: number
    confidence?: { lower: number; upper: number }
  }>
  metrics: {
    mae: number
    rmse: number
    mape: number
  }
  method: string
}

interface ModelMetrics {
  models: Array<{
    name: string
    code: string
    metrics: { mae: number; rmse: number; mape: number }
    accuracy: number
  }>
}

export function ForecastDashboard() {
  const [selectedModel, setSelectedModel] = useState<"es" | "ma" | "lr">("es")
  const [forecastPeriods, setForecastPeriods] = useState("6")

  const { data: forecastData, isLoading: forecastLoading } = useSWR<ForecastData>(
    `/api/forecast?method=${selectedModel}&periods=${forecastPeriods}`,
    fetcher,
    { refreshInterval: 30000 },
  )

  const { data: metricsData, isLoading: metricsLoading } = useSWR<ModelMetrics>("/api/metrics", fetcher, {
    refreshInterval: 60000,
  })

  // Combine historical and forecast data for chart
  const chartData = [
    ...(forecastData?.historical || []),
    ...(forecastData?.forecasts.map((f) => ({
      date: f.date,
      predicted: f.predicted,
      confidenceLower: f.confidence?.lower,
      confidenceUpper: f.confidence?.upper,
    })) || []),
  ]

  const modelNames = {
    es: "Exponential Smoothing",
    ma: "Moving Average",
    lr: "Linear Regression",
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Freight Forecasting Platform</h1>
          <p className="text-lg text-muted-foreground">
            AI-powered shipment volume predictions for logistics optimization
          </p>
        </div>

        {/* Model Selection */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Forecasting Configuration
            </CardTitle>
            <CardDescription>Select your forecasting model and prediction horizon</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium text-foreground">Model Type</label>
              <Select value={selectedModel} onValueChange={(value: "es" | "ma" | "lr") => setSelectedModel(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Exponential Smoothing</SelectItem>
                  <SelectItem value="ma">Moving Average</SelectItem>
                  <SelectItem value="lr">Linear Regression</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium text-foreground">Forecast Periods</label>
              <Select value={forecastPeriods} onValueChange={setForecastPeriods}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 Months</SelectItem>
                  <SelectItem value="6">6 Months</SelectItem>
                  <SelectItem value="12">12 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Model Accuracy</CardTitle>
              <TrendingUp className="h-4 w-4 text-chart-2" />
            </CardHeader>
            <CardContent>
              {forecastLoading ? (
                <Spinner className="h-8 w-8" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-foreground">
                    {forecastData ? (100 - forecastData.metrics.mape).toFixed(1) : "0"}%
                  </div>
                  <p className="text-xs text-muted-foreground">Based on historical data</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mean Absolute Error</CardTitle>
              <Activity className="h-4 w-4 text-chart-3" />
            </CardHeader>
            <CardContent>
              {forecastLoading ? (
                <Spinner className="h-8 w-8" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-foreground">
                    {forecastData ? forecastData.metrics.mae.toFixed(0) : "0"}
                  </div>
                  <p className="text-xs text-muted-foreground">Average prediction error</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Model</CardTitle>
              <BarChart3 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{modelNames[selectedModel]}</div>
              <p className="text-xs text-muted-foreground">Current forecasting method</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Shipment Volume Forecast</CardTitle>
            <CardDescription>Historical data and future predictions with confidence intervals</CardDescription>
          </CardHeader>
          <CardContent>
            {forecastLoading ? (
              <div className="flex h-[400px] items-center justify-center">
                <Spinner className="h-12 w-12" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="confidenceUpper"
                    stroke="none"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.1}
                    name="Upper Confidence"
                  />
                  <Area
                    type="monotone"
                    dataKey="confidenceLower"
                    stroke="none"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.1}
                    name="Lower Confidence"
                  />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    dot={false}
                    name="Actual Volume"
                  />
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Predicted Volume"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Model Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Model Performance Comparison</CardTitle>
            <CardDescription>Compare accuracy metrics across different forecasting models</CardDescription>
          </CardHeader>
          <CardContent>
            {metricsLoading ? (
              <div className="flex h-[200px] items-center justify-center">
                <Spinner className="h-12 w-12" />
              </div>
            ) : (
              <div className="space-y-4">
                {metricsData?.models.map((model) => (
                  <div
                    key={model.code}
                    className="flex items-center justify-between rounded-lg border border-border p-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-foreground">{model.name}</h4>
                        {model.code === selectedModel && <Badge variant="default">Active</Badge>}
                      </div>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>MAE: {model.metrics.mae.toFixed(0)}</span>
                        <span>RMSE: {model.metrics.rmse.toFixed(0)}</span>
                        <span>MAPE: {model.metrics.mape.toFixed(2)}%</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{model.accuracy.toFixed(1)}%</div>
                      <div className="text-xs text-muted-foreground">Accuracy</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Banner */}
        <Card className="border-chart-3/50 bg-chart-3/5">
          <CardContent className="flex items-start gap-3 pt-6">
            <AlertCircle className="h-5 w-5 text-chart-3" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">Demo Mode</p>
              <p className="text-sm text-muted-foreground">
                This dashboard uses simulated shipment data for demonstration. Connect your logistics data source to see
                real-time forecasts.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
