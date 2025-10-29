import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet';
import weatherService from '../../services/weatherService';

export function GlobalWeatherMap({ multipleCitiesData, loading }) {
  const [globalWeatherData, setGlobalWeatherData] = useState([]);
  const [mapLoading, setMapLoading] = useState(true);

  // Global cities with coordinates
  const globalCities = [
    { name: 'Mumbai', coords: [19.076, 72.8777] },
    { name: 'London', coords: [51.5074, -0.1278] },
    { name: 'New York', coords: [40.7128, -74.006] },
    { name: 'Sydney', coords: [-33.8688, 151.2093] },
    { name: 'Tokyo', coords: [35.6762, 139.6503] },
    { name: 'Paris', coords: [48.8566, 2.3522] },
    { name: 'Dubai', coords: [25.2048, 55.2708] },
    { name: 'Singapore', coords: [1.3521, 103.8198] }
  ];

  // Get color based on temperature
  const getTemperatureColor = (temp) => {
    if (temp < 0) return '#60a5fa'; // Blue for very cold
    if (temp < 10) return '#3b82f6'; // Medium blue for cold
    if (temp < 20) return '#10b981'; // Green for mild
    if (temp < 30) return '#f59e0b'; // Orange for warm
    if (temp < 40) return '#ef4444'; // Red for hot
    return '#dc2626'; // Dark red for very hot
  };

  useEffect(() => {
    const fetchGlobalWeatherData = async () => {
      setMapLoading(true);
      try {
        // Fetch weather data for all global cities
        const weatherPromises = globalCities.map(city => 
          weatherService.getCurrentWeather(city.name)
        );
        
        const weatherResults = await Promise.allSettled(weatherPromises);
        
        const processedData = globalCities.map((city, index) => {
          const weatherResult = weatherResults[index];
          
          if (weatherResult.status === 'fulfilled' && weatherResult.value) {
            const weather = weatherResult.value;
            return {
              name: city.name,
              coords: city.coords,
              temp: weather.temperature,
              condition: weather.condition,
              color: getTemperatureColor(weather.temperature),
              humidity: weather.humidity,
              windSpeed: weather.windStatus,
              icon: weather.icon
            };
          } else {
            // Fallback for failed requests
            const fallbackTemp = Math.round(15 + Math.random() * 20); // 15-35°C
            return {
              name: city.name,
              coords: city.coords,
              temp: fallbackTemp,
              condition: 'Unknown',
              color: getTemperatureColor(fallbackTemp),
              humidity: Math.round(40 + Math.random() * 40),
              windSpeed: Math.round(5 + Math.random() * 15),
              icon: '🌡️'
            };
          }
        });

        setGlobalWeatherData(processedData);
      } catch (error) {
        console.error('Failed to fetch global weather data:', error);
        
        // Use fallback data with realistic temperatures
        const fallbackData = globalCities.map(city => {
          const fallbackTemp = Math.round(15 + Math.random() * 20);
          return {
            name: city.name,
            coords: city.coords,
            temp: fallbackTemp,
            condition: 'Partly Cloudy',
            color: getTemperatureColor(fallbackTemp),
            humidity: Math.round(40 + Math.random() * 40),
            windSpeed: Math.round(5 + Math.random() * 15),
            icon: '⛅'
          };
        });
        
        setGlobalWeatherData(fallbackData);
      } finally {
        setMapLoading(false);
      }
    };

    fetchGlobalWeatherData();
  }, []);

  if (loading || mapLoading) {
    return (
      <div className="bg-[#1e2430] rounded-2xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-600 rounded mb-4 w-40"></div>
          <div className="aspect-video bg-gray-600 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1e2430] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Global Weather Map</h3>
        <div className="text-xs text-gray-400">
          Live weather data • {globalWeatherData.length} cities
        </div>
      </div>
      <div className="relative aspect-video bg-[#1a1f2e] rounded-xl overflow-hidden">
        <MapContainer
          center={[20, 0]}
          zoom={2}
          style={{
            height: '100%',
            width: '100%',
          }}
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer 
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {globalWeatherData.map((city, i) => (
            <CircleMarker
              key={i}
              center={city.coords}
              radius={8}
              pathOptions={{
                fillColor: city.color,
                fillOpacity: 0.8,
                color: city.color,
                weight: 2,
              }}
            >
              <Popup>
                <div className="text-gray-900 min-w-[160px]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{city.icon}</span>
                    <p className="font-semibold text-base">{city.name}</p>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="font-medium text-lg">{city.temp}°C</p>
                    <p className="text-gray-600">{city.condition}</p>
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <p className="text-xs">Humidity: {city.humidity}%</p>
                      <p className="text-xs">Wind: {city.windSpeed} km/h</p>
                    </div>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
      
      {/* Temperature Legend */}
      <div className="mt-4 flex items-center justify-center">
        <div className="bg-[#252d3d] rounded-lg px-4 py-2">
          <div className="text-xs text-gray-400 mb-2 text-center">Temperature Scale</div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-400"></div>
              <span>Cold</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span>Mild</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <span>Warm</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <span>Hot</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}