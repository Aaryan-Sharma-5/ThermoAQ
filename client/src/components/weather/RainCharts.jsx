export function RainCharts({ hourlyData, forecastData }) {
  // Generate precipitation probability data from hourly forecast
  const lineData = hourlyData?.slice(0, 7).map((hour, i) => ({
    time: hour.time || `${10 + i}AM`,
    value: hour.chanceOfRain || hour.precip || 0
  })) || [
    { time: '10AM', value: 30 },
    { time: '11AM', value: 45 },
    { time: '12PM', value: 75 },
    { time: '1PM', value: 65 },
    { time: '2PM', value: 85 },
    { time: '3PM', value: 55 },
    { time: '4PM', value: 40 },
  ];

  // Generate rain intensity data from forecast
  const barData = hourlyData?.filter((_, i) => i % 3 === 0).slice(0, 8).map(hour => ({
    time: hour.time || '12AM',
    value: Math.min(100, (hour.precip || 0) * 20) // Scale precipitation to percentage
  })) || [
    { time: '12AM', value: 30 },
    { time: '3AM', value: 40 },
    { time: '6AM', value: 35 },
    { time: '9AM', value: 50 },
    { time: '12PM', value: 70 },
    { time: '3PM', value: 85 },
    { time: '6PM', value: 80 },
    { time: '9PM', value: 60 },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-[#1e2430] rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">Precipitation Probability</h3>
        <div className="h-48 relative">
          <svg className="w-full h-full" viewBox="0 0 280 120">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
            <path
              d={`M ${lineData.map((item, i) => `${40 + (i * 35)},${100 - item.value}`).join(' L ')}`}
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="3"
            />
            {lineData.map((item, i) => (
              <circle
                key={i}
                cx={40 + (i * 35)}
                cy={100 - item.value}
                r="4"
                fill="#60a5fa"
              />
            ))}
          </svg>
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-400 px-8">
            {lineData.map((item, i) => (
              <span key={i}>{item.time}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-[#1e2430] rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">Rain Intensity</h3>
        <div className="h-48 flex items-end gap-1 mb-4">
          {barData.map((item, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-blue-500 rounded-t"
                style={{ height: `${item.value}%` }}
              />
              <span className="text-xs text-gray-500 mt-2">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}