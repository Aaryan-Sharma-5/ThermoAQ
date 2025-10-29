import { ChevronDownIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'
import aqiService from '../../services/aqiService'

export function DistrictComparison({ location }) {
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [combinedData, setCombinedData] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const districts = [
    'Delhi, Delhi',
    'Mumbai, Maharashtra', 
    'Bangalore, Karnataka',
    'Chennai, Tamil Nadu',
    'Kolkata, West Bengal',
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

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const currentCityName = location.split(',')[0]
        const currentAqiData = await aqiService.getAirQuality(currentCityName)
        
        let compareAqiData = null
        if (selectedDistrict) {
          const compareCityName = selectedDistrict.split(',')[0]
          compareAqiData = await aqiService.getAirQuality(compareCityName)
        }
        
        const pollutants = ['PM2.5', 'PM10', 'NO2', 'CO', 'O3']
        
        const combinedChartData = pollutants.map(pollutant => {
          let currentValue, compareValue
          
          switch(pollutant) {
            case 'PM2.5':
              currentValue = currentAqiData.pollutants?.pm25 || 35
              compareValue = compareAqiData?.pollutants?.pm25 || 0
              break
            case 'PM10':
              currentValue = currentAqiData.pollutants?.pm10 || 28
              compareValue = compareAqiData?.pollutants?.pm10 || 0
              break
            case 'NO2':
              currentValue = currentAqiData.pollutants?.no2 || 42
              compareValue = compareAqiData?.pollutants?.no2 || 0
              break
            case 'CO':
              currentValue = (currentAqiData.pollutants?.co || 1200) / 1000
              compareValue = compareAqiData ? (compareAqiData.pollutants?.co || 1200) / 1000 : 0
              break
            case 'O3':
              currentValue = currentAqiData.pollutants?.o3 || 88
              compareValue = compareAqiData?.pollutants?.o3 || 0
              break
            default:
              currentValue = 0
              compareValue = 0
          }
          
          return {
            name: pollutant,
            [currentCityName]: currentValue,
            [selectedDistrict ? selectedDistrict.split(',')[0] : 'None']: compareValue
          }
        })
        
        setCombinedData(combinedChartData)
      } catch (error) {
        console.error('Failed to load district comparison data:', error)
        const currentCityName = location.split(',')[0]
        const compareCityName = selectedDistrict ? selectedDistrict.split(',')[0] : 'None'
        
        setCombinedData([
          { name: 'PM2.5', [currentCityName]: 35, [compareCityName]: selectedDistrict ? 25 : 0 },
          { name: 'PM10', [currentCityName]: 28, [compareCityName]: selectedDistrict ? 35 : 0 },
          { name: 'NO2', [currentCityName]: 42, [compareCityName]: selectedDistrict ? 30 : 0 },
          { name: 'CO', [currentCityName]: 1.2, [compareCityName]: selectedDistrict ? 0.8 : 0 },
          { name: 'O3', [currentCityName]: 88, [compareCityName]: selectedDistrict ? 70 : 0 },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [location, selectedDistrict])

  return (
    <section className="mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold">District Comparison</h2>
          <p className="text-slate-400 text-sm mt-1">
            Compare pollutant levels between {location.split(',')[0]} and another district
          </p>
        </div>
        <div className="relative">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-3 bg-slate-700 hover:bg-slate-600 px-4 py-3 rounded-lg transition-all duration-200 min-w-[240px] border border-slate-600"
          >
            <span className="text-sm flex-1 text-left">
              {selectedDistrict || 'Select District to Compare'}
            </span>
            <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isOpen && (
            <div className="absolute top-full right-0 mt-2 bg-slate-800 rounded-lg shadow-xl overflow-hidden z-50 min-w-[280px] max-h-64 overflow-y-auto border border-slate-600">
              {districts.filter(district => district !== location).map((district) => (
                <button
                  key={district}
                  onClick={() => {
                    setSelectedDistrict(district)
                    setIsOpen(false)
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-slate-700 transition-colors text-white border-b border-slate-700 last:border-b-0"
                >
                  <div className="font-medium">{district.split(',')[0]}</div>
                  <div className="text-xs text-slate-400">{district.split(',')[1]}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-slate-800 rounded-xl p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-center">
            Pollutant Level Comparison
          </h3>
          <p className="text-slate-400 text-sm text-center">
            {selectedDistrict 
              ? `Comparing ${location.split(',')[0]} vs ${selectedDistrict.split(',')[0]}`
              : `Select a district to compare with ${location.split(',')[0]}`
            }
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          </div>
        ) : (
          <div>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={combinedData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  stroke="#94a3b8"
                  label={{
                    value: 'Concentration (μg/m³)',
                    angle: -90,
                    position: 'insideLeft',
                    fill: '#94a3b8',
                  }}
                  style={{ fontSize: '12px' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={(value, name) => [
                    `${typeof value === 'number' ? value.toFixed(1) : value} ${name.includes('CO') ? 'mg/m³' : 'μg/m³'}`,
                    name
                  ]}
                />
                <Bar 
                  dataKey={location.split(',')[0]} 
                  fill="#60a5fa" 
                  radius={[4, 4, 0, 0]}
                  name={location.split(',')[0]}
                />
                {selectedDistrict && (
                  <Bar 
                    dataKey={selectedDistrict.split(',')[0]} 
                    fill="#8b5cf6" 
                    radius={[4, 4, 0, 0]}
                    name={selectedDistrict.split(',')[0]}
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
            
            <div className="flex items-center justify-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-blue-400"></div>
                <span className="text-sm text-slate-300">{location.split(',')[0]}</span>
              </div>
              {selectedDistrict && (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-purple-500"></div>
                  <span className="text-sm text-slate-300">{selectedDistrict.split(',')[0]}</span>
                </div>
              )}
            </div>
            
            {!selectedDistrict && (
              <div className="text-center mt-8 p-6 bg-slate-700/50 rounded-lg">
                <p className="text-slate-400">
                  Select a district from the dropdown above to see comparison data
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}