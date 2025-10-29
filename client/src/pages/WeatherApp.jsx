import { useEffect, useState } from 'react'
import { GlobalWeatherMap } from '../components/weather/GlobalWeatherMap'
import { Header } from '../components/weather/Header'
import { HourlyForecast } from '../components/weather/HourlyForecast'
import { OtherCities } from '../components/weather/OtherCities'
import { RainCharts } from '../components/weather/RainCharts'
import { SevenDayForecast } from '../components/weather/SevenDayForecast'
import { StatCards } from '../components/weather/StatCards'
import { TodayWeather } from '../components/weather/TodayWeather'
import { TomorrowWeather } from '../components/weather/TomorrowWeather'
import { WeatherInsights } from '../components/weather/WeatherInsights'
import { WeeklyForecast } from '../components/weather/WeeklyForecast'
import weatherService from '../services/weatherService'

export function WeatherApp() {
  const [weatherData, setWeatherData] = useState(null)
  const [forecastData, setForecastData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedLocation, setSelectedLocation] = useState('Mumbai')
  const [multipleCitiesData, setMultipleCitiesData] = useState([])
  const [error, setError] = useState(null)

  // Function to handle location change
  const handleLocationChange = (location) => {
    setSelectedLocation(location)
    fetchWeatherData(location)
  }

  // Fetch all weather data
  const fetchWeatherData = async (location) => {
    setLoading(true)
    setError(null)
    
    try {
      // Extract city name from "City, State" format if needed
      const cityName = location.includes(',') ? location.split(',')[0].trim() : location

      // Fetch all data in parallel
      const [currentWeather, forecast, multipleCities] = await Promise.all([
        weatherService.getCurrentWeather(cityName),
        weatherService.getForecast(cityName, 7),
        weatherService.getMultipleCities(['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad'])
      ])

      setWeatherData(currentWeather)
      setForecastData(forecast)
      setMultipleCitiesData(multipleCities)
    } catch (error) {
      console.error('Failed to fetch weather data:', error)
      setError('Failed to load weather data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Fetch data on component mount
  useEffect(() => {
    fetchWeatherData(selectedLocation)
  }, [])

  if (error) {
    return (
      <div className="w-full min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-400">Weather Service Error</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button 
            onClick={() => fetchWeatherData(selectedLocation)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-black text-white">
      <Header 
        onLocationChange={handleLocationChange} 
        selectedLocation={selectedLocation}
        weatherData={weatherData}
      />
      <main className="max-w-[1400px] mx-auto p-4 md:p-6 space-y-6">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <TodayWeather weatherData={weatherData} loading={loading} />
          <div className="lg:col-span-2 space-y-6">
            <WeeklyForecast forecastData={forecastData} loading={loading} />
            <WeatherInsights />
          </div>
        </div>
        {/* Stats Section */}
        <StatCards weatherData={weatherData} loading={loading} />
        {/* Tomorrow and Rain Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TomorrowWeather forecastData={forecastData} loading={loading} />
          </div>
          <RainCharts forecastData={forecastData} loading={loading} />
        </div>
        {/* Other Cities */}
        <OtherCities multipleCitiesData={multipleCitiesData} loading={loading} />
        {/* 24-Hour Forecast */}
        <HourlyForecast selectedLocation={selectedLocation} loading={loading} />
        {/* 7-Day Forecast */}
        <SevenDayForecast forecastData={forecastData} loading={loading} />
        {/* Global Weather Map */}
        <GlobalWeatherMap multipleCitiesData={multipleCitiesData} loading={loading} />
      </main>
    </div>
  )
}

export default WeatherApp