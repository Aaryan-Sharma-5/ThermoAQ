import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertTriangleIcon, CloudIcon, LoaderIcon, MinusIcon, PlusIcon, ThermometerIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { PageHeader } from '../components/PageHeader';
import aqiService from '../services/aqiService';
import weatherService from '../services/weatherService';

// Add CSS for custom markers
const mapStyles = `
.custom-marker {
  background: transparent !important;
  border: none !important;
}

.custom-popup .leaflet-popup-content-wrapper {
  background: rgb(51 65 85) !important;
  border-radius: 8px !important;
  box-shadow: 0 10px 25px rgba(0,0,0,0.3) !important;
}

.custom-popup .leaflet-popup-content {
  margin: 0 !important;
  color: white !important;
}

.custom-popup .leaflet-popup-tip {
  background: rgb(51 65 85) !important;
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = mapStyles;
  document.head.appendChild(styleSheet);
}

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Major Indian cities for monitoring
const MAJOR_CITIES = [
  { name: 'Delhi', position: [28.6139, 77.2090] },
  { name: 'Mumbai', position: [19.076, 72.8777] },
  { name: 'Bangalore', position: [12.9716, 77.5946] },
  { name: 'Chennai', position: [13.0827, 80.2707] },
  { name: 'Kolkata', position: [22.5726, 88.3639] },
  { name: 'Hyderabad', position: [17.3850, 78.4867] },
  { name: 'Pune', position: [18.5204, 73.8567] },
  { name: 'Ahmedabad', position: [23.0225, 72.5714] },
  { name: 'Jaipur', position: [26.9124, 75.7873] },
  { name: 'Surat', position: [21.1702, 72.8311] }
];

function MapView({ citiesData, isLoading }) {
  const getMarkerColor = (temperature, aqi) => {
    // Color based on heat and air quality
    if (temperature >= 40 || aqi >= 300) return '#ff0000'; // Red - Extreme
    if (temperature >= 35 || aqi >= 200) return '#ff8c00'; // Orange - High
    if (temperature >= 30 || aqi >= 150) return '#ffd700'; // Yellow - Moderate
    if (temperature >= 25 || aqi >= 100) return '#90ee90'; // Light Green - Good
    return '#00ff00'; // Green - Excellent
  };

  const createCustomIcon = (color, temperature) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background-color: ${color};
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 10px;
          font-weight: bold;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        ">
          ${temperature}°
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  return (
    <div className="flex-1 relative">
      {isLoading && (
        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm z-[1001] flex items-center justify-center">
          <div className="bg-slate-800 p-6 rounded-lg flex items-center gap-3">
            <LoaderIcon className="w-6 h-6 animate-spin text-orange-400" />
            <span className="text-white">Loading weather data...</span>
          </div>
        </div>
      )}
      
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        className="w-full h-full min-h-[500px] lg:min-h-screen"
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        {citiesData.map((city) => {
          const markerColor = getMarkerColor(city.temperature, city.aqi);
          const customIcon = createCustomIcon(markerColor, city.temperature);
          
          return (
            <Marker 
              key={city.name} 
              position={city.position}
              icon={customIcon}
            >
              <Popup className="custom-popup">
                <div className="p-3 bg-slate-800 text-white rounded-lg min-w-[200px]">
                  <div className="font-bold text-lg text-orange-400 mb-2">
                    {city.name}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Temperature:</span>
                      <span className="font-semibold">{city.temperature}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span>AQI:</span>
                      <span className={`font-semibold ${
                        city.aqi >= 200 ? 'text-red-400' : 
                        city.aqi >= 150 ? 'text-orange-400' : 
                        city.aqi >= 100 ? 'text-yellow-400' : 'text-green-400'
                      }`}>
                        {city.aqi}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="font-semibold">{city.condition}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Humidity:</span>
                      <span className="font-semibold">{city.humidity}%</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      
      <div className="absolute top-4 right-4 lg:right-[340px] flex flex-col gap-2 z-[1000]">
        <button
          className="bg-slate-800/90 backdrop-blur-sm text-white p-3 rounded-lg hover:bg-slate-700 transition-all duration-200 shadow-lg"
          aria-label="Zoom in"
        >
          <PlusIcon className="w-5 h-5" />
        </button>
        <button
          className="bg-slate-800/90 backdrop-blur-sm text-white p-3 rounded-lg hover:bg-slate-700 transition-all duration-200 shadow-lg"
          aria-label="Zoom out"
        >
          <MinusIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function Sidebar({ aqiData, weatherData, forecastData, isLoading }) {
  const getAQIStatus = (aqi) => {
    if (aqi >= 300) return { level: 'Hazardous', color: 'text-red-400' };
    if (aqi >= 200) return { level: 'Very Unhealthy', color: 'text-orange-400' };
    if (aqi >= 150) return { level: 'Unhealthy', color: 'text-yellow-400' };
    if (aqi >= 100) return { level: 'Moderate', color: 'text-yellow-300' };
    if (aqi >= 50) return { level: 'Good', color: 'text-green-400' };
    return { level: 'Excellent', color: 'text-green-500' };
  };

  const getHeatStatus = (temp) => {
    if (temp >= 42) return { level: 'Extreme Heat', color: 'bg-red-600', textColor: 'text-white' };
    if (temp >= 38) return { level: 'High Heat', color: 'bg-orange-600', textColor: 'text-white' };
    if (temp >= 32) return { level: 'Moderate Heat', color: 'bg-yellow-600', textColor: 'text-white' };
    return { level: 'Normal', color: 'bg-green-600', textColor: 'text-white' };
  };

  const LoadingCard = () => (
    <div className="bg-slate-700 p-4 rounded-lg animate-pulse">
      <div className="h-4 bg-slate-600 rounded mb-2"></div>
      <div className="h-6 bg-slate-600 rounded mb-1"></div>
      <div className="h-3 bg-slate-600 rounded"></div>
    </div>
  );

  return (
    <aside
      className="w-full lg:w-80 xl:w-96 bg-gradient-to-b from-slate-800 to-slate-900 p-4 md:p-6 space-y-6 overflow-y-auto border-l border-slate-700"
      role="region"
      aria-label="Environmental monitoring data"
    >
      {/* Highest AQI Districts */}
      <section className="space-y-4" aria-labelledby="aqi-heading">
        <div className="flex items-center gap-3 text-orange-400 border-b border-slate-700 pb-2">
          <AlertTriangleIcon className="w-6 h-6" />
          <h2 id="aqi-heading" className="font-bold text-xl">
            Air Quality Status
          </h2>
        </div>
        
        <div className="space-y-3">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => <LoadingCard key={i} />)
          ) : (
            aqiData.slice(0, 5).map((city, index) => {
              const status = getAQIStatus(city.aqi);
              return (
                <div 
                  key={city.city} 
                  className="bg-slate-700/70 backdrop-blur-sm p-4 rounded-lg hover:bg-slate-600/70 transition-all duration-200 cursor-pointer border border-slate-600"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-white text-lg">{city.city}</div>
                      <div className="text-sm text-gray-400 mt-1">
                        PM2.5: {city.pollutants?.pm25 || 'N/A'} μg/m³
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-orange-400">{city.aqi}</div>
                      <div className={`text-xs font-medium ${status.color}`}>{status.level}</div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Heat Alerts */}
      <section className="space-y-4" aria-labelledby="heat-heading">
        <div className="flex items-center gap-3 text-orange-400 border-b border-slate-700 pb-2">
          <ThermometerIcon className="w-6 h-6" />
          <h2 id="heat-heading" className="font-bold text-xl">
            Temperature Alerts
          </h2>
        </div>
        
        <div className="space-y-3">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => <LoadingCard key={i} />)
          ) : (
            weatherData.slice(0, 3).map((city) => {
              const heatStatus = getHeatStatus(city.temperature);
              return (
                <div 
                  key={city.name} 
                  className={`${heatStatus.color} p-4 rounded-lg hover:opacity-90 transition-all duration-200 cursor-pointer`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className={`font-semibold ${heatStatus.textColor} text-lg`}>
                        {heatStatus.level}
                      </div>
                      <div className={`text-sm ${heatStatus.textColor} opacity-90 mt-1`}>
                        {city.name} - {city.condition}
                      </div>
                    </div>
                    <div className={`text-2xl font-bold ${heatStatus.textColor}`}>
                      {city.temperature}°C
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Forecast Alerts */}
      <section className="space-y-4" aria-labelledby="forecast-heading">
        <div className="flex items-center gap-3 text-blue-400 border-b border-slate-700 pb-2">
          <CloudIcon className="w-6 h-6" />
          <h2 id="forecast-heading" className="font-bold text-xl">
            Weather Forecast
          </h2>
        </div>
        
        <div className="space-y-3">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => <LoadingCard key={i} />)
          ) : (
            forecastData?.daily?.slice(0, 3).map((day, index) => (
              <div 
                key={day.day} 
                className="bg-slate-700/70 backdrop-blur-sm p-4 rounded-lg hover:bg-slate-600/70 transition-all duration-200 cursor-pointer border border-slate-600"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{day.icon}</span>
                    <div>
                      <div className="font-semibold text-green-400 text-lg">{day.day}</div>
                      <div className="text-sm text-gray-300">{day.condition}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-semibold">
                      {day.high}°/{day.low}°
                    </div>
                    <div className="text-xs text-blue-400">
                      Rain: {day.chanceOfRain}%
                    </div>
                  </div>
                </div>
              </div>
            )) || [
              <div key="placeholder" className="bg-slate-700/70 p-4 rounded-lg">
                <div className="text-gray-400 text-center">No forecast data available</div>
              </div>
            ]
          )}
        </div>
      </section>

      {/* Data Source Information */}
      <section className="border-t border-slate-700 pt-4">
        <div className="text-xs text-gray-500 text-center">
          <div>Data updated every 10 minutes</div>
          <div className="mt-1">Sources: WeatherAPI, Air Quality Index</div>
        </div>
      </section>
    </aside>
  );
}

export function HeatWaveMap() {
  const [selectedLocation, setSelectedLocation] = useState('Mumbai, Maharashtra');
  const [isLoading, setIsLoading] = useState(true);
  const [aqiData, setAqiData] = useState([]);
  const [weatherData, setWeatherData] = useState([]);
  const [forecastData, setForecastData] = useState(null);
  const [citiesData, setCitiesData] = useState([]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load AQI data for multiple cities
      const aqiCities = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat'];
      const aqiResults = await aqiService.getMultipleCitiesAQI(aqiCities);
      setAqiData(aqiResults.sort((a, b) => b.aqi - a.aqi)); // Sort by highest AQI

      // Load weather data for cities
      const weatherResults = await weatherService.getMultipleCities(aqiCities);
      const weatherDataProcessed = weatherResults
        .filter(result => result.data !== null)
        .map(result => ({
          name: result.city,
          temperature: result.data.temperature,
          condition: result.data.condition,
          humidity: result.data.humidity,
        }))
        .sort((a, b) => b.temperature - a.temperature); // Sort by highest temperature
      
      setWeatherData(weatherDataProcessed);

      // Load forecast data for selected location
      const cityName = selectedLocation.split(',')[0];
      const forecast = await weatherService.getForecast(cityName, 7);
      setForecastData(forecast);

      // Prepare cities data for map
      const mapCitiesData = MAJOR_CITIES.map(city => {
        const aqiInfo = aqiResults.find(a => a.city.toLowerCase() === city.name.toLowerCase()) || { aqi: 85 };
        const weatherInfo = weatherResults.find(w => w.city.toLowerCase() === city.name.toLowerCase());
        
        return {
          name: city.name,
          position: city.position,
          temperature: weatherInfo?.data?.temperature || 25,
          aqi: aqiInfo.aqi,
          condition: weatherInfo?.data?.condition || 'Pleasant',
          humidity: weatherInfo?.data?.humidity || 65,
        };
      });
      
      setCitiesData(mapCitiesData);

    } catch (error) {
      console.error('Failed to load environmental data:', error);
      
      // Fallback to realistic mock data
      const mockAqiData = [
        { city: 'Delhi', aqi: 385, pollutants: { pm25: 285 } },
        { city: 'Kolkata', aqi: 312, pollutants: { pm25: 198 } },
        { city: 'Mumbai', aqi: 245, pollutants: { pm25: 145 } },
        { city: 'Bangalore', aqi: 120, pollutants: { pm25: 88 } },
        { city: 'Chennai', aqi: 95, pollutants: { pm25: 65 } }
      ];
      
      const mockWeatherData = [
        { name: 'Delhi', temperature: 42, condition: 'Hot', humidity: 35 },
        { name: 'Jaipur', temperature: 39, condition: 'Very Hot', humidity: 28 },
        { name: 'Mumbai', temperature: 33, condition: 'Humid', humidity: 78 }
      ];
      
      setAqiData(mockAqiData);
      setWeatherData(mockWeatherData);
      setCitiesData(MAJOR_CITIES.map(city => ({
        ...city,
        temperature: 30 + Math.random() * 10,
        aqi: 100 + Math.random() * 200,
        condition: 'Pleasant',
        humidity: 60
      })));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedLocation]);

  const handleRefresh = () => {
    loadData();
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <PageHeader 
        title="Heat Wave Monitor"
        selectedLocation={selectedLocation}
        onLocationChange={setSelectedLocation}
        onRefresh={handleRefresh}
      />
      <main className="flex-1 flex flex-col lg:flex-row relative">
        <MapView citiesData={citiesData} isLoading={isLoading} />
        <Sidebar 
          aqiData={aqiData}
          weatherData={weatherData}
          forecastData={forecastData}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
}

export default HeatWaveMap;