import { Sun } from 'lucide-react';
import { useMemo } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

export function UVIndexGauge({ uvIndex = 0 }) {
  const { level, color, description, recommendation } = useMemo(() => {
    const roundedUV = Math.round(uvIndex);
    
    if (roundedUV <= 2) {
      return {
        level: 'Low',
        color: '#10b981',
        description: 'Safe for most',
        recommendation: 'No protection needed'
      };
    } else if (roundedUV <= 5) {
      return {
        level: 'Moderate',
        color: '#f59e0b',
        description: 'Take precautions',
        recommendation: 'Wear sunscreen'
      };
    } else if (roundedUV <= 7) {
      return {
        level: 'High',
        color: '#f97316',
        description: 'Protection essential',
        recommendation: 'Wear sunscreen, hat & sunglasses'
      };
    } else if (roundedUV <= 10) {
      return {
        level: 'Very High',
        color: '#ef4444',
        description: 'Extra protection',
        recommendation: 'Avoid sun 10am-4pm, full protection'
      };
    } else {
      return {
        level: 'Extreme',
        color: '#dc2626',
        description: 'Take all precautions',
        recommendation: 'Avoid outdoor activities'
      };
    }
  }, [uvIndex]);

  const gaugeData = [
    { value: uvIndex, fill: color },
    { value: Math.max(0, 12 - uvIndex), fill: '#1e293b' }
  ];

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-3 rounded-xl">
          <Sun className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">UV Index</h3>
          <p className="text-sm text-gray-400">Sun exposure level</p>
        </div>
      </div>

      {/* Gauge Chart */}
      <div className="relative">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={gaugeData}
              cx="50%"
              cy="50%"
              startAngle={180}
              endAngle={0}
              innerRadius={60}
              outerRadius={90}
              paddingAngle={0}
              dataKey="value"
            >
              {gaugeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Value */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center mt-8">
          <div className="text-5xl font-bold text-white mb-1">{Math.round(uvIndex)}</div>
          <div className="text-sm font-semibold" style={{ color }}>{level}</div>
        </div>
      </div>

      {/* UV Scale */}
      <div className="mt-6 mb-4">
        <div className="h-3 rounded-full overflow-hidden flex">
          <div className="bg-green-500 flex-1"></div>
          <div className="bg-yellow-500 flex-1"></div>
          <div className="bg-orange-500 flex-1"></div>
          <div className="bg-red-500 flex-1"></div>
          <div className="bg-red-700 flex-1"></div>
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0</span>
          <span>2</span>
          <span>5</span>
          <span>7</span>
          <span>10</span>
          <span>12+</span>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-3">
        <div className="bg-slate-700/50 rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">Status</p>
          <p className="text-white font-semibold">{description}</p>
        </div>
        
        <div className="bg-slate-700/50 rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">Recommendation</p>
          <p className="text-white font-semibold text-sm">{recommendation}</p>
        </div>
      </div>

      {/* Time-based advice */}
      <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <p className="text-xs text-blue-300">
          💡 UV rays are strongest between 10 AM and 4 PM. Plan outdoor activities accordingly.
        </p>
      </div>
    </div>
  );
}
