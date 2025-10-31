import { Activity, AlertTriangle, Heart, Info, Wind } from 'lucide-react';
import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export function PollutantBreakdownDetailed({ pollutants = {} }) {
  const pollutantData = useMemo(() => {
    const data = [
      {
        name: 'PM2.5',
        value: pollutants.pm25 || 0,
        icon: Wind,
        unit: 'μg/m³',
        limit: 25,
        description: 'Fine particles that can penetrate deep into lungs',
        healthEffects: 'Respiratory issues, heart disease risk',
        sources: 'Vehicle emissions, industrial processes, wildfires'
      },
      {
        name: 'PM10',
        value: pollutants.pm10 || 0,
        icon: Wind,
        unit: 'μg/m³',
        limit: 50,
        description: 'Coarse particles from dust and construction',
        healthEffects: 'Breathing difficulties, lung irritation',
        sources: 'Dust, pollen, construction, agriculture'
      },
      {
        name: 'O₃',
        value: pollutants.o3 || 0,
        icon: Activity,
        unit: 'μg/m³',
        limit: 100,
        description: 'Ground-level ozone, harmful to breathe',
        healthEffects: 'Asthma, reduced lung function',
        sources: 'Sunlight reaction with pollutants'
      },
      {
        name: 'NO₂',
        value: pollutants.no2 || 0,
        icon: Activity,
        unit: 'μg/m³',
        limit: 40,
        description: 'Nitrogen dioxide from combustion',
        healthEffects: 'Airway inflammation, asthma attacks',
        sources: 'Vehicles, power plants, industrial'
      },
      {
        name: 'SO₂',
        value: pollutants.so2 || 0,
        icon: Activity,
        unit: 'μg/m³',
        limit: 20,
        description: 'Sulfur dioxide from burning fossil fuels',
        healthEffects: 'Breathing problems, respiratory diseases',
        sources: 'Power plants, industrial facilities'
      },
      {
        name: 'CO',
        value: pollutants.co || 0,
        icon: Heart,
        unit: 'μg/m³',
        limit: 10000,
        description: 'Carbon monoxide, reduces oxygen delivery',
        healthEffects: 'Headaches, dizziness, heart issues',
        sources: 'Vehicle emissions, incomplete combustion'
      }
    ];

    return data.map(item => ({
      ...item,
      percentage: Math.min(100, (item.value / item.limit) * 100),
      status: item.value <= item.limit * 0.5 ? 'good' : 
              item.value <= item.limit ? 'moderate' : 
              item.value <= item.limit * 2 ? 'unhealthy' : 'hazardous',
      color: item.value <= item.limit * 0.5 ? '#10b981' : 
             item.value <= item.limit ? '#f59e0b' : 
             item.value <= item.limit * 2 ? '#f97316' : '#ef4444'
    }));
  }, [pollutants]);

  const overallAQI = useMemo(() => {
    // Simplified AQI calculation based on PM2.5
    const pm25 = pollutants.pm25 || 0;
    if (pm25 <= 12) return { value: 50, level: 'Good', color: '#10b981' };
    if (pm25 <= 35) return { value: 100, level: 'Moderate', color: '#f59e0b' };
    if (pm25 <= 55) return { value: 150, level: 'Unhealthy for Sensitive', color: '#f97316' };
    if (pm25 <= 150) return { value: 200, level: 'Unhealthy', color: '#ef4444' };
    if (pm25 <= 250) return { value: 300, level: 'Very Unhealthy', color: '#dc2626' };
    return { value: 400, level: 'Hazardous', color: '#991b1b' };
  }, [pollutants]);

  const healthRecommendations = useMemo(() => {
    const level = overallAQI.level;
    
    const recommendations = {
      'Good': {
        general: 'Air quality is satisfactory. Enjoy outdoor activities!',
        sensitive: 'No special precautions needed.',
        outdoor: '✅ Perfect for outdoor activities'
      },
      'Moderate': {
        general: 'Air quality is acceptable. Sensitive groups should limit prolonged outdoor exertion.',
        sensitive: 'Consider reducing prolonged outdoor activities.',
        outdoor: '⚠️ Generally safe, limit strenuous activities'
      },
      'Unhealthy for Sensitive': {
        general: 'Sensitive groups should reduce outdoor activities.',
        sensitive: 'Avoid prolonged outdoor exertion. Wear a mask if necessary.',
        outdoor: '⚠️ Limit outdoor activities for sensitive groups'
      },
      'Unhealthy': {
        general: 'Everyone should reduce outdoor activities.',
        sensitive: 'Avoid outdoor activities. Stay indoors with air purifier.',
        outdoor: '❌ Reduce outdoor exposure for everyone'
      },
      'Very Unhealthy': {
        general: 'Everyone should avoid outdoor activities.',
        sensitive: 'Stay indoors. Use air purifiers. Wear N95 masks if going out.',
        outdoor: '❌ Avoid all outdoor activities'
      },
      'Hazardous': {
        general: 'Health alert! Everyone should stay indoors.',
        sensitive: 'Emergency conditions. Stay indoors, seal windows, use air purifiers.',
        outdoor: '🚫 Emergency - Stay indoors'
      }
    };

    return recommendations[level] || recommendations['Good'];
  }, [overallAQI.level]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-800/95 backdrop-blur-sm p-4 rounded-lg border border-slate-600 shadow-xl max-w-xs">
          <p className="text-white font-bold mb-2">{data.name}</p>
          <p className="text-sm text-gray-300 mb-2">{data.description}</p>
          <div className="space-y-1 text-xs">
            <p className="text-green-400">✓ Limit: {data.limit} {data.unit}</p>
            <p className="text-orange-400">⚠ Current: {data.value.toFixed(1)} {data.unit}</p>
            <p className="text-red-400">● Effects: {data.healthEffects}</p>
            <p className="text-blue-400">📍 Sources: {data.sources}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-xl">
      {/* Header with Overall AQI */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Air Quality Analysis</h3>
            <p className="text-sm text-gray-400">Pollutant breakdown & health recommendations</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold" style={{ color: overallAQI.color }}>
            {overallAQI.value}
          </div>
          <p className="text-sm font-semibold" style={{ color: overallAQI.color }}>
            {overallAQI.level}
          </p>
        </div>
      </div>

      {/* Pollutant Chart */}
      <div className="bg-slate-900/50 rounded-xl p-4 mb-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={pollutantData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
            <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
            <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} label={{ value: 'μg/m³', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="value" name="Concentration" radius={[8, 8, 0, 0]}>
              {pollutantData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pollutant Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {pollutantData.map((pollutant) => (
          <div
            key={pollutant.name}
            className="bg-slate-700/50 rounded-lg p-4 hover:bg-slate-700/70 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <pollutant.icon className="w-5 h-5 text-blue-400" />
                <span className="font-bold text-white">{pollutant.name}</span>
              </div>
              <span className="text-lg font-bold" style={{ color: pollutant.color }}>
                {pollutant.value.toFixed(1)}
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-slate-600 rounded-full h-2 mb-2">
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, pollutant.percentage)}%`,
                  backgroundColor: pollutant.color
                }}
              ></div>
            </div>
            
            <div className="flex justify-between text-xs text-gray-400">
              <span>{pollutant.unit}</span>
              <span className="font-semibold" style={{ color: pollutant.color }}>
                {pollutant.status.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Health Recommendations */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-white font-semibold mb-3">
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
          <span>Health Recommendations</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-semibold text-blue-300">General Public</span>
            </div>
            <p className="text-xs text-gray-300">{healthRecommendations.general}</p>
          </div>

          <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-semibold text-orange-300">Sensitive Groups</span>
            </div>
            <p className="text-xs text-gray-300">{healthRecommendations.sensitive}</p>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-green-400" />
              <span className="text-sm font-semibold text-green-300">Outdoor Activities</span>
            </div>
            <p className="text-xs text-gray-300">{healthRecommendations.outdoor}</p>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
        <p className="text-xs text-purple-300">
          💡 <strong>Sensitive groups include:</strong> Children, elderly, pregnant women, and people with respiratory or heart conditions.
        </p>
      </div>
    </div>
  );
}
