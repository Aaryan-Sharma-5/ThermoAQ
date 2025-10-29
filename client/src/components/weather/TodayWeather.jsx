import {
    Cloud,
    Droplets,
    Sunrise,
    Sunset,
    Thermometer,
    Wind,
} from 'lucide-react';

export function TodayWeather() {
  return (
    <div className="bg-gradient-to-br from-[#60a5fa] to-[#93c5fd] rounded-2xl p-6 relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm opacity-90">Today</p>
            <p className="text-sm opacity-90">Saturday, 21 Dec</p>
          </div>
          <Cloud className="w-16 h-16 opacity-90" />
        </div>
        <div className="mb-6">
          <h2 className="text-7xl font-bold mb-2">16°</h2>
          <p className="text-xl">Partly Cloudy</p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Thermometer className="w-4 h-4" />
            <span>Real Feel: 18°</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Wind className="w-4 h-4" />
            <span>Wind: 12 km/h</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Droplets className="w-4 h-4" />
            <span>Pressure: 1012 mb</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Droplets className="w-4 h-4" />
            <span>Humidity: 65%</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Sunrise className="w-4 h-4" />
            <span>Sunrise: 6:42 AM</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Sunset className="w-4 h-4" />
            <span>Sunset: 5:28 PM</span>
          </div>
        </div>
      </div>
    </div>
  );
}