import { DropletIcon, ThermometerIcon, WindIcon } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { AQITrend } from '../components/analytics/AQITrend'
import { DistrictComparison } from '../components/analytics/DistrictComparison'
import { Forecast } from '../components/analytics/Forecast'
import { PollutantBreakdown } from '../components/analytics/PollutantBreakdown'
import { HourlyTemperatureGraph } from '../components/charts/HourlyTemperatureGraph'
import { PollutantBreakdownDetailed } from '../components/charts/PollutantBreakdownDetailed'
import { SunMoonTimeline } from '../components/charts/SunMoonTimeline'
import { UVIndexGauge } from '../components/charts/UVIndexGauge'
import { WindCompass } from '../components/charts/WindCompass'
import { Header } from '../layout/Header'
import { Footer } from '../layout/Footer'
import aqiService from '../services/aqiService'
import weatherService from '../services/weatherService'

export function DistrictAnalytics() {
  const [location, setLocation] = useState('Mumbai, Maharashtra')
  const [weatherData, setWeatherData] = useState(null)
  const [aqiData, setAqiData] = useState(null)
  const [forecastData, setForecastData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      const cityName = location.split(',')[0]
      const [weather, aqi, forecast] = await Promise.all([
        weatherService.getCurrentWeather(cityName),
        aqiService.getAirQuality(cityName),
        weatherService.getForecast(cityName, 7)
      ])
      setWeatherData(weather)
      setAqiData(aqi)
      setForecastData(forecast)
    } catch (error) {
      console.error('Failed to load analytics data:', error)
      // Set fallback data
      setWeatherData({
        temperature: 22,
        humidity: 65,
        windStatus: 12,
        windSpeed: 12,
        windDirection: 180,
        uvIndex: 5,
        sunrise: '06:00',
        sunset: '18:00'
      })
      setAqiData({
        aqi: 85,
        level: 'Moderate',
        pollutants: {}
      })
    } finally {
      setIsLoading(false)
    }
  }, [location])

  useEffect(() => {
    loadData()
  }, [loadData])

  return (
    <div className="min-h-screen w-full bg-black text-white">
      <Header onLocationChange={setLocation} />
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* District Title and AQI */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-yellow-400 mb-2">
                {location.split(',')[0]} District
              </h1>
              <p className="text-slate-400 text-lg">
                {isLoading ? (
                  <span className="animate-pulse">Loading...</span>
                ) : (
                  <>
                    <span className="text-white font-semibold">
                      AQI {aqiData?.aqi || 85}
                    </span>{' '}
                    - {aqiData?.level || 'Moderate'}
                  </>
                )}
              </p>
            </div>
            <div className="flex gap-6 text-sm">
              <div className="flex items-center gap-2">
                <ThermometerIcon className="w-4 h-4 text-blue-400" />
                <span>
                  {isLoading ? '...' : `${weatherData?.temperature || 22}°C`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <DropletIcon className="w-4 h-4 text-cyan-400" />
                <span>
                  {isLoading ? '...' : `${weatherData?.humidity || 65}%`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <WindIcon className="w-4 h-4 text-slate-400" />
                <span>
                  {isLoading ? '...' : `${weatherData?.windStatus || 12} km/h`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section - AQI Trend and Forecast */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <AQITrend location={location} />
          <Forecast location={location} />
        </div>

        {/* Pollutant Breakdown */}
        <PollutantBreakdown location={location} />

        {/* Advanced Visualizations - Weather Metrics */}
        <div className="grid grid-cols-1 gap-8 mt-8 lg:grid-cols-3">
          <WindCompass
            windSpeed={weatherData?.windSpeed || 0}
            windDirection={weatherData?.windDirection || 0}
            windGust={weatherData?.windGust}
          />
          <UVIndexGauge uvIndex={weatherData?.uvIndex || 0} />
          <SunMoonTimeline
            sunrise={weatherData?.sunrise || '06:00'}
            sunset={weatherData?.sunset || '18:00'}
            currentTime={new Date()}
          />
        </div>

        {/* Hourly Temperature Graph */}
        <div className="mt-8">
          <HourlyTemperatureGraph hourlyData={forecastData?.hourly} />
        </div>

        {/* Detailed Pollutant Breakdown */}
        <div className="mt-8">
          <PollutantBreakdownDetailed pollutants={aqiData?.pollutants || {}} />
        </div>

        {/* District Comparison */}
        <div className="mt-8">
          <DistrictComparison location={location} />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default DistrictAnalytics