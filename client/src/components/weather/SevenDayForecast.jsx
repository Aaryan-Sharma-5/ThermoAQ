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
  })) || [];

  // Show loading state if no data
  if (forecast.length === 0) {
    return (
      <div className="bg-[#1e2430] rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-4">7-Day Forecast</h3>
        <div className="grid grid-cols-7 gap-2">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="bg-[#252d3d] rounded-xl p-4 text-center animate-pulse">
              <div className="h-4 bg-gray-600 rounded mb-3 w-12 mx-auto"></div>
              <div className="w-10 h-10 bg-gray-600 rounded mx-auto mb-3"></div>
              <div className="h-5 bg-gray-600 rounded mb-2 w-10 mx-auto"></div>
              <div className="h-4 bg-gray-600 rounded w-10 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1e2430] rounded-2xl p-6">
      <h3 className="text-xl font-semibold mb-4">7-Day Forecast</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {forecast.map((day, i) => (
          <div key={i} className="bg-[#252d3d] rounded-xl p-4 text-center">
            <p className="text-sm text-gray-400 mb-2">{day.day}</p>
            <day.icon className="w-10 h-10 mx-auto mb-3 text-blue-400" />
            <div className="flex justify-center gap-2 text-sm">
              <span className="font-semibold">{day.high}°</span>
              <span className="text-gray-500">{day.low}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}