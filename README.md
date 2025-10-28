# ThermoAQ 🌡️💨

**Advanced Environmental Monitoring & Weather Intelligence Platform**

ThermoAQ is a comprehensive real-time weather and air quality monitoring platform that provides accurate forecasts, environmental analytics, and intelligent alerts to help communities make informed decisions about their health and safety.

## 🚀 Project Overview

ThermoAQ delivers precision environmental monitoring with:
- **Real-time Weather Data** - Live updates every 10 minutes
- **7-16 Day Forecasts** - Extended weather predictions
- **Air Quality Monitoring** - Comprehensive AQI tracking with pollutant breakdown
- **Global Coverage** - 130+ cities worldwide
- **Interactive Visualizations** - Charts, maps, and trend analysis
- **Smart Alerts** - Automated severe weather notifications

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19.1.1 with Vite 7.1.9
- **Styling**: Tailwind CSS
- **Icons**: Lucide React (professional icon library)
- **Charts**: Chart.js with React-Chart.js-2
- **Maps**: React Leaflet with OpenStreetMap
- **Routing**: React Router DOM
- **HTTP Client**: Native Fetch API

### Backend
- **Runtime**: Node.js with Express
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT & bcryptjs
- **Real-time**: Socket.io

### APIs & Data Sources
- **Weather Data**: Open-Meteo API (free, unlimited, no key required)
  - Current weather conditions
  - 7-16 day forecasts
  - Hourly data (24 hours)
  - Air quality index
- **Geocoding**: Open-Meteo Geocoding API
- **Maps**: OpenStreetMap via Leaflet

## 🌟 Key Features

### 🌤️ Advanced Weather Dashboard
- **Current Conditions**
  - Temperature, humidity, wind speed, UV index
  - Weather conditions with dynamic icons
  - "Feels like" temperature
  - Atmospheric pressure
  - Visibility data

- **Forecasting**
  - 7-day detailed forecast with high/low temperatures
  - Hourly forecast for next 24 hours
  - Precipitation probability charts
  - Rain intensity visualization
  - Weekly weather trends

- **Auto-Refresh System**
  - Updates every 10 minutes automatically
  - Manual refresh button
  - Last updated timestamp
  - Toggle auto-refresh on/off

### 🌬️ Air Quality Index (AQI) Monitoring
- **Real-time AQI Tracking**
  - US EPA AQI standard
  - Color-coded severity levels (Good/Moderate/Unhealthy/Hazardous)
  - Live data updates

- **Pollutant Breakdown**
  - PM2.5 (Fine particulate matter)
  - PM10 (Coarse particulate matter)
  - O₃ (Ozone)
  - CO (Carbon monoxide)
  - NO₂ (Nitrogen dioxide)
  - SO₂ (Sulfur dioxide)

- **Historical Analysis**
  - 7-day AQI trend charts
  - Comparison across multiple cities
  - Health impact indicators

### 🗺️ Global Weather Map
- **Coverage**: 130+ major cities worldwide
  - India: 10 cities (Mumbai, Delhi, Bangalore, Chennai, etc.)
  - Asia: 29 cities
  - Europe: 21 cities
  - North America: 18 cities
  - South America: 10 cities
  - Africa: 14 cities
  - Oceania: 7 cities

- **Interactive Features**
  - Temperature-based color coding
  - Click for detailed city weather
  - Real-time data updates
  - Responsive markers

### 🔔 Smart Alert System
- **Severe Weather Alerts**
  - Extreme temperature warnings (>40°C, >35°C, <5°C)
  - Storm and heavy rain notifications
  - High wind speed alerts (>40 km/h)
  - Poor air quality warnings

- **Health Advisories**
  - UV index recommendations
  - Outdoor activity suggestions
  - Vulnerable population warnings

### 📊 Advanced Visualizations
- **Precipitation Charts**
  - Hourly precipitation probability (line chart)
  - Rain intensity bars (3-hour intervals)
  - 7-day precipitation trends

- **Temperature Graphs**
  - Hourly temperature curves
  - High/low temperature comparison
  - Feels-like temperature overlay

- **AQI Trend Analysis**
  - Weekly AQI progression
  - Multi-city comparison
  - Pollutant-specific charts

### � User Experience Features
- **Modern UI/UX**
  - Gradient backgrounds with glassmorphism
  - Smooth hover animations
  - Interactive cards with scale effects
  - Loading states and skeletons
  - Error handling with fallback data

- **City Management**
  - Search with autocomplete (70+ popular cities)
  - Add/remove cities dynamically
  - Favorite locations
  - Multi-city weather comparison

- **Responsive Design**
  - Mobile-optimized layouts
  - Touch-friendly interactions
  - Adaptive grid systems
  - Consistent spacing and typography

## 📁 Project Structure

