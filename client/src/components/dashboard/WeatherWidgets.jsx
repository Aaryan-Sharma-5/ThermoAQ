import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Cloudy,
  Flame,
  Moon,
  Snowflake,
  Sun
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

export const WeatherCard = ({ data }) => {
  const IconComponent = data?.icon ? getIconComponent(data.icon) : Cloud;
  
  return (
    <div className="col-span-4 row-span-2 p-6 text-white bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium">Today</h3>
          <p className="text-sm opacity-75">{new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'short', 
            day: 'numeric' 
          })}</p>
        </div>
        <IconComponent className="w-12 h-12" />
      </div>
      
      <div className="mb-6">
        <div className="mb-2 text-6xl font-light">{data?.temperature}°</div>
        <p className="mb-4 text-lg opacity-90">{data?.condition}</p>
      </div>

      <div className="space-y-2">
        {data?.details?.map((detail, index) => (
          <div key={index} className="flex items-center text-sm opacity-75">
            <span>• {detail}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const MetricCard = ({ title, value, unit, icon, color = 'gray' }) => {
  const colorClasses = {
    gray: 'bg-gray-800',
    blue: 'bg-blue-600',
    yellow: 'bg-yellow-500',
    green: 'bg-green-600'
  };

  // Check if icon is a component or string
  const IconComponent = typeof icon === 'string' ? getIconComponent(icon) : icon;

  return (
    <div className={`col-span-2 ${colorClasses[color]} rounded-2xl p-4`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-white">{title}</h3>
        {IconComponent && typeof IconComponent === 'function' ? (
          <IconComponent className="w-5 h-5 text-white/80" />
        ) : (
          <span className="text-xl">{icon}</span>
        )}
      </div>
      <div className="mb-1 text-2xl font-light text-white">{value}</div>
      <p className="text-xs text-gray-400">{unit}</p>
    </div>
  );
};

export const WeeklyForecast = ({ data }) => {
  // Use real forecast data only
  const forecastData = data?.daily || [];
  
  // Show message if no data
  if (!forecastData || forecastData.length === 0) {
    return (
      <div className="col-span-8 p-6 bg-gray-800 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white">7-Day Forecast</h3>
        </div>
        <div className="flex items-center justify-center py-8 text-gray-400">
          <p>Loading forecast data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="col-span-8 p-6 bg-gray-800 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-white">7-Day Forecast</h3>
        <button className="text-sm text-gray-400 transition-colors hover:text-white">
          View All
        </button>
      </div>
      <div className="flex justify-between">
        {forecastData.slice(0, 7).map((dayData, index) => {
          const IconComponent = getIconComponent(dayData.icon);
          return (
            <div key={dayData.day || index} className="text-center">
              <p className="mb-2 text-sm text-gray-400">{dayData.day}</p>
              <IconComponent className="w-8 h-8 mx-auto mb-2 text-blue-400" />
              <p className="text-sm text-white">{dayData.high}°</p>
              <p className="text-xs text-gray-400">{dayData.low}°</p>
              {dayData.chanceOfRain && (
                <p className="mt-1 text-xs text-blue-400">{dayData.chanceOfRain}%</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const TomorrowCard = ({ data }) => {
  return (
    <div className="relative col-span-6 p-6 overflow-hidden text-white bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="mb-2 text-lg font-medium">Tomorrow</h3>
          <div className="mb-4 text-4xl font-light">{data?.temperature}°</div>
          
          <div className="flex justify-between max-w-xs text-sm">
            <div className="text-center">
              <p className="mb-1 opacity-75">{data?.windSpeed} mph</p>
              <p className="text-xs opacity-60">Wind</p>
            </div>
            <div className="text-center">
              <p className="mb-1 opacity-75">{data?.humidity}%</p>
              <p className="text-xs opacity-60">Humidity</p>
            </div>
            <div className="text-center">
              <p className="mb-1 opacity-75">{data?.visibility} mi</p>
              <p className="text-xs opacity-60">Visibility</p>
            </div>
          </div>
        </div>
        
        <div className="text-6xl">☀️</div>
      </div>
    </div>
  );
};

export const OtherCitiesCard = ({ data }) => {
  const cities = data || [
    { name: 'Beijing', temperature: 8 },
    { name: 'California', temperature: 28 },
    { name: 'Delhi', temperature: 32 }
  ];

  return (
    <div className="col-span-2 p-4 bg-gray-800 rounded-2xl">
      <h3 className="mb-4 text-sm font-medium text-white">Other Cities</h3>
      <div className="space-y-3">
        {cities.map((city) => (
          <div key={city.name} className="flex items-center justify-between">
            <span className="text-xs text-gray-400">{city.name}</span>
            <span className="text-sm text-white">{city.temperature}°</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ChartCard = ({ title, children, colSpan = 4 }) => {
  const colSpanClasses = {
    2: 'col-span-2',
    3: 'col-span-3',
    4: 'col-span-4',
    5: 'col-span-5',
    6: 'col-span-6',
    8: 'col-span-8'
  };

  return (
    <div className={`${colSpanClasses[colSpan]} bg-gray-800 rounded-2xl p-4`}>
      <h3 className="mb-4 text-sm font-medium text-white">{title}</h3>
      <div className="flex items-center justify-center h-32 bg-gray-700 rounded-lg">
        {children}
      </div>
    </div>
  );
};