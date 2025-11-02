import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Wind, 
  Sun, 
  Droplets, 
  Eye, 
  CloudRain,
  Cloud,
  CloudSun,
  Moon,
  CloudSnow,
  CloudDrizzle,
  CloudLightning,
  CloudFog,
  Snowflake,
  Cloudy,
  MapPin,
  TrendingUp,
  LoaderIcon,
  MinusIcon,
  PlusIcon,
  ThermometerIcon,
  AlertTriangleIcon
} from 'lucide-react';
import { Header } from '../layout/Header';
import { Footer } from '../layout/Footer';
import weatherService from '../services/weatherService';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Cities for heatmap
const INDIA_TEMPERATURE_GRID = [
  // North India
  { name: 'Srinagar', lat: 34.0837, lon: 74.7973 },
  { name: 'Jammu', lat: 32.7266, lon: 74.8570 },
  { name: 'Amritsar', lat: 31.6340, lon: 74.8723 },
  { name: 'Chandigarh', lat: 30.7333, lon: 76.7794 },
  { name: 'Delhi', lat: 28.6139, lon: 77.2090 },
  { name: 'Jaipur', lat: 26.9124, lon: 75.7873 },
  { name: 'Lucknow', lat: 26.8467, lon: 80.9462 },
  { name: 'Agra', lat: 27.1767, lon: 78.0081 },
  { name: 'Varanasi', lat: 25.3176, lon: 82.9739 },
  { name: 'Patna', lat: 25.5941, lon: 85.1376 },
  
  // West India
  { name: 'Ahmedabad', lat: 23.0225, lon: 72.5714 },
  { name: 'Surat', lat: 21.1702, lon: 72.8311 },
  { name: 'Mumbai', lat: 19.0760, lon: 72.8777 },
  { name: 'Pune', lat: 18.5204, lon: 73.8567 },
  { name: 'Nagpur', lat: 21.1458, lon: 79.0882 },
  { name: 'Indore', lat: 22.7196, lon: 75.8577 },
  { name: 'Bhopal', lat: 23.2599, lon: 77.4126 },
  
  // South India
  { name: 'Hyderabad', lat: 17.3850, lon: 78.4867 },
  { name: 'Bangalore', lat: 12.9716, lon: 77.5946 },
  { name: 'Chennai', lat: 13.0827, lon: 80.2707 },
  { name: 'Coimbatore', lat: 11.0168, lon: 76.9558 },
  { name: 'Kochi', lat: 9.9312, lon: 76.2673 },
  { name: 'Thiruvananthapuram', lat: 8.5241, lon: 76.9366 },
  { name: 'Visakhapatnam', lat: 17.6868, lon: 83.2185 },
  { name: 'Vijayawada', lat: 16.5062, lon: 80.6480 },
  { name: 'Madurai', lat: 9.9252, lon: 78.1198 },
  
  // East India
  { name: 'Kolkata', lat: 22.5726, lon: 88.3639 },
  { name: 'Bhubaneswar', lat: 20.2961, lon: 85.8245 },
  { name: 'Ranchi', lat: 23.3441, lon: 85.3096 },
  { name: 'Guwahati', lat: 26.1445, lon: 91.7362 },
  
  // Central India
  { name: 'Raipur', lat: 21.2514, lon: 81.6296 },
  { name: 'Jabalpur', lat: 23.1815, lon: 79.9864 },
  { name: 'Gwalior', lat: 26.2183, lon: 78.1828 },
];

