import { MapPin, Navigation } from 'lucide-react';

export function GlobalWeatherMap() {
  const weatherPoints = [
    { 
      city: 'New York', 
      temp: 22, 
      condition: 'Sunny',
      top: '25%',
      left: '25%',
      color: 'bg-yellow-400'
    },
    { 
      city: 'London', 
      temp: 18, 
      condition: 'Cloudy',
      top: '20%',
      left: '50%',
      color: 'bg-gray-400'
    },
    { 
      city: 'Tokyo', 
      temp: 26, 
      condition: 'Rainy',
      top: '30%',
      left: '85%',
      color: 'bg-blue-400'
    },
    { 
      city: 'Sydney', 
      temp: 24, 
      condition: 'Partly Cloudy',
      top: '75%',
      left: '85%',
      color: 'bg-orange-400'
    },
    { 
      city: 'Paris', 
      temp: 19, 
      condition: 'Overcast',
      top: '22%',
      left: '48%',
      color: 'bg-gray-500'
    },
    { 
      city: 'Mumbai', 
      temp: 32, 
      condition: 'Hot',
      top: '40%',
      left: '72%',
      color: 'bg-red-400'
    }
  ];

  return (
    <div className="bg-[#1e2430] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Global Weather Map</h3>
        <Navigation className="w-5 h-5 text-blue-400" />
      </div>
      
      <div className="relative h-80 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 rounded-xl overflow-hidden">
        {/* World map placeholder with grid pattern */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 400 200">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#ffffff" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            {/* Simplified world continents */}
            <path 
              d="M 50 80 Q 70 70 90 75 Q 110 80 130 85 Q 150 90 170 85 Q 190 80 210 85 L 210 120 Q 190 115 170 120 Q 150 125 130 120 Q 110 115 90 120 Q 70 125 50 120 Z" 
              fill="#ffffff" 
              opacity="0.3"
            />
            <path 
              d="M 240 60 Q 260 55 280 60 Q 300 65 320 70 Q 340 75 360 80 L 360 110 Q 340 105 320 110 Q 300 115 280 110 Q 260 105 240 110 Z" 
              fill="#ffffff" 
              opacity="0.3"
            />
            <path 
              d="M 320 130 Q 340 125 360 130 Q 380 135 390 140 L 390 160 Q 380 155 360 160 Q 340 165 320 160 Z" 
              fill="#ffffff" 
              opacity="0.3"
            />
          </svg>
        </div>

        {/* Weather points */}
        {weatherPoints.map((point, index) => (
          <div
            key={index}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
            style={{ top: point.top, left: point.left }}
          >
            <div className={`w-4 h-4 ${point.color} rounded-full animate-pulse`}>
              <div className={`w-6 h-6 ${point.color} rounded-full opacity-30 animate-ping absolute -top-1 -left-1`}></div>
            </div>
            
            {/* Tooltip */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3" />
                <div>
                  <div className="font-semibold">{point.city}</div>
                  <div className="text-xs text-gray-300">{point.temp}°C • {point.condition}</div>
                </div>
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
            </div>
          </div>
        ))}

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 rounded-lg p-3">
          <div className="text-xs text-gray-300 mb-2">Weather Conditions</div>
          <div className="flex flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span>Sunny</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span>Cloudy</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Rainy</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span>Hot</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}