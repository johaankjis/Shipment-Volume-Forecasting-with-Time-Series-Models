/**
 * Fetches economic indicators from FRED API
 * Indicators: GDP, CPI, Unemployment Rate, Industrial Production, Retail Sales
 */

const FRED_API_KEY = process.env.FRED_API_KEY || "demo"
const FRED_BASE_URL = "https://api.stlouisfed.org/fred"

interface FredObservation {
  date: string
  value: string
}

interface FredResponse {
  observations: FredObservation[]
}

interface EconomicData {
  date: string
  gdp?: number
  cpi?: number
  unemployment?: number
  industrialProduction?: number
  retailSales?: number
}

const SERIES_IDS = {
  gdp: "GDP",
  cpi: "CPIAUCSL",
  unemployment: "UNRATE",
  industrialProduction: "INDPRO",
  retailSales: "RSXFS",
}

async function fetchSeries(seriesId: string): Promise<FredObservation[]> {
  const url = `${FRED_BASE_URL}/series/observations?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json&observation_start=2020-01-01`

  console.log(`[v0] Fetching ${seriesId} from FRED...`)

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch ${seriesId}: ${response.statusText}`)
  }

  const data: FredResponse = await response.json()
  console.log(`[v0] Fetched ${data.observations.length} observations for ${seriesId}`)

  return data.observations
}

async function fetchAllData(): Promise<EconomicData[]> {
  try {
    // Fetch all series in parallel
    const [gdpData, cpiData, unemploymentData, ipData, retailData] = await Promise.all([
      fetchSeries(SERIES_IDS.gdp),
      fetchSeries(SERIES_IDS.cpi),
      fetchSeries(SERIES_IDS.unemployment),
      fetchSeries(SERIES_IDS.industrialProduction),
      fetchSeries(SERIES_IDS.retailSales),
    ])

    // Combine data by date
    const dataMap = new Map<string, EconomicData>()

    // Process each series
    gdpData.forEach((obs) => {
      if (obs.value !== ".") {
        const existing = dataMap.get(obs.date) || { date: obs.date }
        existing.gdp = Number.parseFloat(obs.value)
        dataMap.set(obs.date, existing)
      }
    })

    cpiData.forEach((obs) => {
      if (obs.value !== ".") {
        const existing = dataMap.get(obs.date) || { date: obs.date }
        existing.cpi = Number.parseFloat(obs.value)
        dataMap.set(obs.date, existing)
      }
    })

    unemploymentData.forEach((obs) => {
      if (obs.value !== ".") {
        const existing = dataMap.get(obs.date) || { date: obs.date }
        existing.unemployment = Number.parseFloat(obs.value)
        dataMap.set(obs.date, existing)
      }
    })

    ipData.forEach((obs) => {
      if (obs.value !== ".") {
        const existing = dataMap.get(obs.date) || { date: obs.date }
        existing.industrialProduction = Number.parseFloat(obs.value)
        dataMap.set(obs.date, existing)
      }
    })

    retailData.forEach((obs) => {
      if (obs.value !== ".") {
        const existing = dataMap.get(obs.date) || { date: obs.date }
        existing.retailSales = Number.parseFloat(obs.value)
        dataMap.set(obs.date, existing)
      }
    })

    // Convert to array and sort by date
    const combinedData = Array.from(dataMap.values()).sort((a, b) => a.date.localeCompare(b.date))

    console.log(`[v0] Combined ${combinedData.length} data points`)
    console.log("[v0] Sample data:", combinedData.slice(-5))

    return combinedData
  } catch (error) {
    console.error("[v0] Error fetching FRED data:", error)
    throw error
  }
}

// Execute the fetch
fetchAllData()
  .then((data) => {
    console.log("[v0] Successfully fetched and processed FRED data")
    console.log(`[v0] Total records: ${data.length}`)
  })
  .catch((error) => {
    console.error("[v0] Failed to fetch data:", error)
  })
