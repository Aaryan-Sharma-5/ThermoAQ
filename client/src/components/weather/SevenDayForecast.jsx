import { 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  Sun,
  CloudSun,
  Cloudy,
  CloudFog,
  CloudDrizzle,
  CloudLightning,
  Snowflake,
  Flame,
  Moon
} from 'lucide-react';

// Helper function to get icon component from icon name
const getIconComponent = (iconName) => {
  const icons = {
    Sun,
    Moon,
    CloudSun,
    Cloud,
    Cloudy,
    CloudFog,
    CloudRain,
    CloudSnow,
    CloudDrizzle,
    CloudLightning,
    Snowflake,
    Flame
  };
  return icons[iconName] || Sun;
};

export function SevenDayForecast({ forecastData }) {
  // Map weather icon name to component
  const getWeatherIcon = (icon) => {
    if (!icon) return Sun;
    // If it's already an icon name, use it directly
    if (typeof icon === 'string') {
      const IconComponent = getIconComponent(icon);
      if (IconComponent !== Sun || icon === 'Sun') {
        return IconComponent;
      }
      // Fallback for condition-based mapping
      const iconStr = icon.toLowerCase();
      if (iconStr.includes('rain')) return CloudRain;
      if (iconStr.includes('snow')) return CloudSnow;
      if (iconStr.includes('cloud')) return Cloud;
    }
    return Sun;
  };

  // Use real forecast data only - no hardcoded fallback
  const forecast = forecastData?.daily?.slice(0, 7).map((day) => ({
    day: day.day,
    icon: getWeatherIcon(day.icon),
    high: day.high,
    low: day.low,
    condition: day.condition
  })) || [];

  // Log for debugging
  if (forecast.length > 0 && forecast.length < 7) {
    console.log(`Only ${forecast.length} days available in forecast`);
  }

  // Show loading state if no data
  if (forecast.length === 0) {
    return (
      <div className="bg-[#1e2430] rounded-2xl p-6">
        <h3 className="mb-4 text-xl font-semibold">7-Day Forecast</h3>
        <div className="grid grid-cols-7 gap-2">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="bg-[#252d3d] rounded-xl p-4 text-center animate-pulse">
              <div className="w-12 h-4 mx-auto mb-3 bg-gray-600 rounded"></div>
              <div className="w-10 h-10 mx-auto mb-3 bg-gray-600 rounded"></div>
              <div className="w-10 h-5 mx-auto mb-2 bg-gray-600 rounded"></div>
              <div className="w-10 h-4 mx-auto bg-gray-600 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1e2430] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">7-Day Forecast</h3>
        {forecast.length > 0 && forecast.length < 7 && (
          <span className="text-xs text-gray-500">
            Showing {forecast.length} {forecast.length === 1 ? 'day' : 'days'}
          </span>
        )}
      </div>
      <div className="grid grid-cols-7 gap-3 overflow-x-auto">
        {forecast.map((day, i) => (
          <div key={i} className="bg-[#252d3d] rounded-xl p-4 text-center hover:bg-[#2d3548] transition-colors min-w-[100px]">
            <p className="mb-2 text-sm font-medium text-gray-400">{day.day}</p>
            <day.icon className="w-10 h-10 mx-auto mb-3 text-blue-400" />
            <div className="mb-2">
              <div className="text-lg font-bold">{day.high}°</div>
              <div className="text-sm text-gray-500">{day.low}°</div>
            </div>
            {day.condition && (
              <p className="text-xs text-gray-500 truncate">{day.condition}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}