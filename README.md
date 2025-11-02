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
- **AI Integration**: Google Gemini AI (Health Reports)
- **Real-time**: Socket.io

### APIs & Data Sources
- **Weather Data**: Open-Meteo API (free, unlimited, no key required)
  - Current weather conditions
  - 7-16 day forecasts
  - Hourly data (24 hours)
  - Air quality index
- **Geocoding**: Open-Meteo Geocoding API
- **Maps**: OpenStreetMap via Leaflet
- **AI Health Reports**: Google Gemini 1.5 Flash API

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
  - Personalized AQI alerts based on user conditions

### 🏥 AI-Powered Health Assessment 
- **Personalized Health Reports**
  - AI-generated health analysis using Google Gemini
  - Environmental impact assessment (AQI, temperature, humidity, UV)
  - Symptom analysis and correlation with environmental conditions
  - Personalized recommendations based on pre-existing conditions
  
- **Comprehensive Health Data Collection**
  - Current symptoms tracking (cough, breathing difficulty, fatigue, etc.)
  - Pre-existing conditions (asthma, COPD, heart disease, allergies)
  - Activity level and outdoor exposure time
  - Age and gender-specific analysis

- **Intelligent Report Generation**
  - Overall health risk assessment (Low/Moderate/High/Severe)
  - Immediate action recommendations for today
  - Long-term health strategies
  - Warning signs to watch for
  - When to seek medical attention
  - Medication considerations

- **Report Management**
  - Save last 10 health reports
  - View report history
  - Print/export reports
  - Track health trends over time

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

## 📁 Project Structure

```
ThermoAQ/
├── client/                      # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/           # Authentication components
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   └── SignupForm.jsx
│   │   │   ├── features/       # Advanced features (Protected)
│   │   │   │   ├── MultiLocationMonitor.jsx
│   │   │   │   ├── AQIAlerts.jsx
│   │   │   │   ├── PollutionHistory.jsx
│   │   │   │   ├── HealthRecommendations.jsx
│   │   │   │   ├── HealthAssessment.jsx    # NEW - AI Health Reports
│   │   │   │   └── ReportDownload.jsx
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
│   │   │       └── Avatar.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── WeatherApp.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── HeatWaveMap.jsx
│   │   │   ├── HealthAdvisory.jsx
│   │   │   ├── HealthAssessmentPage.jsx    # NEW - AI Health Check
│   │   │   ├── AdvancedFeatures.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── DistrictAnalytics.jsx
│   │   ├── services/
│   │   │   ├── weatherService.js  # Weather API integration
│   │   │   └── aqiService.js      # AQI data service
│   │   ├── context/
│   │   │   └── AuthContext.jsx
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
    │   └── User.js              # User schema with health reports
    ├── routes/
    │   ├── auth.js
    │   └── user.js              # Health assessment endpoints
    ├── middleware/
    │   └── auth.js
    ├── services/
    │   └── geminiService.js     # NEW - Gemini AI integration
    ├── server.js
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB 

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

4. **Configure environment variables** (for AI features)
   ```bash
   cd server
   # Create .env file
   cp .env.example .env
   ```
   
   Add your Gemini API key to `.env`:
   ```env
   # Get from: https://makersuite.google.com/app/apikey
   GEMINI_API_KEY=your_gemini_api_key_here
   
   # MongoDB connection
   MONGODB_URI=mongodb://localhost:27017/thermoaq
   
   # JWT Secret
   JWT_SECRET=your_secret_key_here
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

## 🗺️ Available Routes

- `/` - **Home Page** - AQI & Weather widgets overview
- `/dashboard` - **Weather Dashboard** - Complete weather analysis
- `/heatwave` - **Heat Wave Map** - Temperature risk mapping
- `/analytics` - **Analytics Dashboard** - District-level insights
- `/health-advisory` - **Health Advisory** - Environmental health recommendations
- `/health-assessment` - **AI Health Check** - Personalized health reports (Login Required)
- `/advanced` - **Advanced Features** - Multi-location monitoring, alerts, history (Login Required)
- `/profile` - **User Profile** - Manage account settings (Login Required)

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `server` directory:

```env
# MongoDB Database
MONGODB_URI=mongodb://localhost:27017/thermoaq

# JWT Authentication
JWT_SECRET=your_secret_key_here

# Google Gemini AI (for Health Reports)
# Get your API key from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# Server Configuration
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Weather Service
The application uses **Open-Meteo API** which requires no API key. Configuration is in:
```javascript
// client/src/services/weatherService.js
const OPEN_METEO_BASE = 'https://api.open-meteo.com/v1';
const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1';
```

### AI Health Reports
- Uses Google Gemini 1.5 Flash model
- Generates personalized health reports
- Fallback system if API unavailable
- Free tier: 60 requests/minute

### Caching
- **Cache Duration**: 10 minutes
- **Auto-Refresh**: 10-minute intervals
- Prevents excessive API calls
- Improves performance

## 📊 Performance Optimizations

- **React Hooks**: useMemo, useCallback for expensive operations
- **Data Caching**: 10-minute cache to reduce API calls
- **Parallel API Calls**: Promise.all for faster data fetching
- **Lazy Loading**: Components load on demand
- **Optimized Re-renders**: Memoized values and callbacks

## 🙏 Acknowledgments

- **Open-Meteo** - Free weather API
- **OpenStreetMap** - Map data
- **Google Gemini AI** - AI-powered health reports
- **Lucide React** - Icon library
- **Chart.js** - Data visualization
- **Tailwind CSS** - Styling framework
- **React Leaflet** - Interactive maps

---

**Made with ❤️ for environmental awareness and public health** - Empowering communities through intelligent weather monitoring, air quality tracking, and personalized health insights.