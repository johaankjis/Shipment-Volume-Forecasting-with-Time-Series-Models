/**
 * Forecasting models for shipment volume prediction
 * Implements: Moving Average, Exponential Smoothing, and Linear Regression
 */

export interface ForecastPoint {
  date: string
  actual?: number
  predicted: number
  confidence?: {
    lower: number
    upper: number
  }
}

export interface ModelMetrics {
  mae: number // Mean Absolute Error
  rmse: number // Root Mean Square Error
  mape: number // Mean Absolute Percentage Error
}

/**
 * Simple Moving Average
 */
export function movingAverage(data: number[], window = 3): number[] {
  const result: number[] = []

  for (let i = 0; i < data.length; i++) {
    if (i < window - 1) {
      result.push(data[i])
    } else {
      const sum = data.slice(i - window + 1, i + 1).reduce((a, b) => a + b, 0)
      result.push(sum / window)
    }
  }

  return result
}

/**
 * Exponential Smoothing
 */
export function exponentialSmoothing(data: number[], alpha = 0.3): number[] {
  const result: number[] = [data[0]]

  for (let i = 1; i < data.length; i++) {
    const smoothed = alpha * data[i] + (1 - alpha) * result[i - 1]
    result.push(smoothed)
  }

  return result
}

/**
 * Linear Regression
 */
export function linearRegression(data: number[]): {
  slope: number
  intercept: number
  predictions: number[]
} {
  const n = data.length
  const x = Array.from({ length: n }, (_, i) => i)

  // Calculate means
  const xMean = x.reduce((a, b) => a + b, 0) / n
  const yMean = data.reduce((a, b) => a + b, 0) / n

  // Calculate slope and intercept
  let numerator = 0
  let denominator = 0

  for (let i = 0; i < n; i++) {
    numerator += (x[i] - xMean) * (data[i] - yMean)
    denominator += (x[i] - xMean) ** 2
  }

  const slope = numerator / denominator
  const intercept = yMean - slope * xMean

  // Generate predictions
  const predictions = x.map((xi) => slope * xi + intercept)

  return { slope, intercept, predictions }
}

/**
 * Calculate forecast with confidence intervals
 */
export function forecastWithConfidence(
  historicalData: number[],
  periods = 6,
  method: "ma" | "es" | "lr" = "es",
): ForecastPoint[] {
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
  }

  // Calculate standard deviation for confidence intervals
  const errors = historicalData.map((actual, i) => Math.abs(actual - predictions[i]))
  const stdDev = Math.sqrt(errors.reduce((sum, err) => sum + err ** 2, 0) / errors.length)

  // Generate future forecasts
  const lastValue = predictions[predictions.length - 1]
  const trend = predictions[predictions.length - 1] - predictions[predictions.length - 2]

  const forecasts: ForecastPoint[] = []

  for (let i = 1; i <= periods; i++) {
    const predicted = lastValue + trend * i
    forecasts.push({
      date: `Future +${i}`,
      predicted,
      confidence: {
        lower: predicted - 1.96 * stdDev,
        upper: predicted + 1.96 * stdDev,
      },
    })
  }

  return forecasts
}

/**
 * Calculate model accuracy metrics
 */
export function calculateMetrics(actual: number[], predicted: number[]): ModelMetrics {
  const n = Math.min(actual.length, predicted.length)

  let sumAbsError = 0
  let sumSquaredError = 0
  let sumPercentError = 0

  for (let i = 0; i < n; i++) {
    const error = actual[i] - predicted[i]
    sumAbsError += Math.abs(error)
    sumSquaredError += error ** 2
    sumPercentError += Math.abs(error / actual[i]) * 100
  }

  return {
    mae: sumAbsError / n,
    rmse: Math.sqrt(sumSquaredError / n),
    mape: sumPercentError / n,
  }
}

/**
 * Generate sample shipment data for demonstration
 */
export function generateSampleShipmentData(months = 24): number[] {
  const baseVolume = 10000
  const trend = 50
  const seasonality = 2000
  const noise = 500

  return Array.from({ length: months }, (_, i) => {
    const trendComponent = trend * i
    const seasonalComponent = seasonality * Math.sin((i * 2 * Math.PI) / 12)
    const randomComponent = (Math.random() - 0.5) * noise

    return baseVolume + trendComponent + seasonalComponent + randomComponent
  })
}
