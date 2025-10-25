import { NextResponse } from "next/server"

const FRED_API_KEY = process.env.FRED_API_KEY || "demo"
const FRED_BASE_URL = "https://api.stlouisfed.org/fred"

interface FredObservation {
  date: string
  value: string
}

interface FredResponse {
  observations: FredObservation[]
}

const SERIES_IDS = {
  gdp: "GDP",
  cpi: "CPIAUCSL",
  unemployment: "UNRATE",
  industrialProduction: "INDPRO",
  retailSales: "RSXFS",
}

async function fetchSeries(seriesId: string): Promise<FredObservation[]> {
  const url = `${FRED_BASE_URL}/series/observations?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json&observation_start=2023-01-01`

  const response = await fetch(url, { next: { revalidate: 3600 } })
  if (!response.ok) {
    throw new Error(`Failed to fetch ${seriesId}`)
  }

  const data: FredResponse = await response.json()
  return data.observations
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const indicator = searchParams.get("indicator") || "all"

    if (indicator !== "all" && !Object.keys(SERIES_IDS).includes(indicator)) {
      return NextResponse.json({ error: "Invalid indicator" }, { status: 400 })
    }

    // Fetch requested data
    const seriesToFetch =
      indicator === "all" ? Object.entries(SERIES_IDS) : [[indicator, SERIES_IDS[indicator as keyof typeof SERIES_IDS]]]

    const results = await Promise.all(
      seriesToFetch.map(async ([key, seriesId]) => {
        const data = await fetchSeries(seriesId)
        return {
          indicator: key,
          data: data
            .filter((obs) => obs.value !== ".")
            .map((obs) => ({
              date: obs.date,
              value: Number.parseFloat(obs.value),
            })),
        }
      }),
    )

    return NextResponse.json({
      indicators: results,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Economic data API error:", error)
    return NextResponse.json({ error: "Failed to fetch economic data" }, { status: 500 })
  }
}
