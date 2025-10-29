import { useState } from 'react';

export function HourlyForecast() {
  const [activeView, setActiveView] = useState('hourly');

  const hourlyData = [
    { time: '00:00', temp: 32 },
    { time: '03:00', temp: 30 },
    { time: '06:00', temp: 28 },
    { time: '09:00', temp: 35 },
    { time: '12:00', temp: 42 },
    { time: '15:00', temp: 48 },
    { time: '18:00', temp: 45 },
    { time: '21:00', temp: 38 },
  ];

  const dailyData = [
    { time: 'Mon', temp: 42 },
    { time: 'Tue', temp: 38 },
    { time: 'Wed', temp: 45 },
    { time: 'Thu', temp: 48 },
    { time: 'Fri', temp: 44 },
    { time: 'Sat', temp: 40 },
    { time: 'Sun', temp: 43 },
  ];

  const weeklyData = [
    { time: 'Week 1', temp: 42 },
    { time: 'Week 2', temp: 45 },
    { time: 'Week 3', temp: 48 },
    { time: 'Week 4', temp: 44 },
  ];

  const data = activeView === 'hourly' ? hourlyData : activeView === 'daily' ? dailyData : weeklyData;

  return (
    <div className="bg-[#1e2430] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Temperature Forecast</h3>
        <div className="flex gap-2 text-sm">
          <button
            onClick={() => setActiveView('hourly')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeView === 'hourly' ? 'bg-blue-600' : 'bg-[#252d3d] hover:bg-[#2d3548]'
            }`}
          >
            Hourly
          </button>
          <button
            onClick={() => setActiveView('daily')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeView === 'daily' ? 'bg-blue-600' : 'bg-[#252d3d] hover:bg-[#2d3548]'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setActiveView('weekly')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeView === 'weekly' ? 'bg-blue-600' : 'bg-[#252d3d] hover:bg-[#2d3548]'
            }`}
          >
            Weekly
          </button>
        </div>
      </div>
      <div className="h-64 relative">
        <svg className="w-full h-full" viewBox="0 0 400 200">
          <defs>
            <linearGradient id="tempGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#16a34a" />
            </linearGradient>
          </defs>
          <path
            d={`M ${data.map((item, i) => `${50 + (i * (300 / (data.length - 1)))},${150 - (item.temp * 2)}`).join(' L ')}`}
            fill="none"
            stroke="url(#tempGradient)"
            strokeWidth="3"
          />
          {data.map((item, i) => (
            <circle
              key={i}
              cx={50 + (i * (300 / (data.length - 1)))}
              cy={150 - (item.temp * 2)}
              r="5"
              fill="#22c55e"
            />
          ))}
        </svg>
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-400 px-12">
          {data.map((item, i) => (
            <span key={i}>{item.time}</span>
          ))}
        </div>
      </div>
    </div>
  );
}