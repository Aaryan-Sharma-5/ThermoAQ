import { useEffect, useState } from 'react'
import aqiService from '../../services/aqiService'
import { PollutantCard } from './PollutantCard'

export function PollutantBreakdown({ location }) {
  const [pollutants, setPollutants] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadPollutantData = async () => {
      setIsLoading(true)
      try {
        const cityName = location.split(',')[0]
        const aqiData = await aqiService.getAirQuality(cityName)
        
        const getStatus = (value, thresholds) => {
          if (value <= thresholds.good) return { status: 'Good', color: 'emerald' }
          if (value <= thresholds.moderate) return { status: 'Moderate', color: 'amber' }
          return { status: 'Unhealthy', color: 'red' }
        }

        const pollutantData = [
          {
            name: 'PM₂.₅',
            value: Math.min(100, Math.round((aqiData.pollutants?.pm25 || 35) / 50 * 100)),
            concentration: `${aqiData.pollutants?.pm25 || 35} μg/m³`,
            ...getStatus(aqiData.pollutants?.pm25 || 35, { good: 25, moderate: 50 })
          },
          {
            name: 'PM₁₀',
            value: Math.min(100, Math.round((aqiData.pollutants?.pm10 || 28) / 100 * 100)),
            concentration: `${aqiData.pollutants?.pm10 || 28} μg/m³`,
            ...getStatus(aqiData.pollutants?.pm10 || 28, { good: 50, moderate: 100 })
          },
          {
            name: 'NO₂',
            value: Math.min(100, Math.round((aqiData.pollutants?.no2 || 42) / 80 * 100)),
            concentration: `${aqiData.pollutants?.no2 || 42} μg/m³`,
            ...getStatus(aqiData.pollutants?.no2 || 42, { good: 40, moderate: 80 })
          },
          {
            name: 'CO',
            value: Math.min(100, Math.round((aqiData.pollutants?.co || 1200) / 4000 * 100)),
            concentration: `${((aqiData.pollutants?.co || 1200) / 1000).toFixed(1)} mg/m³`,
            ...getStatus(aqiData.pollutants?.co || 1200, { good: 2000, moderate: 4000 })
          },
          {
            name: 'O₃',
            value: Math.min(100, Math.round((aqiData.pollutants?.o3 || 88) / 160 * 100)),
            concentration: `${aqiData.pollutants?.o3 || 88} μg/m³`,
            ...getStatus(aqiData.pollutants?.o3 || 88, { good: 80, moderate: 160 })
          },
        ]

        setPollutants(pollutantData)
      } catch (error) {
        console.error('Failed to load pollutant data:', error)
        // Fallback data
        setPollutants([
          { name: 'PM₂.₅', value: 32, status: 'Moderate', concentration: '35 μg/m³', color: 'amber' },
          { name: 'PM₁₀', value: 32, status: 'Good', concentration: '28 μg/m³', color: 'emerald' },
          { name: 'NO₂', value: 32, status: 'Unhealthy', concentration: '42 μg/m³', color: 'red' },
          { name: 'CO', value: 32, status: 'Good', concentration: '1.2 mg/m³', color: 'emerald' },
          { name: 'O₃', value: 32, status: 'Moderate', concentration: '88 μg/m³', color: 'amber' },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    loadPollutantData()
  }, [location])

  if (isLoading) {
    return (
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Pollutant Breakdown</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="bg-slate-800 rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-slate-700 rounded mb-4"></div>
              <div className="w-32 h-32 bg-slate-700 rounded-full mb-4 mx-auto"></div>
              <div className="h-4 bg-slate-700 rounded mb-2"></div>
              <div className="h-3 bg-slate-700 rounded"></div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Pollutant Breakdown</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {pollutants.map((pollutant) => (
          <PollutantCard key={pollutant.name} {...pollutant} />
        ))}
      </div>
    </section>
  )
}