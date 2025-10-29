import {
  Cloud,
  Droplets,
  Sunrise,
  Sunset,
  Thermometer,
  Wind,
} from 'lucide-react';

export function TodayWeather({ weatherData, loading }) {
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-[#60a5fa] to-[#93c5fd] rounded-2xl p-6 relative overflow-hidden">
        <div className="animate-pulse">
          <div className="h-4 bg-white/30 rounded mb-2 w-16"></div>
          <div className="h-4 bg-white/30 rounded mb-4 w-24"></div>
          <div className="h-20 bg-white/30 rounded mb-2 w-32"></div>
          <div className="h-6 bg-white/30 rounded mb-6 w-28"></div>
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-4 bg-white/30 rounded w-full"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const now = new Date();
  const currentDate = now.toLocaleDateString('en-US', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'short' 
  });

  // Calculate approximate sunrise/sunset times
  const sunriseTime = new Date();
  sunriseTime.setHours(6, 42, 0);
  const sunsetTime = new Date();
  sunsetTime.setHours(17, 28, 0);

  return (
    <div className="bg-gradient-to-br from-[#60a5fa] to-[#93c5fd] rounded-2xl p-6 relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm opacity-90">Today</p>
            <p className="text-sm opacity-90">{currentDate}</p>
          </div>
          <div className="text-4xl opacity-90">
            {weatherData?.icon || <Cloud className="w-16 h-16" />}
          </div>
        </div>
        <div className="mb-6">
          <h2 className="text-7xl font-bold mb-2">{weatherData?.temperature || '--'}°</h2>
          <p className="text-xl">{weatherData?.condition || 'Loading...'}</p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Thermometer className="w-4 h-4" />
            <span>Real Feel: {weatherData?.temperature ? weatherData.temperature + 2 : '--'}°</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Wind className="w-4 h-4" />
            <span>Wind: {weatherData?.windStatus || '--'} km/h</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Droplets className="w-4 h-4" />
            <span>Pressure: {weatherData?.pressure || '1012'} mb</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Droplets className="w-4 h-4" />
            <span>Humidity: {weatherData?.humidity || '--'}%</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Sunrise className="w-4 h-4" />
            <span>Sunrise: {sunriseTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Sunset className="w-4 h-4" />
            <span>Sunset: {sunsetTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
        
        {/* Location Display */}
        {weatherData?.location && (
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="text-sm opacity-90">
              📍 {weatherData.location}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}