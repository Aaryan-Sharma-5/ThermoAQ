import { AlertTriangleIcon, CloudIcon, DropletIcon, GlassWaterIcon, SunIcon, SunMediumIcon, WindIcon } from 'lucide-react'
import { useState } from 'react'
import heatRiskGlobe from '../assets/images/Heat_Risk_Globe.png'
import { PageHeader } from '../components/PageHeader'

export function HealthAdvisory() {
  const [selectedLocation, setSelectedLocation] = useState('Mumbai, Maharashtra')

  const handleLocationChange = (location) => {
    setSelectedLocation(location)
  }

  const handleRefresh = () => {
    // Refresh data logic here
    console.log('Refreshing health advisory data...')
  }

  const chartData = [
    { temp: 30, humidity: 45 },
    { temp: 35, humidity: 50 },
    { temp: 40, humidity: 58 },
    { temp: 45, humidity: 62 },
    { temp: 45, humidity: 68 },
    { temp: 45, humidity: 70 },
  ]

  const advisories = [
    {
      id: 1,
      icon: GlassWaterIcon,
      title: 'Hydration Reminder',
      description: 'Drink water every 15-20 minutes. Avoid caffeine and alcohol.',
      time: '2 minutes ago',
      severity: 'info',
      bgColor: 'from-blue-900/60 to-blue-800/40',
      borderColor: 'border-blue-700/30',
      iconBg: 'bg-blue-500/30',
      iconColor: 'text-blue-300',
      badge: 'INFO',
      badgeBg: 'bg-blue-500/30',
      badgeText: 'text-blue-300',
    },
    {
      id: 2,
      icon: CloudIcon,
      title: 'Air Quality Advisory',
      description: 'Consider wearing a mask outdoors. Air quality may affect sensitive individuals.',
      time: '8 minutes ago',
      severity: 'moderate',
      bgColor: 'from-orange-900/60 to-orange-800/40',
      borderColor: 'border-orange-700/30',
      iconBg: 'bg-orange-500/30',
      iconColor: 'text-orange-300',
      badge: 'MODERATE',
      badgeBg: 'bg-orange-500/30',
      badgeText: 'text-orange-300',
    },
    {
      id: 3,
      icon: SunIcon,
      title: 'UV Risk Warning',
      description: 'UV index is very high. Use SPF 30+ sunscreen and seek shade between 10 AM - 4 PM.',
      time: '15 minutes ago',
      severity: 'high',
      bgColor: 'from-red-900/60 to-red-800/40',
      borderColor: 'border-red-700/30',
      iconBg: 'bg-red-500/30',
      iconColor: 'text-red-300',
      badge: 'HIGH',
      badgeBg: 'bg-red-500',
      badgeText: 'text-white',
    },
  ]

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
                  <div className="text-7xl font-bold text-yellow-400 mb-2">45°C</div>
                  <div className="text-white text-lg mb-1">Feels Like</div>
                  <div className="text-red-300 font-medium">Extreme Heat Warning</div>
                </div>

                <div className="bg-red-500 rounded-xl p-4 mb-6 flex items-start gap-3">
                  <AlertTriangleIcon className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-white font-semibold mb-1">High Risk</div>
                    <div className="text-red-100 text-sm">
                      Avoid prolonged outdoor exposure
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
                  <div className="text-6xl font-bold text-white mb-2">42°C</div>
                  <div className="text-orange-200 text-lg">Partly Cloudy</div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-black/20 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-500/30 p-2 rounded-lg">
                        <SunMediumIcon className="w-5 h-5 text-purple-300" />
                      </div>
                      <span className="text-white">UV Index</span>
                    </div>
                    <span className="text-red-400 font-semibold">9 (Very High)</span>
                  </div>

                  <div className="flex items-center justify-between bg-black/20 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-500/30 p-2 rounded-lg">
                        <DropletIcon className="w-5 h-5 text-blue-300" />
                      </div>
                      <span className="text-white">Humidity</span>
                    </div>
                    <span className="text-blue-400 font-semibold">68%</span>
                  </div>

                  <div className="flex items-center justify-between bg-black/20 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-500/30 p-2 rounded-lg">
                        <WindIcon className="w-5 h-5 text-green-300" />
                      </div>
                      <span className="text-white">Wind</span>
                    </div>
                    <span className="text-green-400 font-semibold">12 km/h</span>
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