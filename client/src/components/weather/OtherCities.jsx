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

export function OtherCities({ multipleCitiesData, loading }) {
  if (loading) {
    return (
      <div className="bg-[#1e2430] rounded-2xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-600 rounded mb-4 w-32"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-[#252d3d] rounded-xl p-4">
                <div className="h-4 bg-gray-600 rounded mb-2 w-20"></div>
                <div className="h-8 bg-gray-600 rounded mb-2 w-12"></div>
                <div className="h-3 bg-gray-600 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const cities = multipleCitiesData?.filter(city => city.data) || [];

  return (
    <div className="bg-[#1e2430] rounded-2xl p-6">
      <h3 className="text-xl font-semibold mb-4">Other Cities</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cities.map((cityData, i) => {
          const city = cityData.data;
          const IconComponent = getIconComponent(city.icon);
          return (
            <div key={i} className="bg-[#252d3d] rounded-xl p-4 hover:bg-[#2d3548] transition-colors cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{cityData.city}</h4>
                <IconComponent className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-2xl font-bold mb-1">{city.temperature}°C</div>
              <div className="text-sm text-gray-400">{city.condition}</div>
              <div className="text-xs text-gray-500 mt-2">
                Humidity: {city.humidity}%
              </div>
            </div>
          );
        })}
        
        {/* Show message if no data */}
        {cities.length === 0 && !loading && (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-400">No city data available</p>
          </div>
        )}
      </div>
    </div>
  );
}