// Heatmap component using Leaflet.heat
function HeatmapLayer({ temperatureData, opacity = 0.6 }) {
  const map = useMap();
  const heatLayerRef = useRef(null);

  useEffect(() => {
    if (!map || !temperatureData || temperatureData.length === 0) return;

    // Remove existing heat layer
    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
    }

    // Convert temperature data to heatmap format [lat, lon, intensity]
    const heatData = temperatureData.map(point => {
      // Normalize temperature to 0-1 scale (assuming 15-50°C range)
      const minTemp = 15;
      const maxTemp = 50;
      const intensity = Math.max(0, Math.min(1, (point.temperature - minTemp) / (maxTemp - minTemp)));
      return [point.lat, point.lon, intensity];
    });

    // Create heat layer with custom gradient
    heatLayerRef.current = L.heatLayer(heatData, {
      radius: 45,
      blur: 35,
      maxZoom: 8,
      max: 1.0,
      gradient: {
        0.0: '#0000ff',  // Blue - Cold (15°C)
        0.2: '#00ffff',  // Cyan - Cool (20°C)
        0.4: '#00ff00',  // Green - Mild (25°C)
        0.5: '#ffff00',  // Yellow - Warm (30°C)
        0.65: '#ffa500', // Orange - Hot (35°C)
        0.8: '#ff4500',  // Red-Orange - Very Hot (40°C)
        1.0: '#ff0000'   // Red - Extreme (45°C+)
      },
      minOpacity: opacity
    }).addTo(map);

    return () => {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
      }
    };
  }, [map, temperatureData, opacity]);

  return null;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Icon mapping
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
    Snowflake
  };
  return icons[iconName] || Cloud;
};

