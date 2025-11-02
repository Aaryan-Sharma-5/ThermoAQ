import { useEffect, useState, useCallback, useMemo } from 'react'
import { Header } from '../layout/Header'
import { Footer } from '../layout/Footer'
import { GlobalWeatherMap } from '../components/weather/GlobalWeatherMap'
import { HourlyForecast } from '../components/weather/HourlyForecast'
import { OtherCities } from '../components/weather/OtherCities'
import { RainCharts } from '../components/weather/RainCharts'
import { SevenDayForecast } from '../components/weather/SevenDayForecast'
import { StatCards } from '../components/weather/StatCards'
import { StatusBar } from '../components/weather/StatusBar'
import { TodayWeather } from '../components/weather/TodayWeather'
import { TomorrowWeather } from '../components/weather/TomorrowWeather'
import { WeatherAlerts } from '../components/weather/WeatherAlerts'
import { WeatherInsights } from '../components/weather/WeatherInsights'
import { WeeklyForecast } from '../components/weather/WeeklyForecast'
import weatherService from '../services/weatherService'
import aqiService from '../services/aqiService'

export function WeatherApp() {
  const [weatherData, setWeatherData] = useState(null)
  const [forecastData, setForecastData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedLocation, setSelectedLocation] = useState('Mumbai')
  const [multipleCitiesData, setMultipleCitiesData] = useState([])
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [aqiData, setAqiData] = useState(null)

  // Default cities to show - memoized to prevent re-creation
  const defaultCities = useMemo(() => 
    ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad'], 
    []
  )

  // Fetch all weather data
  const fetchWeatherData = useCallback(async (location) => {
    setLoading(true)
    setError(null)
    
    try {
      // Extract city name from "City, State" format if needed
      const cityName = location.includes(',') ? location.split(',')[0].trim() : location

      // Fetch all data in parallel
      const [currentWeather, forecast, multipleCities, aqi] = await Promise.all([
        weatherService.getCurrentWeather(cityName),
        weatherService.getForecast(cityName, 7),
        weatherService.getMultipleCities(defaultCities),
        aqiService.getAirQuality(cityName)
      ])

      setWeatherData(currentWeather)
      setForecastData(forecast)
      setMultipleCitiesData(multipleCities)
      setAqiData(aqi)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Failed to fetch weather data:', error)
      setError('Failed to load weather data. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [defaultCities])

  // Fetch data on component mount and set up auto-refresh
  useEffect(() => {
    fetchWeatherData(selectedLocation)
    
    // Set up auto-refresh every 10 minutes
    let refreshInterval
    if (autoRefresh) {
      refreshInterval = setInterval(() => {
        fetchWeatherData(selectedLocation)
      }, 10 * 60 * 1000) // 10 minutes
    }
    
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval)
      }
    }
  }, [selectedLocation, autoRefresh, fetchWeatherData])

  // Function to handle refresh
  const handleRefresh = () => {
    fetchWeatherData(selectedLocation)
  }

  // Function to handle city updates (add/remove)
  const handleCitiesUpdate = (updatedCities) => {
    setMultipleCitiesData(updatedCities)
  }

  // Function to handle location change
  const handleLocationChange = (location) => {
    setSelectedLocation(location)
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-full min-h-screen text-white bg-black">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-red-400">Weather Service Error</h2>
          <p className="mb-6 text-gray-400">{error}</p>
          <button 
            onClick={() => fetchWeatherData(selectedLocation)}
            className="px-6 py-3 transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen text-white bg-black">
      <Header 
        onLocationChange={handleLocationChange}
        onRefresh={handleRefresh}
      />
      <StatusBar
        lastUpdated={lastUpdated}
        onRefresh={handleRefresh}
        autoRefresh={autoRefresh}
        onToggleAutoRefresh={setAutoRefresh}
        isRefreshing={loading}
      />
      <main className="max-w-[1400px] mx-auto p-4 md:p-6 space-y-6">
        {/* Weather Alerts */}
        <WeatherAlerts weatherData={weatherData} aqiData={aqiData} />
        
        {/* Top Section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <TodayWeather weatherData={weatherData} loading={loading} />
          <div className="space-y-6 lg:col-span-2">
            <WeeklyForecast forecastData={forecastData} loading={loading} />
            <WeatherInsights />
          </div>
        </div>
        {/* Stats Section */}
        <StatCards weatherData={weatherData} loading={loading} />
        {/* Tomorrow and Rain Chart */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TomorrowWeather forecastData={forecastData} loading={loading} />
          </div>
          <RainCharts hourlyData={forecastData?.hourly} forecastData={forecastData} loading={loading} />
        </div>
        {/* Other Cities */}
        <OtherCities 
          multipleCitiesData={multipleCitiesData} 
          loading={loading}
          onCitiesUpdate={handleCitiesUpdate}
        />
        {/* 24-Hour Forecast */}
        <HourlyForecast selectedLocation={selectedLocation} loading={loading} />
        {/* 7-Day Forecast */}
        <SevenDayForecast forecastData={forecastData} loading={loading} />
        {/* Global Weather Map */}
        <GlobalWeatherMap multipleCitiesData={multipleCitiesData} loading={loading} />
      </main>
      <Footer />
    </div>
  )
}

export default WeatherApp