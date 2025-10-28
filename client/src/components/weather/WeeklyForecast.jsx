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
  return icons[iconName] || Cloud;
};

export function WeeklyForecast({ forecastData, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-7 gap-2">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-700 rounded-xl p-4 text-center animate-pulse"
          >
            <div className="h-4 bg-gray-600 rounded mb-1 w-8 mx-auto"></div>
            <div className="w-8 h-8 bg-gray-600 rounded mx-auto mb-2"></div>
            <div className="h-5 bg-gray-600 rounded w-10 mx-auto"></div>
          </div>
        ))}
      </div>
    );
  }

  // Generate days with real forecast data
  const generateDays = () => {
    const today = new Date();
    const days = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dayName = i === 0 ? 'Today' : 
                    i === 1 ? 'Tomorrow' : 
                    date.toLocaleDateString('en-US', { weekday: 'short' });
      
      const forecastDay = forecastData?.daily?.[i];
      
      // Get icon component from API data or fallback based on condition
      let IconComponent = Sun;
      if (forecastDay?.icon) {
        IconComponent = getIconComponent(forecastDay.icon);
      } else if (forecastDay?.condition?.toLowerCase().includes('rain')) {
        IconComponent = CloudRain;
      } else if (forecastDay?.condition?.toLowerCase().includes('cloud')) {
        IconComponent = Cloud;
      } else if (forecastDay?.condition?.toLowerCase().includes('snow')) {
        IconComponent = CloudSnow;
      }

      days.push({
        day: dayName,
        date: date.getDate().toString(),
        icon: IconComponent,
        temp: forecastDay ? `${forecastDay.high}°` : '--°',
        low: forecastDay ? `${forecastDay.low}°` : '--°',
        bg: i === 0 ? 'bg-blue-600' : 'bg-gray-700'
      });
    }
    
    return days;
  };

  const days = generateDays();

  return (
    <div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, i) => (
          <div
            key={i}
            className={`${day.bg} rounded-xl p-4 text-center hover:scale-105 transition-transform cursor-pointer`}
          >
            <p className="text-sm mb-1">{day.day}</p>
            
            <day.icon className="w-8 h-8 mx-auto mb-2 text-blue-300" />
            
            <div className="space-y-1">
              <p className="text-lg font-bold">{day.temp}</p>
              {day.low && (
                <p className="text-xs text-gray-300">{day.low}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}