const Dashboard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [otherCities, setOtherCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState('Mumbai, Maharashtra');
  const [temperatureData, setTemperatureData] = useState([]);
  const [heatmapLoading, setHeatmapLoading] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [heatmapOpacity, setHeatmapOpacity] = useState(0.6);

  // Fetch heatmap temperature data
  const fetchHeatmapData = useCallback(async () => {
    setHeatmapLoading(true);
    try {
      const temperaturePromises = INDIA_TEMPERATURE_GRID.map(async (city) => {
        try {
          const weather = await weatherService.getCurrentWeather(city.name);
          return {
            ...city,
            temperature: weather.temperature,
            aqi: 50 // Default AQI
          };
        } catch (error) {
          console.error(`Failed to fetch data for ${city.name}:`, error);
          return {
            ...city,
            temperature: 25, // Default temperature
            aqi: 50
          };
        }
      });

      const results = await Promise.all(temperaturePromises);
      setTemperatureData(results);
    } catch (error) {
      console.error('Failed to fetch heatmap data:', error);
    } finally {
      setHeatmapLoading(false);
    }
  }, []);

  const fetchWeatherData = useCallback(async (location) => {
    setLoading(true);
    try {
      const cityName = location.split(',')[0].trim();
      
      const [currentWeather, forecast, cities] = await Promise.all([
        weatherService.getCurrentWeather(cityName),
        weatherService.getForecast(cityName, 7),
        weatherService.getMultipleCities(['Beijing', 'California', 'Delhi', 'Dubai'])
      ]);

      setWeatherData(currentWeather);
      setForecastData(forecast);
      setOtherCities(cities);
        
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeatherData(selectedLocation);
    fetchHeatmapData();
  }, [selectedLocation, fetchWeatherData, fetchHeatmapData]);

  const handleLocationChange = (location) => {
    setSelectedLocation(location);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-xl text-white">Loading dashboard...</div>
      </div>
    );
  }

  const IconComponent = weatherData?.icon ? getIconComponent(weatherData.icon) : Cloud;
  const todayDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    day: 'numeric',
    month: 'long'
  });

  // Chart data for 24-hour forecast
  const hourlyChartData = {
    labels: forecastData?.hourly?.slice(0, 12).map(h => h.time.split(' ')[0]) || [],
    datasets: [
      {
        label: 'Temperature',
        data: forecastData?.hourly?.slice(0, 12).map(h => h.temp) || [],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: 'rgb(34, 197, 94)',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      }
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
          callback: (value) => `${value}°`
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
        }
      }
    }
  };

  // Rain chart data
  const rainChartData = {
    labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
    datasets: [
      {
        data: forecastData?.hourly?.slice(0, 8).map(h => h.chanceOfRain || 0) || [0, 10, 20, 50, 80, 60, 30, 10],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
      }
    ]
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-black">
      <Header onLocationChange={handleLocationChange} />
      
      <div className="p-4 mx-auto max-w-7xl md:p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 md:gap-6">
          
          {/* Today Weather Card - Large */}
          <div className="p-6 text-white shadow-2xl md:col-span-1 lg:row-span-2 bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl">
            <div className="flex flex-col h-full">
              <div className="mb-4">
                <h3 className="text-lg font-medium opacity-90">Today</h3>
                <p className="text-sm opacity-75">{todayDate}</p>
              </div>
              
              <div className="flex items-center justify-center flex-1 mb-4">
                <IconComponent className="w-32 h-32 opacity-90" />
              </div>
              
              <div className="mb-6">
                <div className="mb-2 text-6xl font-light">{weatherData?.temperature}°</div>
                <p className="text-xl opacity-90">{weatherData?.condition}</p>
              </div>

              <div className="pt-4 space-y-3 border-t border-white/20">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 opacity-75">
                    <Wind className="w-4 h-4" /> Wind
                  </span>
                  <span className="font-medium">{weatherData?.windStatus || weatherData?.windSpeed || 0} km/h</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 opacity-75">
                    <Droplets className="w-4 h-4" /> Humidity
                  </span>
                  <span className="font-medium">{weatherData?.humidity || 0}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 opacity-75">
                    <Sun className="w-4 h-4" /> UV Index
                  </span>
                  <span className="font-medium">{Math.round(weatherData?.uvIndex || 0)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 opacity-75">
                    <Eye className="w-4 h-4" /> Visibility
                  </span>
                  <span className="font-medium">{weatherData?.visibility || 10} km</span>
                </div>
              </div>
            </div>
          </div>

          {/* 7-Day Forecast */}
          <div className="p-6 border shadow-xl md:col-span-1 lg:col-span-3 bg-slate-800/50 backdrop-blur-sm rounded-3xl border-slate-700/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">7-Day Forecast</h3>
              <button className="text-sm transition-colors text-slate-400 hover:text-white">
                View All
              </button>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {forecastData?.daily?.slice(0, 7).map((day, index) => {
                const DayIcon = getIconComponent(day.icon);
                return (
                  <div key={index} className="p-3 text-center transition-colors rounded-xl hover:bg-slate-700/30">
                    <p className="mb-2 text-xs text-slate-400">{day.day?.slice(0, 3)}</p>
                    <DayIcon className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                    <p className="text-sm font-semibold text-white">{day.high}°</p>
                    <p className="text-xs text-slate-500">{day.low}°</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chance of Rain */}
          <div className="p-6 border shadow-xl bg-slate-800/50 backdrop-blur-sm rounded-3xl border-slate-700/50">
            <h3 className="mb-4 text-lg font-semibold text-white">Chance of Rain</h3>
            <div className="h-32">
              <Line data={rainChartData} options={chartOptions} />
            </div>
          </div>

          {/* Wind Status */}
          <div className="p-6 border shadow-xl bg-slate-800/50 backdrop-blur-sm rounded-3xl border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-400">Wind Status</h3>
              <Wind className="w-5 h-5 text-slate-400" />
            </div>
            <div className="mb-4">
              <div className="text-3xl font-light text-white">{weatherData?.windStatus || weatherData?.windSpeed || 0}</div>
              <p className="text-sm text-slate-500">km/h</p>
            </div>
            <div className="flex gap-2">
              <div className="w-8 h-12 rounded bg-blue-500/30"></div>
              <div className="w-8 h-16 rounded bg-blue-500/50"></div>
              <div className="w-8 h-20 bg-blue-500 rounded"></div>
            </div>
          </div>

          {/* UV Index */}
          <div className="p-6 text-white shadow-xl bg-gradient-to-br from-yellow-500 to-orange-600 rounded-3xl">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium opacity-90">UV Index</h3>
              <Sun className="w-5 h-5 opacity-90" />
            </div>
            <div className="mb-2">
              <div className="text-3xl font-light">{(weatherData?.uvIndex || 0).toFixed(2)}</div>
              <p className="text-sm opacity-75">UV</p>
            </div>
            <p className="text-xs opacity-75">
              {weatherData?.uvIndex <= 2 ? 'Low' : weatherData?.uvIndex <= 5 ? 'Moderate' : weatherData?.uvIndex <= 7 ? 'High' : 'Very High'}
            </p>
          </div>

          {/* Humidity */}
          <div className="p-6 text-white shadow-xl bg-gradient-to-br from-blue-400 to-cyan-600 rounded-3xl">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium opacity-90">Humidity</h3>
              <Droplets className="w-5 h-5 opacity-90" />
            </div>
            <div className="mb-2">
              <div className="text-3xl font-light">{weatherData?.humidity || 0}</div>
              <p className="text-sm opacity-75">%</p>
            </div>
            <p className="text-xs opacity-75">
              {(weatherData?.humidity || 0) <= 30 ? 'Dry' : (weatherData?.humidity || 0) <= 60 ? 'Normal' : 'Humid'} humidity level
            </p>
          </div>

          {/* Visibility */}
          <div className="p-6 border shadow-xl bg-slate-800/50 backdrop-blur-sm rounded-3xl border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-400">Visibility</h3>
              <Eye className="w-5 h-5 text-slate-400" />
            </div>
            <div className="mb-2">
              <div className="text-3xl font-light text-white">{weatherData?.visibility || 10}</div>
              <p className="text-sm text-slate-500">km</p>
            </div>
            <p className="text-xs text-slate-500">
              {(weatherData?.visibility || 10) >= 10 ? 'Excellent' : (weatherData?.visibility || 10) >= 5 ? 'Good' : 'Poor'} visibility conditions
            </p>
          </div>

          {/* Tomorrow Forecast */}
          <div className="relative p-6 text-white shadow-xl md:col-span-2 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-3xl">
            <div className="relative z-10">
              <h3 className="mb-4 text-lg font-semibold">Tomorrow</h3>
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="mb-2 text-4xl font-light md:text-5xl">{forecastData?.tomorrow?.temperature || forecastData?.daily?.[1]?.high}°</div>
                  <p className="text-base truncate md:text-lg opacity-90">{forecastData?.tomorrow?.condition || forecastData?.daily?.[1]?.condition}</p>
                </div>
                <Sun className="w-16 h-16 md:w-20 md:h-20 opacity-80 shrink-0" />
              </div>
              
              <div className="grid grid-cols-3 gap-3 mt-6 md:gap-4">
                <div className="text-center">
                  <Wind className="w-4 h-4 mx-auto mb-1 md:w-5 md:h-5 opacity-75" />
                  <p className="text-xs md:text-sm opacity-75">Wind</p>
                  <p className="text-sm font-semibold md:text-base">{forecastData?.tomorrow?.windSpeed || forecastData?.daily?.[1]?.wind} mph</p>
                </div>
                <div className="text-center">
                  <Droplets className="w-4 h-4 mx-auto mb-1 md:w-5 md:h-5 opacity-75" />
                  <p className="text-xs md:text-sm opacity-75">Humidity</p>
                  <p className="text-sm font-semibold md:text-base">{forecastData?.tomorrow?.humidity || 65}%</p>
                </div>
                <div className="text-center">
                  <Eye className="w-4 h-4 mx-auto mb-1 md:w-5 md:h-5 opacity-75" />
                  <p className="text-xs md:text-sm opacity-75">Visibility</p>
                  <p className="text-sm font-semibold md:text-base">{forecastData?.tomorrow?.visibility || 10} mi</p>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-48 h-48 -mt-24 -mr-24 rounded-full pointer-events-none md:w-64 md:h-64 md:-mt-32 md:-mr-32 bg-white/10"></div>
          </div>

          {/* Other Cities */}
          <div className="p-6 border shadow-xl md:col-span-2 bg-slate-800/50 backdrop-blur-sm rounded-3xl border-slate-700/50">
            <h3 className="mb-4 text-lg font-semibold text-white">Other Cities</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {otherCities.map((city, index) => (
                <div key={index} className="flex items-center justify-between p-3 transition-colors rounded-xl bg-slate-700/30 hover:bg-slate-700/50">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="font-medium text-white">{city.city}</p>
                      <p className="text-xs text-slate-400">{city.data?.condition || 'Clear'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-light text-white">{city.data?.temperature}°</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 24-Hour Forecast Chart */}
          <div className="p-6 border shadow-xl md:col-span-2 lg:col-span-2 bg-slate-800/50 backdrop-blur-sm rounded-3xl border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">24-Hour Forecast</h3>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-xs text-white bg-blue-600 rounded-full">Hourly</button>
                <button className="px-3 py-1 text-xs transition-colors rounded-full bg-slate-700 text-slate-400 hover:bg-slate-600">Daily</button>
                <button className="px-3 py-1 text-xs transition-colors rounded-full bg-slate-700 text-slate-400 hover:bg-slate-600">Weekly</button>
              </div>
            </div>
            <div className="h-48">
              <Line data={hourlyChartData} options={chartOptions} />
            </div>
          </div>

          {/* India Temperature Heatmap */}
          <div className="p-6 border shadow-xl md:col-span-2 lg:col-span-4 bg-slate-800/50 backdrop-blur-sm rounded-3xl border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                <ThermometerIcon className="w-5 h-5 text-orange-400" />
                India Temperature Heatmap
              </h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowHeatmap(!showHeatmap)}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                    showHeatmap
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }`}
                >
                  {showHeatmap ? 'Hide Heatmap' : 'Show Heatmap'}
                </button>
                {showHeatmap && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setHeatmapOpacity(Math.max(0.1, heatmapOpacity - 0.1))}
                      className="p-1 text-white transition-colors rounded bg-slate-700 hover:bg-slate-600"
                    >
                      <MinusIcon className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-xs text-center text-slate-400">{Math.round(heatmapOpacity * 100)}%</span>
                    <button
                      onClick={() => setHeatmapOpacity(Math.min(1, heatmapOpacity + 0.1))}
                      className="p-1 text-white transition-colors rounded bg-slate-700 hover:bg-slate-600"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="relative overflow-hidden h-96 bg-slate-900/50 rounded-xl">
              {heatmapLoading ? (
                <div className="flex items-center justify-center h-full">
                  <LoaderIcon className="w-8 h-8 text-blue-400 animate-spin" />
                </div>
              ) : (
                <MapContainer
                  center={[22.5, 78.9]}
                  zoom={5}
                  className="w-full h-full rounded-xl"
                  zoomControl={true}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {showHeatmap && <HeatmapLayer temperatureData={temperatureData} opacity={heatmapOpacity} />}
                  
                  {temperatureData.map((city, idx) => (
                    <Marker key={idx} position={[city.lat, city.lon]}>
                      <Popup className="custom-popup">
                        <div className="p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-4 h-4 text-blue-400" />
                            <h3 className="font-semibold text-white">{city.name}</h3>
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2">
                              <ThermometerIcon className="w-4 h-4 text-orange-400" />
                              <span className="text-slate-300">Temperature: {city.temperature}°C</span>
                            </div>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              )}
            </div>

            {/* Temperature Legend */}
            {showHeatmap && (
              <div className="flex items-center justify-center gap-4 mt-4">
                <span className="text-xs text-slate-400">Temperature Scale:</span>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-xs text-slate-300">15°C</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-cyan-400"></div>
                  <span className="text-xs text-slate-300">20°C</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-400 rounded"></div>
                  <span className="text-xs text-slate-300">25°C</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                  <span className="text-xs text-slate-300">30°C</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-500 rounded"></div>
                  <span className="text-xs text-slate-300">35°C</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-600 rounded"></div>
                  <span className="text-xs text-slate-300">40°C+</span>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;