```
ThermoAQ/
├── client/                      # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── weather/        # Weather components
│   │   │   │   ├── TodayWeather.jsx
│   │   │   │   ├── TomorrowWeather.jsx
│   │   │   │   ├── WeeklyForecast.jsx
│   │   │   │   ├── SevenDayForecast.jsx
│   │   │   │   ├── HourlyForecast.jsx
│   │   │   │   ├── RainCharts.jsx
│   │   │   │   ├── StatCards.jsx
│   │   │   │   ├── GlobalWeatherMap.jsx
│   │   │   │   ├── OtherCities.jsx
│   │   │   │   ├── WeatherAlerts.jsx
│   │   │   │   └── StatusBar.jsx
│   │   │   ├── charts/         # Chart components
│   │   │   │   └── ChartComponents.jsx
│   │   │   └── ui/             # UI components
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── WeatherApp.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── HeatWaveMap.jsx
│   │   │   └── HealthAdvisory.jsx
│   │   ├── services/
│   │   │   ├── weatherService.js  # Weather API integration
│   │   │   └── aqiService.js      # AQI data service
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   └── Footer.jsx
│   │   └── utils/
│   │       └── api.js
│   ├── public/
│   └── package.json
│
└── server/                      # Node.js Backend
    ├── controllers/
    ├── models/
    │   └── User.js
    ├── routes/
    │   └── auth.js
    ├── middleware/
    │   └── auth.js
    ├── services/
    ├── server.js
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (optional - for auth features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Aaryan-Sharma-5/ThermoAQ.git
   cd ThermoAQ
   ```

2. **Install client dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Install server dependencies** (optional)
   ```bash
   cd ../server
   npm install
   ```

### Running the Application

#### Frontend Only (Weather Features)
```bash
cd client
npm run dev
```
Access the app at `http://localhost:5173/`

#### Full Stack (with Authentication)
```bash
# Terminal 1 - Start backend
cd server
npm start

# Terminal 2 - Start frontend
cd client
npm run dev
```

## � Available Routes

- `/` - **Home Page** - AQI & Weather widgets overview
- `/weather` - **Weather Dashboard** - Complete weather analysis
- `/dashboard` - **Analytics Dashboard** - District-level insights
- `/heatwave` - **Heat Wave Map** - Temperature risk mapping
- `/health` - **Health Advisory** - Environmental health recommendations

## 🎯 Features In Development

### Completed ✅
- [x] Real-time weather data integration
- [x] Auto-refresh (10-minute intervals)
- [x] Weather alerts system
- [x] 7-day forecast
- [x] Hourly forecasts
- [x] Global weather map (130+ cities)
- [x] AQI monitoring
- [x] Precipitation charts
- [x] City search & management
- [x] Professional UI with Lucide icons
- [x] Hover effects and animations

### In Progress 🔄
- [ ] Hourly temperature graph with min/max markers
- [ ] Enhanced AQI pollutant breakdown with health recommendations
- [ ] Historical comparison charts
- [ ] Geolocation auto-detect
- [ ] Favorite locations management

### Planned 📋
- [ ] Wind direction/speed compass
- [ ] UV index gauge visualization
- [ ] Sunrise/sunset timeline
- [ ] Moon phase indicator
- [ ] Pressure trend chart
- [ ] Export weather reports as PDF
- [ ] Social media sharing
- [ ] Download historical data as CSV
- [ ] Enhanced mobile responsiveness
- [ ] Touch gestures for charts

## 🔧 Configuration

### Weather Service
The application uses **Open-Meteo API** which requires no API key. Configuration is in:
```javascript
// client/src/services/weatherService.js
const OPEN_METEO_BASE = 'https://api.open-meteo.com/v1';
const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1';
```

### Caching
- **Cache Duration**: 10 minutes
- **Auto-Refresh**: 10-minute intervals
- Prevents excessive API calls
- Improves performance

## 🎨 Design System

### Colors
- **Primary**: Blue (#3B82F6)
- **Secondary**: Orange (#F97316)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Danger**: Red (#EF4444)

### Components
- Glassmorphism effects with backdrop blur
- Gradient backgrounds
- Consistent border radius (rounded-xl, rounded-2xl, rounded-3xl)
- Smooth transitions (300ms-500ms)
- Hover scale effects (1.01-1.10)

## 📊 Performance Optimizations

- **React Hooks**: useMemo, useCallback for expensive operations
- **Data Caching**: 10-minute cache to reduce API calls
- **Parallel API Calls**: Promise.all for faster data fetching
- **Lazy Loading**: Components load on demand
- **Optimized Re-renders**: Memoized values and callbacks

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Aaryan Sharma**
- GitHub: [@Aaryan-Sharma-5](https://github.com/Aaryan-Sharma-5)

## 🙏 Acknowledgments

- **Open-Meteo** - Free weather API
- **OpenStreetMap** - Map data
- **Lucide React** - Icon library
- **Chart.js** - Data visualization
- **Tailwind CSS** - Styling framework

---

**Made with ❤️ for environmental awareness** - Empowering communities through intelligent weather monitoring and actionable insights.

**Live Demo**: ThermoAQ - Your Environmental Intelligence Platform