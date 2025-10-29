import { DropletIcon, ThermometerIcon, WindIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { AQITrend } from '../components/analytics/AQITrend'
import { DistrictComparison } from '../components/analytics/DistrictComparison'
import { Forecast } from '../components/analytics/Forecast'
import { PollutantBreakdown } from '../components/analytics/PollutantBreakdown'
import { PageHeader } from '../components/PageHeader'
import aqiService from '../services/aqiService'
import weatherService from '../services/weatherService'

export function DistrictAnalytics() {
  const [location, setLocation] = useState('Mumbai, Maharashtra')
  const [weatherData, setWeatherData] = useState(null)
  const [aqiData, setAqiData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDistrictSelectorOpen, setIsDistrictSelectorOpen] = useState(false)

  const availableDistricts = [
    'Mumbai, Maharashtra',
    'Delhi, Delhi',
    'Kolkata, West Bengal',
    'Bangalore, Karnataka',
    'Chennai, Tamil Nadu',
    'Hyderabad, Telangana',
    'Pune, Maharashtra',
    'Ahmedabad, Gujarat',
    'Jaipur, Rajasthan',
    'Surat, Gujarat',
    'Lucknow, Uttar Pradesh',
    'Kanpur, Uttar Pradesh',
    'Nagpur, Maharashtra',
    'Indore, Madhya Pradesh',
    'Thane, Maharashtra',
    'Bhopal, Madhya Pradesh',
    'Visakhapatnam, Andhra Pradesh',
    'Patna, Bihar',
    'Vadodara, Gujarat',
    'Ludhiana, Punjab'
  ]

  const loadData = async () => {
    setIsLoading(true)
    try {
      const cityName = location.split(',')[0]
      const [weather, aqi] = await Promise.all([
        weatherService.getCurrentWeather(cityName),
        aqiService.getAirQuality(cityName)
      ])
      setWeatherData(weather)
      setAqiData(aqi)
    } catch (error) {
      console.error('Failed to load analytics data:', error)
      // Set fallback data
      setWeatherData({
        temperature: 22,
        humidity: 65,
        windStatus: 12
      })
      setAqiData({
        aqi: 85,
        level: 'Moderate'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDistrictChange = (newLocation) => {
    setLocation(newLocation)
    setIsDistrictSelectorOpen(false)
  }

  const handleRefresh = () => {
    loadData()
  }

  useEffect(() => {
    loadData()
  }, [location])

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white">
      <PageHeader 
        title="District Analytics" 
        selectedLocation={location}
        onLocationChange={setLocation}
        onRefresh={handleRefresh}
      />
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

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <AQITrend location={location} />
          <Forecast location={location} />
        </div>

        {/* Pollutant Breakdown */}
        <PollutantBreakdown location={location} />

        {/* District Comparison */}
        <DistrictComparison location={location} />
      </main>
    </div>
  )
}

export default DistrictAnalytics