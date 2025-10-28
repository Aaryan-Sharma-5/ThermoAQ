import { Droplets, Eye, Sun, Wind } from 'lucide-react';

export function StatCards({ weatherData, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-[#1e2430] rounded-2xl p-6">
            <div className="animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="h-4 bg-gray-600 rounded w-20"></div>
                <div className="w-5 h-5 bg-gray-600 rounded"></div>
              </div>
              <div className="h-10 bg-gray-600 rounded mb-1 w-16"></div>
              <div className="h-4 bg-gray-600 rounded w-8"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Get UV Index level description
  const getUVLevel = (uvIndex) => {
    if (uvIndex === undefined || uvIndex === null) return 'No data';
    if (uvIndex === 0) return 'Minimal exposure';
    if (uvIndex <= 2) return 'Low risk';
    if (uvIndex <= 5) return 'Moderate risk';
    if (uvIndex <= 7) return 'High risk';
    if (uvIndex <= 10) return 'Very high risk';
    return 'Extreme risk';
  };

  // Get humidity level description
  const getHumidityLevel = (humidity) => {
    if (!humidity && humidity !== 0) return 'No data';
    if (humidity < 30) return 'Very dry';
    if (humidity < 50) return 'Dry';
    if (humidity < 70) return 'Normal humidity level';
    if (humidity < 85) return 'High humidity';
    return 'Very humid';
  };

  // Get visibility description
  const getVisibilityLevel = (visibility) => {
    if (!visibility && visibility !== 0) return 'No data';
    if (visibility >= 10) return 'Excellent visibility';
    if (visibility >= 6) return 'Good visibility conditions';
    if (visibility >= 3) return 'Moderate visibility';
    return 'Poor visibility';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-[#1e2430] rounded-2xl p-6 hover:bg-[#252d3d] transition-colors">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm text-gray-400">Wind Status</h3>
          <Wind className="w-5 h-5 text-blue-400" />
        </div>
        <p className="text-4xl font-bold mb-1">{weatherData?.windStatus || '--'}</p>
        <p className="text-sm text-gray-400">km/h</p>
        <div className="flex gap-2 mt-4">
          {[40, 60, 50].map((height, i) => (
            <div
              key={i}
              className="flex-1 bg-gray-700 rounded"
              style={{
                height: `${height}px`,
              }}
            >
              <div
                className="bg-blue-500 rounded w-full transition-all duration-1000"
                style={{
                  height: '100%',
                }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>6AM</span>
          <span>12PM</span>
          <span>6PM</span>
        </div>
      </div>
      
      <div className="bg-[#1e2430] rounded-2xl p-6 hover:bg-[#252d3d] transition-colors">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm text-gray-400">UV Index</h3>
          <Sun className="w-5 h-5 text-yellow-400" />
        </div>
        <p className="text-4xl font-bold mb-1">
          {weatherData?.uvIndex !== undefined && weatherData?.uvIndex !== null ? weatherData.uvIndex : '--'}
        </p>
        <p className="text-sm text-gray-400">UV</p>
        <p className="text-xs text-gray-500 mt-2">{getUVLevel(weatherData?.uvIndex)}</p>
      </div>
      
      <div className="bg-[#1e2430] rounded-2xl p-6 hover:bg-[#252d3d] transition-colors">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm text-gray-400">Humidity</h3>
          <Droplets className="w-5 h-5 text-blue-400" />
        </div>
        <p className="text-4xl font-bold mb-1">{weatherData?.humidity || '--'}</p>
        <p className="text-sm text-gray-400">%</p>
        <p className="text-xs text-gray-500 mt-2">{getHumidityLevel(weatherData?.humidity)}</p>
      </div>
      
      <div className="bg-[#1e2430] rounded-2xl p-6 hover:bg-[#252d3d] transition-colors">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm text-gray-400">Visibility</h3>
          <Eye className="w-5 h-5 text-gray-400" />
        </div>
        <p className="text-4xl font-bold mb-1">{weatherData?.visibility || '--'}</p>
        <p className="text-sm text-gray-400">km</p>
        <p className="text-xs text-gray-500 mt-2">{getVisibilityLevel(weatherData?.visibility)}</p>
      </div>
    </div>
  );
}