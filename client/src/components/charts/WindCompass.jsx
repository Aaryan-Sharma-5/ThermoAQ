import { Navigation, Wind } from 'lucide-react';
import { useMemo } from 'react';

export function WindCompass({ windSpeed = 0, windDirection = 0, windGust = null }) {
  const { directionText, speedCategory } = useMemo(() => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(windDirection / 22.5) % 16;
    
    let category = 'Calm';
    let color = 'text-green-400';
    
    if (windSpeed < 5) {
      category = 'Calm';
      color = 'text-green-400';
    } else if (windSpeed < 20) {
      category = 'Gentle';
      color = 'text-blue-400';
    } else if (windSpeed < 40) {
      category = 'Moderate';
      color = 'text-yellow-400';
    } else if (windSpeed < 60) {
      category = 'Strong';
      color = 'text-orange-400';
    } else {
      category = 'Severe';
      color = 'text-red-400';
    }
    
    return {
      directionText: directions[index],
      speedCategory: { text: category, color }
    };
  }, [windDirection, windSpeed]);

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-3 rounded-xl">
          <Wind className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Wind Compass</h3>
          <p className="text-sm text-gray-400">Direction & Speed</p>
        </div>
      </div>

      {/* Compass */}
      <div className="relative w-64 h-64 mx-auto mb-6">
        {/* Outer circle */}
        <div className="absolute inset-0 rounded-full border-4 border-slate-600 bg-gradient-to-br from-slate-800 to-slate-900"></div>
        
        {/* Direction markers */}
        <div className="absolute inset-0">
          {['N', 'E', 'S', 'W'].map((dir, i) => (
            <div
              key={dir}
              className="absolute text-white font-bold text-lg"
              style={{
                top: i === 0 ? '5%' : i === 2 ? '90%' : '50%',
                left: i === 1 ? '90%' : i === 3 ? '5%' : '50%',
                transform: 'translate(-50%, -50%)'
              }}
            >
              {dir}
            </div>
          ))}
        </div>

        {/* Inner circle */}
        <div className="absolute inset-8 rounded-full border-2 border-slate-600/50"></div>
        <div className="absolute inset-16 rounded-full border border-slate-600/30"></div>

        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-orange-500 rounded-full shadow-lg"></div>

        {/* Wind direction arrow */}
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-500"
          style={{
            transform: `translate(-50%, -50%) rotate(${windDirection}deg)`
          }}
        >
          <Navigation className="w-16 h-16 text-orange-500 fill-orange-500" />
        </div>

        {/* Speed rings */}
        {windSpeed > 0 && (
          <div className="absolute inset-0">
            <div
              className="absolute rounded-full border-2 border-orange-500/30 animate-pulse"
              style={{
                top: '20%',
                left: '20%',
                right: '20%',
                bottom: '20%'
              }}
            ></div>
          </div>
        )}
      </div>

      {/* Wind Info */}
      <div className="space-y-3">
        <div className="flex items-center justify-between bg-slate-700/50 rounded-lg p-3">
          <span className="text-gray-300">Direction</span>
          <span className="text-white font-bold text-lg">{directionText} ({windDirection}°)</span>
        </div>
        
        <div className="flex items-center justify-between bg-slate-700/50 rounded-lg p-3">
          <span className="text-gray-300">Speed</span>
          <div className="text-right">
            <span className="text-white font-bold text-lg">{windSpeed} km/h</span>
            <span className={`block text-sm ${speedCategory.color}`}>{speedCategory.text}</span>
          </div>
        </div>

        {windGust && (
          <div className="flex items-center justify-between bg-slate-700/50 rounded-lg p-3">
            <span className="text-gray-300">Gusts</span>
            <span className="text-orange-400 font-bold text-lg">{windGust} km/h</span>
          </div>
        )}
      </div>
    </div>
  );
}
