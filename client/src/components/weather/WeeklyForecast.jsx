import { Cloud, CloudRain, CloudSnow, Sun } from 'lucide-react';

export function WeeklyForecast({ forecastData, loading }) {
  if (loading) {
    const loadingDays = [...Array(7)].map((_, i) => ({
      day: '---',
      temp: '--°',
      bg: 'bg-gray-700',
      isLoading: true
    }));

    return (
      <div className="grid grid-cols-7 gap-2">
        {loadingDays.map((day, i) => (
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
      
      // Default weather icon component based on temperature or condition
      let IconComponent = Sun;
      if (forecastDay?.condition?.toLowerCase().includes('rain')) {
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
        bg: i === 0 ? 'bg-blue-600' : 'bg-gray-700',
        realIcon: forecastDay?.icon
      });
    }
    
    return days;
  };

  const days = generateDays();

  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((day, i) => (
        <div
          key={i}
          className={`${day.bg} rounded-xl p-4 text-center hover:scale-105 transition-transform cursor-pointer`}
        >
          <p className="text-sm mb-1">{day.day}</p>
          
          {/* Use real emoji icon if available, otherwise fallback to Lucide icon */}
          {day.realIcon ? (
            <div className="text-2xl mb-2 h-8 flex items-center justify-center">
              {day.realIcon}
            </div>
          ) : (
            <day.icon className="w-8 h-8 mx-auto mb-2" />
          )}
          
          <div className="space-y-1">
            <p className="text-lg font-bold">{day.temp}</p>
            {day.low && day.low !== '--°' && (
              <p className="text-xs text-gray-300">{day.low}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}