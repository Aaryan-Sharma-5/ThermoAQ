export function RainCharts({ hourlyData, loading }) {
  // Generate precipitation probability data from hourly forecast
  const lineData = hourlyData?.slice(0, 7).map((hour, i) => {
    const time = hour.time?.split(' ')[1] || `${(new Date().getHours() + i) % 24}:00`;
    const value = hour.chanceOfRain || 0;
    return { time, value };
  }) || [];

  // Generate rain intensity data from forecast (every 3 hours)
  const barData = hourlyData?.filter((_, i) => i % 3 === 0).slice(0, 8).map(hour => {
    const time = hour.time?.split(' ')[1] || '12:00';
    const value = Math.min(100, (hour.precip || 0) * 50); // Scale precipitation to percentage
    return { time, value };
  }) || [];

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="bg-[#1e2430] rounded-2xl p-6 h-64" />
        <div className="bg-[#1e2430] rounded-2xl p-6 h-64" />
      </div>
    );
  }

  if (!hourlyData || hourlyData.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-[#1e2430] rounded-2xl p-6">
          <h3 className="mb-4 text-lg font-semibold">Precipitation Probability</h3>
          <div className="flex items-center justify-center h-48 text-gray-400">
            <p>No precipitation data available</p>
          </div>
        </div>
        <div className="bg-[#1e2430] rounded-2xl p-6">
          <h3 className="mb-4 text-lg font-semibold">Rain Intensity</h3>
          <div className="flex items-center justify-center h-48 text-gray-400">
            <p>No rain intensity data available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Precipitation Probability Chart */}
      <div className="bg-[#1e2430] rounded-2xl p-6">
        <h3 className="mb-6 text-lg font-semibold">Precipitation Probability</h3>
        <div className="relative h-56 pt-4">
          {lineData.length > 0 ? (
            <>
              {/* Grid lines */}
              <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
                {[0, 25, 50, 75, 100].map((val) => (
                  <line
                    key={val}
                    x1="0"
                    y1={`${100 - val}%`}
                    x2="100%"
                    y2={`${100 - val}%`}
                    stroke="#374151"
                    strokeWidth="1"
                    strokeDasharray="4,4"
                  />
                ))}
              </svg>
              
              {/* Chart */}
              <div className="relative h-40 mb-8">
                <svg className="w-full h-full" viewBox="0 0 350 120" preserveAspectRatio="none">
                  {/* Line path */}
                  <path
                    d={`M ${lineData.map((item, i) => `${20 + (i * (310 / (lineData.length - 1)))},${100 - item.value * 0.8}`).join(' L ')}`}
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="3"
                    vectorEffect="non-scaling-stroke"
                  />
                  {/* Data points */}
                  {lineData.map((item, i) => (
                    <g key={i}>
                      <circle
                        cx={20 + (i * (310 / (lineData.length - 1)))}
                        cy={100 - item.value * 0.8}
                        r="5"
                        fill="#60a5fa"
                        vectorEffect="non-scaling-stroke"
                      />
                      <text
                        x={20 + (i * (310 / (lineData.length - 1)))}
                        y={100 - item.value * 0.8 - 10}
                        textAnchor="middle"
                        fill="#60a5fa"
                        fontSize="12"
                        fontWeight="bold"
                      >
                        {item.value}%
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
              
              {/* Time labels */}
              <div className="flex justify-between px-2 text-xs text-gray-400">
                {lineData.map((item, i) => (
                  <span key={i} className="flex-1 text-center">{item.time}</span>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <p>No data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Rain Intensity Bar Chart */}
      <div className="bg-[#1e2430] rounded-2xl p-6">
        <h3 className="mb-6 text-lg font-semibold">Rain Intensity</h3>
        <div className="relative h-56">
          {barData.length > 0 ? (
            <>
              <div className="flex items-end justify-around h-48 gap-2 px-2 mb-4">
                {barData.map((item, i) => (
                  <div key={i} className="flex flex-col items-center justify-end flex-1 h-full">
                    <div className="relative flex flex-col items-center justify-end w-full" style={{ height: '100%' }}>
                      {item.value > 0 && (
                        <span className="mb-1 text-xs font-semibold text-blue-400">
                          {item.value.toFixed(0)}%
                        </span>
                      )}
                      <div 
                        className="w-full transition-all duration-300 rounded-t bg-gradient-to-t from-blue-500 to-blue-400 hover:from-blue-400 hover:to-blue-300"
                        style={{ 
                          height: `${Math.max(item.value, 2)}%`,
                          minHeight: item.value > 0 ? '4px' : '2px'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-around px-2 text-xs text-gray-400">
                {barData.map((item, i) => (
                  <span key={i} className="flex-1 text-center">{item.time}</span>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <p>No data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}