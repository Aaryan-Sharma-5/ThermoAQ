import { ChevronDownIcon, DropletIcon, MapPinIcon, RefreshCwIcon, ThermometerIcon, WindIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { AQITrend } from '../components/analytics/AQITrend'
import { DistrictComparison } from '../components/analytics/DistrictComparison'
import { Forecast } from '../components/analytics/Forecast'
import { Header } from '../components/analytics/Header'
import { PollutantBreakdown } from '../components/analytics/PollutantBreakdown'
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
      <Header location={location} setLocation={setLocation} />
      
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* District Selection Section */}
        <div className="mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-slate-300 mb-2">Select Primary District for Analysis</h2>
                <p className="text-sm text-slate-400">
                  Choose the main district to analyze, then compare it with other districts below
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                {/* District Selector */}
                <div className="relative">
                  <button
                    onClick={() => setIsDistrictSelectorOpen(!isDistrictSelectorOpen)}
                    className="flex items-center gap-3 bg-slate-700 hover:bg-slate-600 px-4 py-3 rounded-lg transition-all duration-200 min-w-[280px] border border-slate-600"
                  >
                    <MapPinIcon className="w-5 h-5 text-blue-400" />
                    <div className="text-left flex-1">
                      <div className="text-white font-medium">{location.split(',')[0]}</div>
                      <div className="text-xs text-slate-400">{location.split(',')[1]}</div>
                    </div>
                    <ChevronDownIcon className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isDistrictSelectorOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isDistrictSelectorOpen && (
                    <div className="absolute top-full left-0 mt-2 bg-slate-800 rounded-lg shadow-xl overflow-hidden z-50 w-full max-h-64 overflow-y-auto border border-slate-600">
                      {availableDistricts.map((district) => (
                        <button
                          key={district}
                          onClick={() => handleDistrictChange(district)}
                          className={`w-full text-left px-4 py-3 transition-colors border-b border-slate-700 last:border-b-0 ${
                            district === location 
                              ? 'bg-slate-700 text-white' 
                              : 'hover:bg-slate-700 text-slate-300'
                          }`}
                        >
                          <div className="font-medium">{district.split(',')[0]}</div>
                          <div className="text-xs text-slate-400">{district.split(',')[1]}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Refresh Button */}
                <button
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 p-3 rounded-lg transition-all duration-200 border border-blue-500"
                  aria-label="Refresh data"
                >
                  <RefreshCwIcon className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

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