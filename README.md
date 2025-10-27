# Freight Forecasting Platform 📦

An AI-powered shipment volume forecasting application built with Next.js 16, featuring multiple time series forecasting models and real-time economic indicators integration.

## 🌟 Features

- **Multiple Forecasting Models**: Implements three different time series forecasting approaches:
  - Exponential Smoothing (ES)
  - Moving Average (MA)
  - Linear Regression (LR)
  
- **Real-time Economic Data**: Integration with FRED (Federal Reserve Economic Data) API to fetch:
  - GDP (Gross Domestic Product)
  - CPI (Consumer Price Index)
  - Unemployment Rate
  - Industrial Production
  - Retail Sales

- **Interactive Dashboard**: Modern, responsive UI with:
  - Real-time forecast visualization
  - Confidence intervals display
  - Model performance metrics
  - Model comparison capabilities
  
- **Performance Metrics**: Comprehensive model evaluation with:
  - MAE (Mean Absolute Error)
  - RMSE (Root Mean Square Error)
  - MAPE (Mean Absolute Percentage Error)

## 🛠️ Technology Stack

### Frontend
- **Next.js 16.0.0** - React framework with App Router
- **React 19.0.0** - UI library
- **TypeScript 5** - Type-safe development
- **Tailwind CSS 4.1** - Utility-first styling
- **Recharts** - Data visualization library
- **SWR** - Data fetching and caching
- **Lucide React** - Icon library
- **shadcn/ui** - UI component library

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **FRED API Integration** - Economic data fetching

### Development Tools
- **PostCSS** - CSS processing
- **Vercel Analytics** - Performance monitoring
- **pnpm** - Fast, disk space efficient package manager

## 📁 Project Structure

```
├── app/
│   ├── api/                    # API routes
│   │   ├── forecast/           # Forecasting endpoints
│   │   ├── metrics/            # Model metrics endpoints
│   │   └── economic-data/      # Economic indicators endpoints
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   └── globals.css             # Global styles
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── forecast-dashboard.tsx  # Main dashboard component
│   ├── forecast-chart.tsx      # Chart visualization
│   ├── metrics-grid.tsx        # Metrics display
│   ├── data-table.tsx          # Data table component
│   └── theme-provider.tsx      # Theme management
├── lib/
│   ├── forecast-models.ts      # Time series forecasting implementations
│   └── utils.ts                # Utility functions
├── scripts/
│   └── fetch-fred-data.ts      # FRED API data fetching script
├── hooks/                      # Custom React hooks
├── public/                     # Static assets
└── styles/                     # Additional styles
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- pnpm (recommended) or npm
- (Optional) FRED API key for real economic data

### Installation

1. Clone the repository:
```bash
git clone https://github.com/johaankjis/Shipment-Volume-Forecasting-with-Time-Series-Models.git
cd Shipment-Volume-Forecasting-with-Time-Series-Models
```

2. Install dependencies:
```bash
pnpm install
# or
npm install
```

3. (Optional) Create a `.env.local` file for FRED API key:
```bash
FRED_API_KEY=your_api_key_here
```

You can get a free FRED API key at: https://fred.stlouisfed.org/docs/api/api_key.html

4. Run the development server:
```bash
pnpm dev
# or
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Usage

### Dashboard Interface

The main dashboard provides:
- **Model Selection**: Choose between ES, MA, or LR forecasting models
- **Forecast Period**: Select the number of periods to forecast (default: 6)
- **Historical Data View**: Visualize actual vs predicted shipment volumes
- **Future Forecasts**: View predictions with confidence intervals
- **Model Metrics**: Compare accuracy across different models

### API Endpoints

#### 1. Forecast API
```
GET /api/forecast?method=es&periods=6&months=24
```

**Parameters:**
- `method` (optional): `es`, `ma`, or `lr` (default: `es`)
- `periods` (optional): Number of future periods to forecast (default: 6)
- `months` (optional): Number of historical months to generate (default: 24)

**Response:**
```json
{
  "historical": [
    {
      "date": "Month 1",
      "actual": 10000,
      "predicted": 10000
    }
  ],
  "forecasts": [
    {
      "date": "Future +1",
      "predicted": 11500,
      "confidence": {
        "lower": 10000,
        "upper": 13000
      }
    }
  ],
  "metrics": {
    "mae": 250.5,
    "rmse": 312.8,
    "mape": 2.5
  },
  "method": "es"
}
```

#### 2. Metrics API
```
GET /api/metrics
```

Returns performance metrics for all three forecasting models.

**Response:**
```json
{
  "models": [
    {
      "name": "Exponential Smoothing",
      "code": "es",
      "metrics": {
        "mae": 250.5,
        "rmse": 312.8,
        "mape": 2.5
      },
      "accuracy": 97.5
    }
  ]
}
```

#### 3. Economic Data API
```
GET /api/economic-data?indicator=all
```

**Parameters:**
- `indicator` (optional): `gdp`, `cpi`, `unemployment`, `industrialProduction`, `retailSales`, or `all` (default: `all`)

**Response:**
```json
{
  "indicators": [
    {
      "indicator": "gdp",
      "data": [
        {
          "date": "2023-01-01",
          "value": 26500.5
        }
      ]
    }
  ],
  "lastUpdated": "2025-10-27T22:19:56.541Z"
}
```

## 🔬 Forecasting Models

### 1. Exponential Smoothing (ES)
Applies weighted averages where recent observations have exponentially decreasing weights.

**Formula:** `S_t = α * Y_t + (1 - α) * S_{t-1}`
- `α (alpha)`: Smoothing parameter (0.3 by default)
- Best for: Data with no clear trend or seasonality

### 2. Moving Average (MA)
Calculates the average of the most recent n observations.

**Window size:** 3 periods (default)
- Best for: Smoothing short-term fluctuations

### 3. Linear Regression (LR)
Fits a straight line through the data to identify trends.

**Formula:** `Y = mx + b`
- Best for: Data with clear linear trends

## 📈 Model Metrics

- **MAE (Mean Absolute Error)**: Average absolute difference between predictions and actual values
- **RMSE (Root Mean Square Error)**: Square root of average squared differences
- **MAPE (Mean Absolute Percentage Error)**: Average percentage error
- **Accuracy**: Calculated as `100 - MAPE`

## 🔧 Development

### Build for Production
```bash
pnpm build
npm run build
```

### Start Production Server
```bash
pnpm start
npm start
```

### Linting
```bash
pnpm lint
npm run lint
```

### Fetch FRED Data (Script)
```bash
npx tsx scripts/fetch-fred-data.ts
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **FRED API** - Federal Reserve Economic Data
- **shadcn/ui** - Beautiful UI components
- **Vercel** - Deployment platform
- **Recharts** - Charting library

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Built with ❤️ using Next.js and TypeScript**
