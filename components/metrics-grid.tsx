import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Activity, Target } from "lucide-react"

interface MetricsGridProps {
  metrics: {
    currentIndex: number
    changePercent: number
    mape: number
    rmse: number
    coverage: number
    trendChange: number
  }
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  const isPositive = metrics.changePercent > 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Index</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.currentIndex.toFixed(3)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            <span className={isPositive ? "text-chart-2" : "text-destructive"}>
              {isPositive ? "+" : ""}
              {metrics.changePercent.toFixed(1)}%
            </span>{" "}
            from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Forecast Accuracy</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.mape}%</div>
          <p className="text-xs text-muted-foreground mt-1">Mean Absolute % Error</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Model RMSE</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.rmse.toFixed(3)}</div>
          <p className="text-xs text-muted-foreground mt-1">Root Mean Squared Error</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Trend Forecast</CardTitle>
          {metrics.trendChange > 0 ? (
            <TrendingUp className="h-4 w-4 text-chart-2" />
          ) : (
            <TrendingDown className="h-4 w-4 text-destructive" />
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {metrics.trendChange > 0 ? "+" : ""}
            {metrics.trendChange.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground mt-1">Next 12 weeks</p>
        </CardContent>
      </Card>
    </div>
  )
}
