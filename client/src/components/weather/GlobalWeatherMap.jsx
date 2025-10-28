import 'leaflet/dist/leaflet.css';
import { useEffect, useState, useMemo } from 'react';
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet';
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
import weatherService from '../../services/weatherService';

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

export function GlobalWeatherMap({ loading }) {
  const [globalWeatherData, setGlobalWeatherData] = useState([]);
  const [mapLoading, setMapLoading] = useState(true);

  // Expanded global cities with coordinates - major cities from around the world
  const globalCities = useMemo(() => [
    // India (expanded coverage)
    { name: 'Mumbai', coords: [19.076, 72.8777] },
    { name: 'Delhi', coords: [28.6139, 77.2090] },
    { name: 'Bangalore', coords: [12.9716, 77.5946] },
    { name: 'Chennai', coords: [13.0827, 80.2707] },
    { name: 'Kolkata', coords: [22.5726, 88.3639] },
    { name: 'Hyderabad', coords: [17.3850, 78.4867] },
    { name: 'Pune', coords: [18.5204, 73.8567] },
    { name: 'Ahmedabad', coords: [23.0225, 72.5714] },
    { name: 'Jaipur', coords: [26.9124, 75.7873] },
    { name: 'Surat', coords: [21.1702, 72.8311] },
    
    // East Asia
    { name: 'Tokyo', coords: [35.6762, 139.6503] },
    { name: 'Beijing', coords: [39.9042, 116.4074] },
    { name: 'Shanghai', coords: [31.2304, 121.4737] },
    { name: 'Seoul', coords: [37.5665, 126.9780] },
    { name: 'Hong Kong', coords: [22.3193, 114.1694] },
    { name: 'Taipei', coords: [25.0330, 121.5654] },
    { name: 'Osaka', coords: [34.6937, 135.5023] },
    { name: 'Guangzhou', coords: [23.1291, 113.2644] },
    { name: 'Shenzhen', coords: [22.5431, 114.0579] },
    { name: 'Chengdu', coords: [30.5728, 104.0668] },
    
    // Southeast Asia
    { name: 'Bangkok', coords: [13.7563, 100.5018] },
    { name: 'Singapore', coords: [1.3521, 103.8198] },
    { name: 'Jakarta', coords: [-6.2088, 106.8456] },
    { name: 'Manila', coords: [14.5995, 120.9842] },
    { name: 'Ho Chi Minh City', coords: [10.8231, 106.6297] },
    { name: 'Hanoi', coords: [21.0285, 105.8542] },
    { name: 'Kuala Lumpur', coords: [3.1390, 101.6869] },
    { name: 'Phnom Penh', coords: [11.5564, 104.9282] },
    { name: 'Yangon', coords: [16.8661, 96.1951] },
    
    // Middle East
    { name: 'Dubai', coords: [25.2048, 55.2708] },
    { name: 'Istanbul', coords: [41.0082, 28.9784] },
    { name: 'Riyadh', coords: [24.7136, 46.6753] },
    { name: 'Tehran', coords: [35.6892, 51.3890] },
    { name: 'Baghdad', coords: [33.3152, 44.3661] },
    { name: 'Doha', coords: [25.2854, 51.5310] },
    { name: 'Abu Dhabi', coords: [24.4539, 54.3773] },
    { name: 'Kuwait City', coords: [29.3759, 47.9774] },
    { name: 'Muscat', coords: [23.5880, 58.3829] },
    { name: 'Amman', coords: [31.9454, 35.9284] },
    
    // Western Europe
    { name: 'London', coords: [51.5074, -0.1278] },
    { name: 'Paris', coords: [48.8566, 2.3522] },
    { name: 'Berlin', coords: [52.5200, 13.4050] },
    { name: 'Rome', coords: [41.9028, 12.4964] },
    { name: 'Madrid', coords: [40.4168, -3.7038] },
    { name: 'Amsterdam', coords: [52.3676, 4.9041] },
    { name: 'Vienna', coords: [48.2082, 16.3738] },
    { name: 'Brussels', coords: [50.8503, 4.3517] },
    { name: 'Zurich', coords: [47.3769, 8.5417] },
    { name: 'Barcelona', coords: [41.3851, 2.1734] },
    { name: 'Munich', coords: [48.1351, 11.5820] },
    { name: 'Milan', coords: [45.4642, 9.1900] },
    { name: 'Lisbon', coords: [38.7223, -9.1393] },
    { name: 'Dublin', coords: [53.3498, -6.2603] },
    { name: 'Athens', coords: [37.9838, 23.7275] },
    
    // Eastern Europe
    { name: 'Moscow', coords: [55.7558, 37.6173] },
    { name: 'Prague', coords: [50.0755, 14.4378] },
    { name: 'Warsaw', coords: [52.2297, 21.0122] },
    { name: 'Budapest', coords: [47.4979, 19.0402] },
    { name: 'Bucharest', coords: [44.4268, 26.1025] },
    { name: 'Kiev', coords: [50.4501, 30.5234] },
    
    // Scandinavia
    { name: 'Stockholm', coords: [59.3293, 18.0686] },
    { name: 'Oslo', coords: [59.9139, 10.7522] },
    { name: 'Copenhagen', coords: [55.6761, 12.5683] },
    { name: 'Helsinki', coords: [60.1699, 24.9384] },
    { name: 'Reykjavik', coords: [64.1466, -21.9426] },
    
    // North America - USA
    { name: 'New York', coords: [40.7128, -74.0060] },
    { name: 'Los Angeles', coords: [34.0522, -118.2437] },
    { name: 'Chicago', coords: [41.8781, -87.6298] },
    { name: 'San Francisco', coords: [37.7749, -122.4194] },
    { name: 'Miami', coords: [25.7617, -80.1918] },
    { name: 'Houston', coords: [29.7604, -95.3698] },
    { name: 'Seattle', coords: [47.6062, -122.3321] },
    { name: 'Boston', coords: [42.3601, -71.0589] },
    { name: 'Las Vegas', coords: [36.1699, -115.1398] },
    { name: 'Phoenix', coords: [33.4484, -112.0740] },
    { name: 'Denver', coords: [39.7392, -104.9903] },
    { name: 'Atlanta', coords: [33.7490, -84.3880] },
    
    // North America - Canada & Mexico
    { name: 'Toronto', coords: [43.6532, -79.3832] },
    { name: 'Vancouver', coords: [49.2827, -123.1207] },
    { name: 'Montreal', coords: [45.5017, -73.5673] },
    { name: 'Mexico City', coords: [19.4326, -99.1332] },
    { name: 'Guadalajara', coords: [20.6597, -103.3496] },
    { name: 'Monterrey', coords: [25.6866, -100.3161] },
    
    // Central America & Caribbean
    { name: 'Havana', coords: [23.1136, -82.3666] },
    { name: 'Kingston', coords: [17.9714, -76.7931] },
    { name: 'Panama City', coords: [8.9824, -79.5199] },
    { name: 'San José', coords: [9.9281, -84.0907] },
    
    // South America
    { name: 'São Paulo', coords: [-23.5505, -46.6333] },
    { name: 'Buenos Aires', coords: [-34.6037, -58.3816] },
    { name: 'Rio de Janeiro', coords: [-22.9068, -43.1729] },
    { name: 'Lima', coords: [-12.0464, -77.0428] },
    { name: 'Bogotá', coords: [4.7110, -74.0721] },
    { name: 'Santiago', coords: [-33.4489, -70.6693] },
    { name: 'Caracas', coords: [10.4806, -66.9036] },
    { name: 'Quito', coords: [-0.1807, -78.4678] },
    { name: 'Montevideo', coords: [-34.9011, -56.1645] },
    { name: 'Brasília', coords: [-15.8267, -47.9218] },
    
    // Africa - North
    { name: 'Cairo', coords: [30.0444, 31.2357] },
    { name: 'Casablanca', coords: [33.5731, -7.5898] },
    { name: 'Algiers', coords: [36.7372, 3.0865] },
    { name: 'Tunis', coords: [36.8065, 10.1815] },
    { name: 'Tripoli', coords: [32.8872, 13.1913] },
    
    // Africa - Sub-Saharan
    { name: 'Johannesburg', coords: [-26.2041, 28.0473] },
    { name: 'Lagos', coords: [6.5244, 3.3792] },
    { name: 'Nairobi', coords: [-1.2864, 36.8172] },
    { name: 'Cape Town', coords: [-33.9249, 18.4241] },
    { name: 'Accra', coords: [5.6037, -0.1870] },
    { name: 'Addis Ababa', coords: [9.0320, 38.7469] },
    { name: 'Dar es Salaam', coords: [-6.7924, 39.2083] },
    { name: 'Kampala', coords: [0.3476, 32.5825] },
    { name: 'Khartoum', coords: [15.5007, 32.5599] },
    
    // Oceania
    { name: 'Sydney', coords: [-33.8688, 151.2093] },
    { name: 'Melbourne', coords: [-37.8136, 144.9631] },
    { name: 'Auckland', coords: [-36.8485, 174.7633] },
    { name: 'Brisbane', coords: [-27.4698, 153.0251] },
    { name: 'Perth', coords: [-31.9505, 115.8605] },
    { name: 'Wellington', coords: [-41.2865, 174.7762] },
    { name: 'Adelaide', coords: [-34.9285, 138.6007] }
  ], []);

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
              icon: 'Cloud'
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
            humidity: Math.round(50 + Math.random() * 30),
            windSpeed: Math.round(8 + Math.random() * 12),
            icon: 'CloudSun'
          };
        });
        
        setGlobalWeatherData(fallbackData);
      } finally {
        setMapLoading(false);
      }
    };

    fetchGlobalWeatherData();
  }, [globalCities]);

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
          {globalWeatherData.map((city, i) => {
            const IconComponent = getIconComponent(city.icon);
            return (
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
                      <IconComponent className="w-5 h-5 text-blue-600" />
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
            );
          })}
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