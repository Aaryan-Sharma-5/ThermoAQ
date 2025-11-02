import { AlertTriangleIcon, CloudIcon, DropletIcon, GlassWaterIcon, SunIcon, SunMediumIcon, WindIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import heatRiskGlobe from '../assets/images/Heat_Risk_Globe.png'
import { AQIAlerts } from '../components/features/AQIAlerts'
import { HealthRecommendations } from '../components/features/HealthRecommendations'
import { Header } from '../layout/Header'
import { Footer } from '../layout/Footer'
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
    loadHealthData(selectedLocation)
  }

  // Calculate heat index based on temperature and humidity
  const calculateHeatIndex = (temp, humidity) => {
    // If no data available, return a safe default
    if (!temp) return 25
    if (!humidity) return temp
    
    const T = temp
    const H = humidity
    
    // Heat index only applies when temperature is >= 27°C (80°F)
    // For lower temperatures, just return the actual temperature
    if (T < 27) {
      return Math.round(T)
    }
    
    // Use the complete heat index formula for high temperatures
    // This is the Rothfusz regression formula
    const HI = -8.78469475556 + 
               1.61139411 * T + 
               2.33854883889 * H + 
               -0.14611605 * T * H + 
               -0.012308094 * T * T + 
               -0.0164248277778 * H * H + 
               0.00022475541 * T * T * H + 
               -0.00000687097 * T * H * H + 
               0.0000000848106 * T * T * H * H
    
    // Ensure result is reasonable (shouldn't be less than actual temp)
    const result = Math.max(Math.round(HI), Math.round(T))
    
    return result
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
    
    return forecastData.daily.map(day => ({
      temp: day.high,
      humidity: day.humidity || 65
    }))
  }

  // Generate health advisories based on real data
  const generateAdvisories = () => {
    const advisories = []
    const currentTemp = weatherData?.temperature || 25
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
      <div className="relative min-h-screen overflow-hidden text-white bg-black">
        <Header onLocationChange={handleLocationChange} />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-blue-400 rounded-full animate-spin"></div>
            <p className="text-lg text-gray-400">Loading health advisory data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="relative min-h-screen overflow-hidden text-white bg-black">
        <Header onLocationChange={handleLocationChange} />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="mb-4 text-lg text-red-400">{error}</div>
            <button 
              onClick={handleRefresh}
              className="px-6 py-3 transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden text-white bg-black">
      {/* Header */}
      <Header onLocationChange={handleLocationChange} />

      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-center bg-no-repeat bg-cover opacity-30 -z-10"
        style={{
          backgroundImage: `url(${heatRiskGlobe})`,
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <main className="px-6 py-8 mx-auto max-w-7xl">
          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-3">
            {/* Heat Index Card */}
            <div className="lg:col-span-2">
              <div className="h-full p-6 border bg-gradient-to-br from-red-900/60 to-red-800/40 rounded-2xl backdrop-blur-sm border-red-800/30">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">Heat Index</h2>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-400">Live</span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="mb-2 font-bold text-yellow-400 text-7xl">
                    {heatIndex}°C
                  </div>
                  <div className="mb-1 text-lg text-white">Feels Like</div>
                  <div className={`font-medium ${riskLevel.color}`}>
                    {riskLevel.level}
                  </div>
                </div>

                <div className={`${riskLevel.bgColor} rounded-xl p-4 mb-6 flex items-start gap-3`}>
                  <AlertTriangleIcon className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="mb-1 font-semibold text-white">{riskLevel.level}</div>
                    <div className="text-sm text-white">
                      {riskLevel.level === 'Extreme Risk' ? 'Stay indoors. Avoid all outdoor activities.' :
                       riskLevel.level === 'High Risk' ? 'Limit outdoor exposure. Take frequent breaks.' :
                       riskLevel.level === 'Moderate Risk' ? 'Take precautions when outdoors.' :
                       'Safe for normal outdoor activities.'}
                    </div>
                  </div>
                </div>

                <div className="relative p-4 bg-black/20 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-white">Humidity vs Temperature</h3>
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
                          className="transition-all cursor-pointer hover:r-6"
                        />
                      ))}
                    </svg>
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between mt-2 text-xs text-gray-400">
                      <span>30</span>
                      <span>35</span>
                      <span>40</span>
                      <span>45</span>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-center text-gray-400">
                    Temperature (°C)
                  </div>
                  <div className="absolute left-0 text-xs text-gray-400 origin-center -rotate-90 -translate-y-1/2 top-1/2 whitespace-nowrap">
                    Humidity (%)
                  </div>
                </div>
              </div>
            </div>

            {/* Weather Snapshot Card */}
            <div className="lg:col-span-1">
              <div className="h-full p-6 border bg-gradient-to-br from-orange-900/60 to-orange-700/40 rounded-2xl backdrop-blur-sm border-orange-800/30">
                <h2 className="mb-6 text-xl font-semibold text-white">
                  Weather Snapshot
                </h2>

                <div className="flex flex-col items-center mb-8">
                  <SunIcon className="w-20 h-20 mb-4 text-yellow-400" />
                  <div className="mb-2 text-6xl font-bold text-white">
                    {weatherData?.temperature || 25}°C
                  </div>
                  <div className="text-lg text-orange-200">
                    {weatherData?.condition || 'Pleasant'}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-black/20">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-500/30">
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

                  <div className="flex items-center justify-between p-4 rounded-lg bg-black/20">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-500/30">
                        <DropletIcon className="w-5 h-5 text-blue-300" />
                      </div>
                      <span className="text-white">Humidity</span>
                    </div>
                    <span className="font-semibold text-blue-400">
                      {weatherData?.humidity || 65}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-black/20">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-green-500/30">
                        <WindIcon className="w-5 h-5 text-green-300" />
                      </div>
                      <span className="text-white">Wind</span>
                    </div>
                    <span className="font-semibold text-green-400">
                      {weatherData?.windStatus || 12} km/h
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Advisories Section */}
          <section
            className="p-8 mb-6 border bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-2xl backdrop-blur-sm border-gray-700/50"
            role="region"
            aria-label="Active Advisories"
          >
            <h2 className="mb-6 text-2xl font-bold text-white">Active Advisories</h2>
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
                      <div className="flex items-start flex-1 gap-4">
                        <div className={`${advisory.iconBg} p-3 rounded-lg flex-shrink-0`}>
                          <Icon className={`w-6 h-6 ${advisory.iconColor}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="mb-2 text-lg font-semibold text-white">
                            {advisory.title}
                          </h3>
                          <p className="mb-3 text-sm text-gray-300">
                            {advisory.description}
                          </p>
                          <span className="text-xs text-gray-400">
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

          {/* Health Recommendations & AQI Alerts Section */}
          <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
            <HealthRecommendations />
            <AQIAlerts />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default HealthAdvisory