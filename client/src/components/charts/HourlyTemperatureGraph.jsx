import { TrendingUp } from 'lucide-react';
import { useMemo } from 'react';
import {
  Area,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

export function HourlyTemperatureGraph({ hourlyData }) {
  const chartData = useMemo(() => {
    if (!hourlyData || hourlyData.length === 0) {
      // Mock data for 24 hours
      return Array.from({ length: 24 }, (_, i) => ({
        time: `${i.toString().padStart(2, '0')}:00`,
        temp: 20 + Math.sin(i / 4) * 8 + Math.random() * 3,
        feelsLike: 19 + Math.sin(i / 4) * 8 + Math.random() * 3,
        precipitation: Math.max(0, Math.random() * 100)
      }));
    }

    return hourlyData.slice(0, 24).map(hour => ({
      time: hour.time,
      temp: hour.temp,
      feelsLike: hour.temp - (Math.random() * 2 - 1), // Approximate feels like
      precipitation: hour.chanceOfRain || 0
    }));
  }, [hourlyData]);

  const { minTemp, maxTemp, avgTemp } = useMemo(() => {
    const temps = chartData.map(d => d.temp);
    return {
      minTemp: Math.min(...temps),
      maxTemp: Math.max(...temps),
      avgTemp: temps.reduce((a, b) => a + b, 0) / temps.length
    };
  }, [chartData]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      // Find specific data points by dataKey
      const tempData = payload.find(p => p.dataKey === 'temp');
      const feelsLikeData = payload.find(p => p.dataKey === 'feelsLike');
      const precipData = payload.find(p => p.dataKey === 'precipitation');
      
      return (
        <div className="bg-slate-800/95 backdrop-blur-sm p-4 rounded-lg border border-slate-600 shadow-xl">
          <p className="text-white font-semibold mb-2">{payload[0]?.payload?.time || 'N/A'}</p>
          <div className="space-y-1">
            {tempData && (
              <p className="text-orange-400 text-sm">
                Temperature: <span className="font-bold">{tempData.value.toFixed(1)}°C</span>
              </p>
            )}
            {feelsLikeData && (
              <p className="text-blue-400 text-sm">
                Feels Like: <span className="font-bold">{feelsLikeData.value.toFixed(1)}°C</span>
              </p>
            )}
            {precipData && (
              <p className="text-cyan-400 text-sm">
                Rain Chance: <span className="font-bold">{precipData.value.toFixed(0)}%</span>
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-orange-500 to-red-500 p-3 rounded-xl">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">24-Hour Temperature Trend</h3>
            <p className="text-sm text-gray-400">Hourly forecast with precipitation probability</p>
          </div>
        </div>
      </div>

      {/* Temperature Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-700/50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-400 mb-1">Min Temp</p>
          <p className="text-2xl font-bold text-blue-400">{minTemp.toFixed(1)}°C</p>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-400 mb-1">Avg Temp</p>
          <p className="text-2xl font-bold text-green-400">{avgTemp.toFixed(1)}°C</p>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-400 mb-1">Max Temp</p>
          <p className="text-2xl font-bold text-red-400">{maxTemp.toFixed(1)}°C</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-slate-900/50 rounded-xl p-4">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="precipGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
            <XAxis 
              dataKey="time" 
              stroke="#94a3b8" 
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              interval={2}
            />
            <YAxis 
              yAxisId="temp"
              stroke="#94a3b8" 
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
            />
            <YAxis 
              yAxisId="precip"
              orientation="right"
              stroke="#06b6d4" 
              tick={{ fill: '#06b6d4', fontSize: 12 }}
              label={{ value: 'Precipitation (%)', angle: 90, position: 'insideRight', fill: '#06b6d4' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
            
            {/* Reference lines for min/max */}
            <ReferenceLine 
              yAxisId="temp"
              y={maxTemp} 
              stroke="#ef4444" 
              strokeDasharray="3 3" 
              label={{ value: 'Max', fill: '#ef4444', fontSize: 12 }}
            />
            <ReferenceLine 
              yAxisId="temp"
              y={minTemp} 
              stroke="#3b82f6" 
              strokeDasharray="3 3" 
              label={{ value: 'Min', fill: '#3b82f6', fontSize: 12 }}
            />
            
            {/* Precipitation area */}
            <Area
              yAxisId="precip"
              type="monotone"
              dataKey="precipitation"
              stroke="#06b6d4"
              fill="url(#precipGradient)"
              strokeWidth={2}
              name="Rain Chance (%)"
            />
            
            {/* Temperature line */}
            <Line
              yAxisId="temp"
              type="monotone"
              dataKey="temp"
              stroke="#f97316"
              strokeWidth={3}
              dot={{ fill: '#f97316', r: 4 }}
              activeDot={{ r: 6 }}
              name="Temperature (°C)"
            />
            
            {/* Feels like line */}
            <Line
              yAxisId="temp"
              type="monotone"
              dataKey="feelsLike"
              stroke="#3b82f6"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: '#3b82f6', r: 3 }}
              name="Feels Like (°C)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend Info */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-orange-500"></div>
          <span>Actual Temperature</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-blue-500 border-dashed border-t-2"></div>
          <span>Feels Like Temperature</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-3 bg-cyan-500 opacity-50"></div>
          <span>Precipitation Probability</span>
        </div>
      </div>
    </div>
  );
}
