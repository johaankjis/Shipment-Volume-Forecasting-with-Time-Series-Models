import { NextResponse } from "next/server"
import {
  generateSampleShipmentData,
  forecastWithConfidence,
  calculateMetrics,
  exponentialSmoothing,
  movingAverage,
  linearRegression,
} from "@/lib/forecast-models"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const method = (searchParams.get("method") || "es") as "ma" | "es" | "lr"
    const periods = Number.parseInt(searchParams.get("periods") || "6", 10)
    const historicalMonths = Number.parseInt(searchParams.get("months") || "24", 10)

    // Generate sample shipment data
    const historicalData = generateSampleShipmentData(historicalMonths)

    // Generate predictions based on method
    let predictions: number[]
    switch (method) {
      case "ma":
        predictions = movingAverage(historicalData, 3)
        break
      case "es":
        predictions = exponentialSmoothing(historicalData, 0.3)
        break
      case "lr":
        predictions = linearRegression(historicalData).predictions
        break
      default:
        predictions = exponentialSmoothing(historicalData, 0.3)
    }

    // Calculate metrics
    const metrics = calculateMetrics(historicalData, predictions)

    // Generate future forecasts
    const forecasts = forecastWithConfidence(historicalData, periods, method)

    // Format historical data with predictions
    const historicalWithPredictions = historicalData.map((actual, i) => ({
      date: `Month ${i + 1}`,
      actual,
      predicted: predictions[i],
    }))

    return NextResponse.json({
      historical: historicalWithPredictions,
      forecasts,
      metrics,
      method,
    })
  } catch (error) {
    console.error("Forecast API error:", error)
    return NextResponse.json({ error: "Failed to generate forecast" }, { status: 500 })
  }
}
