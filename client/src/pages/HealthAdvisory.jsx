import { AlertTriangleIcon, CloudIcon, DropletIcon, GlassWaterIcon, SunIcon, SunMediumIcon, WindIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import heatRiskGlobe from '../assets/images/Heat_Risk_Globe.png'
import { PageHeader } from '../components/PageHeader'
import aqiService from '../services/aqiService'
import weatherService from '../services/weatherService'

export function HealthAdvisory() {
  const [selectedLocation, setSelectedLocation] = useState('Mumbai, Maharashtra')
  const [weatherData, setWeatherData] = useState(null)
  const [aqiData, setAqiData] = useState(null)
  const [forecastData, setForecastData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadHealthData = async (location) => {
    setLoading(true)
    setError(null)
    
    try {
      const cityName = location.split(',')[0].trim()
      
      // Fetch weather and AQI data in parallel
      const [weather, aqi, forecast] = await Promise.all([
        weatherService.getCurrentWeather(cityName),
        aqiService.getAirQuality(cityName),
        weatherService.getForecast(cityName, 7)
      ])
      
      setWeatherData(weather)
      setAqiData(aqi)
      setForecastData(forecast)
      
    } catch (error) {
      console.error('Failed to load health advisory data:', error)
      setError('Failed to load environmental data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadHealthData(selectedLocation)
  }, [selectedLocation])

  const handleLocationChange = (location) => {
    setSelectedLocation(location)
  }

  const handleRefresh = () => {
    // Refresh data logic here
    console.log('Refreshing health advisory data...')
    loadHealthData(selectedLocation)
  }

  // Calculate heat index based on temperature and humidity
  const calculateHeatIndex = (temp, humidity) => {
    if (!temp || !humidity) return temp || 30
    
    // Simplified heat index calculation
    const T = temp
    const H = humidity
    
    if (T >= 27) {
      const HI = -8.78469475556 + 
                 1.61139411 * T + 
                 2.33854883889 * H + 
                 -0.14611605 * T * H + 
                 -0.012308094 * T * T + 
                 -0.0164248277778 * H * H
      return Math.round(HI)
    }
    
    return temp
  }

  // Generate dynamic chart data based on forecast
  const generateChartData = () => {
    if (!forecastData?.daily) {
      return [
        { temp: 30, humidity: 45 },
        { temp: 35, humidity: 50 },
        { temp: 40, humidity: 58 },
        { temp: 45, humidity: 62 },
        { temp: 45, humidity: 68 },
        { temp: 45, humidity: 70 },
      ]
    }
    
    return forecastData.daily.slice(0, 6).map(day => ({
      temp: day.high,
      humidity: day.humidity || 65
    }))
  }

  // Generate health advisories based on real data
  const generateAdvisories = () => {
    const advisories = []
    const currentTemp = weatherData?.temperature || 25
    const currentHumidity = weatherData?.humidity || 65
    const currentAQI = aqiData?.aqi || 50
    const uvIndex = weatherData?.uvIndex || 5
    
    // Temperature-based advisory
    if (currentTemp > 35) {
      advisories.push({
        id: 1,
        icon: GlassWaterIcon,
        title: 'Heat Warning - Stay Hydrated',
        description: `Temperature is ${currentTemp}°C. Drink water every 15-20 minutes. Avoid outdoor activities during peak hours.`,
        time: 'Live data',
        severity: 'high',
        bgColor: 'from-red-900/60 to-red-800/40',
        borderColor: 'border-red-700/30',
        iconBg: 'bg-red-500/30',
        iconColor: 'text-red-300',
        badge: 'HIGH',
        badgeBg: 'bg-red-500',
        badgeText: 'text-white',
      })
    } else if (currentTemp > 30) {
      advisories.push({
        id: 1,
        icon: GlassWaterIcon,
        title: 'Hydration Reminder',
        description: `Temperature is ${currentTemp}°C. Stay hydrated and take breaks in shade.`,
        time: 'Live data',
        severity: 'moderate',
        bgColor: 'from-orange-900/60 to-orange-800/40',
        borderColor: 'border-orange-700/30',
        iconBg: 'bg-orange-500/30',
        iconColor: 'text-orange-300',
        badge: 'MODERATE',
        badgeBg: 'bg-orange-500/30',
        badgeText: 'text-orange-300',
      })
    }
    
    // AQI-based advisory
    if (currentAQI > 150) {
      advisories.push({
        id: 2,
        icon: CloudIcon,
        title: 'Poor Air Quality Alert',
        description: `AQI is ${currentAQI} (Unhealthy). Avoid outdoor activities. Wear N95 mask if you must go outside.`,
        time: 'Live data',
        severity: 'high',
        bgColor: 'from-red-900/60 to-red-800/40',
        borderColor: 'border-red-700/30',
        iconBg: 'bg-red-500/30',
        iconColor: 'text-red-300',
        badge: 'HIGH',
        badgeBg: 'bg-red-500',
        badgeText: 'text-white',
      })
    } else if (currentAQI > 100) {
      advisories.push({
        id: 2,
        icon: CloudIcon,
        title: 'Air Quality Advisory',
        description: `AQI is ${currentAQI} (Moderate). Consider wearing a mask outdoors. Sensitive individuals should limit exposure.`,
        time: 'Live data',
        severity: 'moderate',
        bgColor: 'from-orange-900/60 to-orange-800/40',
        borderColor: 'border-orange-700/30',
        iconBg: 'bg-orange-500/30',
        iconColor: 'text-orange-300',
        badge: 'MODERATE',
        badgeBg: 'bg-orange-500/30',
        badgeText: 'text-orange-300',
      })
    }
    
    // UV Index advisory
    if (uvIndex > 7) {
      advisories.push({
        id: 3,
        icon: SunIcon,
        title: 'High UV Risk Warning',
        description: `UV index is ${uvIndex} (Very High). Use SPF 50+ sunscreen. Seek shade between 10 AM - 4 PM.`,
        time: 'Live data',
        severity: 'high',
        bgColor: 'from-purple-900/60 to-purple-800/40',
        borderColor: 'border-purple-700/30',
        iconBg: 'bg-purple-500/30',
        iconColor: 'text-purple-300',
        badge: 'HIGH UV',
        badgeBg: 'bg-purple-500',
        badgeText: 'text-white',
      })
    } else if (uvIndex > 5) {
      advisories.push({
        id: 3,
        icon: SunIcon,
        title: 'UV Protection Recommended',
        description: `UV index is ${uvIndex} (Moderate). Use SPF 30+ sunscreen and wear protective clothing.`,
        time: 'Live data',
        severity: 'info',
        bgColor: 'from-blue-900/60 to-blue-800/40',
        borderColor: 'border-blue-700/30',
        iconBg: 'bg-blue-500/30',
        iconColor: 'text-blue-300',
        badge: 'INFO',
        badgeBg: 'bg-blue-500/30',
        badgeText: 'text-blue-300',
      })
    }
    
    // If no specific advisories, add general health tip
    if (advisories.length === 0) {
      advisories.push({
        id: 4,
        icon: GlassWaterIcon,
        title: 'General Health Reminder',
        description: 'Weather conditions are favorable. Stay hydrated and maintain regular outdoor activities.',
        time: 'Live data',
        severity: 'info',
        bgColor: 'from-green-900/60 to-green-800/40',
        borderColor: 'border-green-700/30',
        iconBg: 'bg-green-500/30',
        iconColor: 'text-green-300',
        badge: 'GOOD',
        badgeBg: 'bg-green-500/30',
        badgeText: 'text-green-300',
      })
    }
    
    return advisories
  }

  const chartData = generateChartData()
  const advisories = generateAdvisories()
  const heatIndex = calculateHeatIndex(weatherData?.temperature, weatherData?.humidity)
  
  // Determine risk level based on multiple factors
  const getRiskLevel = () => {
    const temp = weatherData?.temperature || 25
    const aqi = aqiData?.aqi || 50
    const uvIndex = weatherData?.uvIndex || 5
    
    if (temp > 38 || aqi > 200 || uvIndex > 9) {
      return { level: 'Extreme Risk', color: 'text-red-400', bgColor: 'bg-red-500' }
    } else if (temp > 35 || aqi > 150 || uvIndex > 7) {
      return { level: 'High Risk', color: 'text-orange-400', bgColor: 'bg-orange-500' }
    } else if (temp > 30 || aqi > 100 || uvIndex > 5) {
      return { level: 'Moderate Risk', color: 'text-yellow-400', bgColor: 'bg-yellow-500' }
    }
    return { level: 'Low Risk', color: 'text-green-400', bgColor: 'bg-green-500' }
  }

  const riskLevel = getRiskLevel()

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        <PageHeader 
          title="Heat Risk Advisory" 
          selectedLocation={selectedLocation}
          onLocationChange={handleLocationChange}
          onRefresh={handleRefresh}
        />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-lg text-gray-400">Loading health advisory data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        <PageHeader 
          title="Heat Risk Advisory" 
          selectedLocation={selectedLocation}
          onLocationChange={handleLocationChange}
          onRefresh={handleRefresh}
        />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="text-red-400 text-lg mb-4">{error}</div>
            <button 
              onClick={handleRefresh}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Header */}
      <PageHeader 
        title="Heat Risk Advisory" 
        selectedLocation={selectedLocation}
        onLocationChange={handleLocationChange}
        onRefresh={handleRefresh}
      />

      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 -z-10"
        style={{
          backgroundImage: `url(${heatRiskGlobe})`,
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Heat Index Card */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-red-900/60 to-red-800/40 rounded-2xl p-6 backdrop-blur-sm border border-red-800/30 h-full">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">Heat Index</h2>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm font-medium">Live</span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="text-7xl font-bold text-yellow-400 mb-2">
                    {heatIndex}°C
                  </div>
                  <div className="text-white text-lg mb-1">Feels Like</div>
                  <div className={`font-medium ${riskLevel.color}`}>
                    {riskLevel.level}
                  </div>
                </div>

                <div className={`${riskLevel.bgColor} rounded-xl p-4 mb-6 flex items-start gap-3`}>
                  <AlertTriangleIcon className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-white font-semibold mb-1">{riskLevel.level}</div>
                    <div className="text-white text-sm">
                      {riskLevel.level === 'Extreme Risk' ? 'Stay indoors. Avoid all outdoor activities.' :
                       riskLevel.level === 'High Risk' ? 'Limit outdoor exposure. Take frequent breaks.' :
                       riskLevel.level === 'Moderate Risk' ? 'Take precautions when outdoors.' :
                       'Safe for normal outdoor activities.'}
                    </div>
                  </div>
                </div>

                <div className="bg-black/20 rounded-xl p-4 relative">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-medium">Humidity vs Temperature</h3>
                  </div>
                  <div className="relative h-32">
                    <svg
                      className="w-full h-full"
                      viewBox="0 0 300 100"
                      preserveAspectRatio="none"
                    >
                      <defs>
                        <linearGradient
                          id="lineGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="0%"
                        >
                          <stop offset="0%" stopColor="#fbbf24" />
                          <stop offset="100%" stopColor="#f97316" />
                        </linearGradient>
                      </defs>
                      <polyline
                        points={chartData
                          .map((d, i) => `${i * 60},${100 - d.humidity}`)
                          .join(' ')}
                        fill="none"
                        stroke="url(#lineGradient)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {chartData.map((d, i) => (
                        <circle
                          key={i}
                          cx={i * 60}
                          cy={100 - d.humidity}
                          r="4"
                          fill="#f97316"
                          className="hover:r-6 transition-all cursor-pointer"
                        />
                      ))}
                    </svg>
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-400 mt-2">
                      <span>30</span>
                      <span>35</span>
                      <span>40</span>
                      <span>45</span>
                    </div>
                  </div>
                  <div className="text-center text-xs text-gray-400 mt-3">
                    Temperature (°C)
                  </div>
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-gray-400 whitespace-nowrap origin-center">
                    Humidity (%)
                  </div>
                </div>
              </div>
            </div>

            {/* Weather Snapshot Card */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-orange-900/60 to-orange-700/40 rounded-2xl p-6 backdrop-blur-sm border border-orange-800/30 h-full">
                <h2 className="text-xl font-semibold text-white mb-6">
                  Weather Snapshot
                </h2>

                <div className="flex flex-col items-center mb-8">
                  <SunIcon className="w-20 h-20 text-yellow-400 mb-4" />
                  <div className="text-6xl font-bold text-white mb-2">
                    {weatherData?.temperature || 25}°C
                  </div>
                  <div className="text-orange-200 text-lg">
                    {weatherData?.condition || 'Pleasant'}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-black/20 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-500/30 p-2 rounded-lg">
                        <SunMediumIcon className="w-5 h-5 text-purple-300" />
                      </div>
                      <span className="text-white">UV Index</span>
                    </div>
                    <span className={`font-semibold ${
                      (weatherData?.uvIndex || 5) > 7 ? 'text-red-400' :
                      (weatherData?.uvIndex || 5) > 5 ? 'text-orange-400' :
                      'text-green-400'
                    }`}>
                      {weatherData?.uvIndex || 5} ({
                        (weatherData?.uvIndex || 5) > 7 ? 'Very High' :
                        (weatherData?.uvIndex || 5) > 5 ? 'Moderate' :
                        'Low'
                      })
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-black/20 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-500/30 p-2 rounded-lg">
                        <DropletIcon className="w-5 h-5 text-blue-300" />
                      </div>
                      <span className="text-white">Humidity</span>
                    </div>
                    <span className="text-blue-400 font-semibold">
                      {weatherData?.humidity || 65}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-black/20 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-500/30 p-2 rounded-lg">
                        <WindIcon className="w-5 h-5 text-green-300" />
                      </div>
                      <span className="text-white">Wind</span>
                    </div>
                    <span className="text-green-400 font-semibold">
                      {weatherData?.windStatus || 12} km/h
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Advisories Section */}
          <section
            className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-2xl p-8 backdrop-blur-sm border border-gray-700/50"
            role="region"
            aria-label="Active Advisories"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Active Advisories</h2>
            <div className="space-y-4">
              {advisories.map((advisory) => {
                const Icon = advisory.icon
                return (
                  <article
                    key={advisory.id}
                    className={`bg-gradient-to-br ${advisory.bgColor} rounded-xl p-6 backdrop-blur-sm border ${advisory.borderColor} hover:scale-[1.02] transition-transform cursor-pointer`}
                    role="alert"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`${advisory.iconBg} p-3 rounded-lg flex-shrink-0`}>
                          <Icon className={`w-6 h-6 ${advisory.iconColor}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-semibold text-lg mb-2">
                            {advisory.title}
                          </h3>
                          <p className="text-gray-300 text-sm mb-3">
                            {advisory.description}
                          </p>
                          <span className="text-gray-400 text-xs">
                            {advisory.time}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`${advisory.badgeBg} ${advisory.badgeText} text-xs font-semibold px-3 py-1 rounded-full`}
                      >
                        {advisory.badge}
                      </span>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default HealthAdvisory