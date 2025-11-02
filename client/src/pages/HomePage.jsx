import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Cloudy,
  Droplets,
  Flame,
  Moon,
  Snowflake,
  Sun,
  Wind
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import landingPageImage from "../assets/images/landingPage.png";
import aqiBg from "../assets/images/LandingPage_AQI.png";
import currentWeatherBg from "../assets/images/LandingPage_CurrentWeather.png";
import { Header } from "../layout/Header";
import { Footer } from "../layout/Footer";
import aqiService from '../services/aqiService';
import weatherService from '../services/weatherService';

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

// All major Indian cities with coordinates
const indianCities = [
  { name: 'Delhi', lat: 28.6139, lon: 77.2090 },
  { name: 'Mumbai', lat: 19.0760, lon: 72.8777 },
  { name: 'Bangalore', lat: 12.9716, lon: 77.5946 },
  { name: 'Chennai', lat: 13.0827, lon: 80.2707 },
  { name: 'Kolkata', lat: 22.5726, lon: 88.3639 },
  { name: 'Hyderabad', lat: 17.3850, lon: 78.4867 },
  { name: 'Pune', lat: 18.5204, lon: 73.8567 },
  { name: 'Ahmedabad', lat: 23.0225, lon: 72.5714 },
  { name: 'Jaipur', lat: 26.9124, lon: 75.7873 },
  { name: 'Surat', lat: 21.1702, lon: 72.8311 },
  { name: 'Lucknow', lat: 26.8467, lon: 80.9462 },
  { name: 'Kanpur', lat: 26.4499, lon: 80.3319 },
  { name: 'Nagpur', lat: 21.1458, lon: 79.0882 },
  { name: 'Indore', lat: 22.7196, lon: 75.8577 },
  { name: 'Thane', lat: 19.2183, lon: 72.9781 },
  { name: 'Bhopal', lat: 23.2599, lon: 77.4126 },
  { name: 'Visakhapatnam', lat: 17.6868, lon: 83.2185 },
  { name: 'Patna', lat: 25.5941, lon: 85.1376 },
  { name: 'Vadodara', lat: 22.3072, lon: 73.1812 },
  { name: 'Ludhiana', lat: 30.9010, lon: 75.8573 }
];

// Calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const HomePage = () => {
  const navigate = useNavigate();
  const [weatherData, setWeatherData] = useState(null);
  const [aqiData, setAqiData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState('Mumbai, Maharashtra');
  const [loading, setLoading] = useState(true);
  const [showAQIMap, setShowAQIMap] = useState(false);
  const [aqiHistory, setAqiHistory] = useState([]);
  const [multipleCitiesAQI, setMultipleCitiesAQI] = useState([]);

  // Get nearby cities based on coordinates
  const getNearbyCities = useCallback((latitude, longitude, count = 7) => {
    const citiesWithDistance = indianCities.map(city => ({
      ...city,
      distance: calculateDistance(latitude, longitude, city.lat, city.lon)
    }));
    
    // Sort by distance and return top cities
    return citiesWithDistance
      .sort((a, b) => a.distance - b.distance)
      .slice(0, count)
      .map(city => city.name);
  }, []);

  // Function to handle location change from Header
  const handleLocationChange = (location, coordinates) => {
    setSelectedLocation(location);
    fetchAllData(location, coordinates);
  };

  const fetchAllData = useCallback(async (location, coordinates) => {
    setLoading(true);
    try {
      // Extract city name from "City, State" format
      const cityName = location.split(',')[0].trim();
      
      // Determine which cities to fetch for multi-city AQI
      let citiesToFetch = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune'];
      
      // If coordinates are provided, get nearby cities
      if (coordinates && coordinates.latitude && coordinates.longitude) {
        citiesToFetch = getNearbyCities(coordinates.latitude, coordinates.longitude, 7);
      }
      
      // Fetch all data in parallel
      const [weather, forecast, aqi, aqiHist, multiCityAQI] = await Promise.all([
        weatherService.getCurrentWeather(cityName),
        weatherService.getForecast(cityName, 7),
        aqiService.getAirQuality(cityName),
        aqiService.getAQIHistory(cityName, 7),
        aqiService.getMultipleCitiesAQI(citiesToFetch)
      ]);
      
      setWeatherData(weather);
      setForecastData(forecast);
      setAqiData(aqi);
      setAqiHistory(aqiHist);
      setMultipleCitiesAQI(multiCityAQI);
      
    } catch (error) {
      console.error('Failed to fetch data:', error);
      
      // Enhanced fallback data
      const cityName = location.split(',')[0].trim();
      
      setWeatherData({
        temperature: 30,
        condition: 'Sunny & Clear',
        humidity: 68,
        windStatus: 12,
        uvIndex: 8,
        location: location
      });
      
      // Use service fallbacks which have realistic city-based data
      const fallbackAQI = await aqiService.getAirQuality(cityName);
      setAqiData(fallbackAQI);
      
      const fallbackHistory = await aqiService.getAQIHistory(cityName, 7);
      setAqiHistory(fallbackHistory);
      
      const fallbackMultiCity = await aqiService.getMultipleCitiesAQI();
      setMultipleCitiesAQI(fallbackMultiCity);

      // Add forecast fallback with realistic varying temperatures
      const fallbackForecast = await weatherService.getForecast(cityName, 7);
      setForecastData(fallbackForecast);
      
    } finally {
      setLoading(false);
    }
  }, [getNearbyCities]);

  useEffect(() => {
    fetchAllData(selectedLocation);
  }, [selectedLocation, fetchAllData]);

  const handleCitySelectFromMap = (cityName) => {
    const locationString = `${cityName}, India`;
    setSelectedLocation(locationString);
    fetchAllData(locationString);
  };

  // Simple Map Placeholder Component
  const SimpleMapPlaceholder = ({ aqiData = [], onCitySelect, className = "" }) => {
    const defaultCities = [
      { city: 'Mumbai', aqi: 64 },
      { city: 'Delhi', aqi: 156 },
      { city: 'Bangalore', aqi: 78 },
      { city: 'Chennai', aqi: 89 },
      { city: 'Kolkata', aqi: 124 },
      { city: 'Hyderabad', aqi: 95 }
    ];

    const cityData = aqiData.length > 0 ? aqiData : defaultCities;

    const getMapAQIColor = (aqi) => {
      if (aqi <= 50) return '#10B981'; // Green
      if (aqi <= 100) return '#F59E0B'; // Yellow
      if (aqi <= 150) return '#F97316'; // Orange
      return '#EF4444'; // Red
    };

    return (
      <div className={`w-full h-full bg-gray-700 relative ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="mb-4 text-xl text-white">India AQI Map</div>
            <div className="grid max-w-md grid-cols-3 gap-4">
              {cityData.map((cityInfo, index) => (
                <div 
                  key={index}
                  className="transition-transform duration-200 transform cursor-pointer hover:scale-110"
                  onClick={() => onCitySelect && onCitySelect(cityInfo.city)}
                >
                  <div 
                    className="flex flex-col items-center justify-center w-16 h-16 font-bold text-white border-2 border-white rounded-full shadow-lg"
                    style={{ backgroundColor: getMapAQIColor(cityInfo.aqi) }}
                  >
                    <div className="text-xs">{cityInfo.aqi}</div>
                    <div className="text-xs">{cityInfo.city.slice(0, 3)}</div>
                  </div>
                  <div className="mt-1 text-xs text-center text-white">{cityInfo.city}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-sm text-gray-400">Click on any city to view details</div>
          </div>
        </div>
      </div>
    );
  };

  // AQI Modal Component
  const AQIMapModal = () => {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="bg-gray-800 rounded-2xl w-full max-w-6xl h-[90vh] relative overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowAQIMap(false)}
                className="text-white transition-colors hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h2 className="text-xl font-bold text-white">AQI Map</h2>
            </div>
            <div className="text-sm text-white">
              {aqiData?.location || selectedLocation}
            </div>
          </div>

          <div className="flex h-[calc(100%-80px)]">
            {/* Left Sidebar */}
            <div className="p-6 overflow-y-auto bg-gray-900 w-80">
              <div className="mb-6">
                <h3 className="mb-4 text-lg font-semibold text-white">Air Quality Map</h3>
                <p className="mb-4 text-sm text-gray-400">{aqiData?.location || selectedLocation}</p>
                
                {/* AQI Value Display */}
                <div className="mb-6">
                  <div 
                    className="mb-2 text-5xl font-bold"
                    style={{ color: aqiData?.color || '#F59E0B' }}
                  >
                    {aqiData?.aqi || 64}
                  </div>
                  <div 
                    className="mb-4 text-sm"
                    style={{ color: aqiData?.color || '#F59E0B' }}
                  >
                    {aqiData?.level || 'Moderate'}
                  </div>
                  <div className="text-xs text-gray-400">{aqiData?.description || 'AQI Level'}</div>
                </div>

                {/* Health Icon */}
                <div className="flex justify-center mb-6">
                  <div 
                    className="flex items-center justify-center w-16 h-16 text-2xl rounded-full"
                    style={{ backgroundColor: aqiData?.color || '#F59E0B' }}
                  >
                    {(aqiData?.aqi || 64) > 100 ? '😷' : (aqiData?.aqi || 64) > 50 ? '😐' : '😊'}
                  </div>
                </div>

                {/* Pollutant Display */}
                <div className="mb-6">
                  <h4 className="mb-3 text-sm font-semibold text-white">Pollutant Breakdown</h4>
                  {aqiData?.pollutants ? (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-300">PM2.5</span>
                        <span className="text-sm text-white">{aqiData.pollutants.pm25} μg/m³</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-300">PM10</span>
                        <span className="text-sm text-white">{aqiData.pollutants.pm10} μg/m³</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-300">O₃</span>
                        <span className="text-sm text-white">{aqiData.pollutants.o3} μg/m³</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400">Loading pollutant data...</div>
                  )}
                </div>

                {/* History Display */}
                {aqiHistory.length > 0 && (
                  <div className="mb-6">
                    <h4 className="mb-3 text-sm font-semibold text-white">Recent History</h4>
                    <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                      {aqiHistory.map((item, index) => (
                        <div key={index} className="p-2 text-center bg-gray-800 rounded">
                          <div className="text-xs text-gray-400">
                            {new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' })}
                          </div>
                          <div 
                            className="text-lg font-bold"
                            style={{ color: item.color || '#F59E0B' }}
                          >
                            {item.aqi}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Map Area */}
            <div className="relative flex-1 bg-gray-700">
              <SimpleMapPlaceholder 
                aqiData={multipleCitiesAQI}
                selectedCity={selectedLocation.split(',')[0]}
                onCitySelect={handleCitySelectFromMap}
                className="w-full h-full"
              />
              
              {/* Map overlay indicators */}
              <div className="absolute p-2 rounded-lg bottom-4 left-4 bg-black/60">
                <div className="flex items-center space-x-2 text-xs text-white">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>We Are Here</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* AQI Map Modal */}
      {showAQIMap && <AQIMapModal />}
      
      <div className="min-h-screen bg-black">
        {/* Hero Section */}
        <section className="relative h-screen">
          <div
            className="absolute inset-0 bg-center bg-no-repeat bg-cover"
            style={{
              backgroundImage: `url(${landingPageImage})`,
            }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          <Header onLocationChange={handleLocationChange} />
          <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 pt-20">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="mb-8 text-6xl font-bold tracking-tight text-white md:text-7xl lg:text-8xl">
                ThermoAQ
              </h1>
              <p className="max-w-3xl mx-auto mb-12 text-xl leading-relaxed text-gray-200 md:text-2xl">
                India's comprehensive environmental monitoring platform  combining real-time air quality tracking, 
                weather forecasts, and AI-powered health assessments to deliver instant, personalized safety guidance.
              </p>
            </div>
          </div>
        </section>

        {/* Real-Time Environmental Intelligence Section */}
        <section className="py-16 bg-black">
          <div className="px-6 mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
                Real-Time Environmental Intelligence
              </h2>
              <p className="max-w-2xl mx-auto text-lg text-gray-400">
                Monitor, analyze, and stay protected with our comprehensive platform
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 gap-8 mb-16 md:grid-cols-3">
              {/* Live Map */}
              <div 
                className="p-8 text-center transition-colors border border-gray-700 cursor-pointer bg-gray-900/50 backdrop-blur-sm rounded-2xl hover:border-orange-500"
                onClick={() => navigate('/heatwave')}
              >
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-orange-500 rounded-full">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 01.553-.894L9 2l6 3 5.447-2.724A1 1 0 0121 3.382v10.764a1 1 0 01-.553.894L15 18l-6-3z" />
                  </svg>
                </div>
                <h3 className="mb-3 text-xl font-semibold text-white">Live Map</h3>
                <p className="mb-4 text-sm text-gray-400">
                  Real-time AQI and heat wave overlays across all Indian districts with interactive visualization.
                </p>
              </div>

              {/* District Analytics */}
              <div 
                className="p-8 text-center transition-colors border border-gray-700 cursor-pointer bg-gray-900/50 backdrop-blur-sm rounded-2xl hover:border-red-500"
                onClick={() => navigate('/analytics')}
              >
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-red-500 rounded-full">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="mb-3 text-xl font-semibold text-white">District Analytics</h3>
                <p className="mb-4 text-sm text-gray-400">
                  Historical trends, forecasting insights, and detailed environmental data analysis.
                </p>
              </div>

              {/* Health Advisories */}
              <div 
                className="p-8 text-center transition-colors border border-gray-700 cursor-pointer bg-gray-900/50 backdrop-blur-sm rounded-2xl hover:border-blue-500"
                onClick={() => navigate('/health-advisory')}
              >
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-blue-500 rounded-full">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="mb-3 text-xl font-semibold text-white">Health Advisories</h3>
                <p className="mb-4 text-sm text-gray-400">
                  Personalized health and safety recommendations based on current environmental conditions.
                </p>
              </div>
            </div>

            {/* Enhanced Dashboard Widgets - Top Row (AQI and Weather equal sizes) */}
            <div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-2">
              
              {/* Enhanced Air Quality Index Widget */}
              <div 
                className="bg-gradient-to-br from-slate-800/90 via-slate-800/80 to-slate-900/90 rounded-3xl p-8 border border-slate-600/50 backdrop-blur-xl cursor-pointer hover:border-slate-500/70 hover:shadow-2xl hover:shadow-slate-900/50 transition-all duration-500 transform hover:scale-[1.02] group relative overflow-hidden"
                onClick={() => setShowAQIMap(true)}
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.5)), url(${aqiBg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  boxShadow: `0 0 30px ${aqiData?.color}20, inset 0 1px 0 rgba(255, 255, 255, 0.1)`
                }}
              >
                {/* Header Section */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-500/20 rounded-xl backdrop-blur-sm">
                      <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold tracking-tight text-white drop-shadow-lg">Air Quality Index</h3>
                  </div>
                  <div className="flex items-center px-4 py-2 space-x-2 border rounded-full bg-red-500/10 border-red-500/20 backdrop-blur-sm">
                    <div 
                      className="w-2.5 h-2.5 rounded-full animate-pulse" 
                      style={{ backgroundColor: aqiData?.color || '#EF4444' }}
                    />
                    <span className="text-sm font-medium text-red-400">Live</span>
                  </div>
                </div>
                
                {/* Main AQI Display Section */}
                <div className="flex items-start justify-between mb-6">
                  {/* Left: AQI Number and Status */}
                  <div className="flex-1">
                    <div 
                      className="mb-2 font-bold leading-none text-7xl drop-shadow-lg"
                      style={{ color: aqiData?.color || '#F59E0B' }}
                    >
                      {aqiData?.aqi || 64}
                    </div>
                    <div 
                      className="text-lg font-semibold tracking-wide uppercase drop-shadow-md"
                      style={{ color: aqiData?.color || '#F59E0B' }}
                    >
                      {aqiData?.level || 'Moderate'}
                    </div>
                    <div className="mt-2 text-sm text-gray-300 drop-shadow-sm">
                      {aqiData?.location || selectedLocation}
                    </div>
                  </div>

                  {/* Right: Pollutant Breakdown */}
                  {aqiData?.pollutants && (
                    <div className="p-4 border bg-black/50 backdrop-blur-sm rounded-xl border-white/10 min-w-[160px]">
                      <h4 className="mb-3 text-sm font-semibold text-white">Distribution</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-300">PM2.5</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-2 bg-gray-700 rounded-full">
                              <div 
                                className="h-2 transition-all duration-500 rounded-full" 
                                style={{
                                  width: `${Math.min((aqiData.pollutants.pm25 / 100) * 100, 100)}%`,
                                  backgroundColor: aqiData.pollutants.pm25 <= 12 ? '#10B981' : 
                                                 aqiData.pollutants.pm25 <= 35 ? '#F59E0B' : '#EF4444'
                                }}
                              ></div>
                            </div>
                            <span 
                              className="text-sm font-bold"
                              style={{
                                color: aqiData.pollutants.pm25 <= 12 ? '#10B981' : 
                                       aqiData.pollutants.pm25 <= 35 ? '#F59E0B' : '#EF4444'
                              }}
                            >
                              {aqiData.pollutants.pm25}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-300">PM10</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-2 bg-gray-700 rounded-full">
                              <div 
                                className="h-2 transition-all duration-500 rounded-full" 
                                style={{
                                  width: `${Math.min((aqiData.pollutants.pm10 / 150) * 100, 100)}%`,
                                  backgroundColor: aqiData.pollutants.pm10 <= 54 ? '#10B981' : 
                                                 aqiData.pollutants.pm10 <= 154 ? '#F59E0B' : '#EF4444'
                                }}
                              ></div>
                            </div>
                            <span 
                              className="text-sm font-bold"
                              style={{
                                color: aqiData.pollutants.pm10 <= 54 ? '#10B981' : 
                                       aqiData.pollutants.pm10 <= 154 ? '#F59E0B' : '#EF4444'
                              }}
                            >
                              {aqiData.pollutants.pm10}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-300">NO₂</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-2 bg-gray-700 rounded-full">
                              <div 
                                className="h-2 transition-all duration-500 rounded-full" 
                                style={{
                                  width: `${Math.min((aqiData.pollutants.no2 || 28) / 100 * 100, 100)}%`,
                                  backgroundColor: (aqiData.pollutants.no2 || 28) <= 53 ? '#10B981' : 
                                                 (aqiData.pollutants.no2 || 28) <= 100 ? '#F59E0B' : '#EF4444'
                                }}
                              ></div>
                            </div>
                            <span 
                              className="text-sm font-bold"
                              style={{
                                color: (aqiData.pollutants.no2 || 28) <= 53 ? '#10B981' : 
                                       (aqiData.pollutants.no2 || 28) <= 100 ? '#F59E0B' : '#EF4444'
                              }}
                            >
                              {aqiData.pollutants.no2 || 28}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-300">O₃</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-2 bg-gray-700 rounded-full">
                              <div 
                                className="h-2 transition-all duration-500 rounded-full" 
                                style={{
                                  width: `${Math.min((aqiData.pollutants.o3 / 100) * 100, 100)}%`,
                                  backgroundColor: aqiData.pollutants.o3 <= 54 ? '#10B981' : 
                                                 aqiData.pollutants.o3 <= 70 ? '#F59E0B' : '#EF4444'
                                }}
                              ></div>
                            </div>
                            <span 
                              className="text-sm font-bold"
                              style={{
                                color: aqiData.pollutants.o3 <= 54 ? '#10B981' : 
                                       aqiData.pollutants.o3 <= 70 ? '#F59E0B' : '#EF4444'
                              }}
                            >
                              {aqiData.pollutants.o3}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Section - AQI Level Indicators and Health Info */}
                <div className="mt-6 space-y-4">
                  {/* AQI Level Scale */}
                  <div className="p-4 bg-black/40 backdrop-blur-sm rounded-xl border border-white/10">
                    <h4 className="mb-3 text-sm font-semibold text-white">AQI Scale</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-3 bg-green-500 rounded"></div>
                          <span className="text-sm text-gray-300">Good</span>
                        </div>
                        <span className="text-xs text-gray-400">0-50</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-3 bg-yellow-500 rounded"></div>
                          <span className="text-sm text-gray-300">Moderate</span>
                        </div>
                        <span className="text-xs text-gray-400">51-100</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-3 bg-orange-500 rounded"></div>
                          <span className="text-sm text-gray-300">Unhealthy</span>
                        </div>
                        <span className="text-xs text-gray-400">101-150</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-3 bg-red-500 rounded"></div>
                          <span className="text-sm text-gray-300">Very Unhealthy</span>
                        </div>
                        <span className="text-xs text-gray-400">151+</span>
                      </div>
                    </div>
                  </div>

                  {/* Health Recommendation */}
                  <div className="p-4 bg-black/40 backdrop-blur-sm rounded-xl border border-white/10">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg flex-shrink-0">
                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-white mb-1">Health Advisory</h4>
                        <p className="text-xs text-gray-300 leading-relaxed">
                          {aqiData?.aqi <= 50 ? 
                            "Air quality is good. Ideal for outdoor activities." :
                            aqiData?.aqi <= 100 ? 
                            "Moderate air quality. Sensitive individuals should consider limiting prolonged outdoor exertion." :
                            aqiData?.aqi <= 150 ?
                            "Unhealthy for sensitive groups. Consider wearing a mask outdoors." :
                            "Very unhealthy air quality. Avoid prolonged outdoor activities."
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Weather Forecast Widget (same size as AQI) */}
              <div className="bg-gradient-to-br from-blue-900/90 via-blue-800/80 to-slate-800/90 rounded-3xl p-8 border border-blue-600/50 backdrop-blur-xl relative overflow-hidden hover:shadow-2xl hover:shadow-blue-900/50 hover:border-blue-500/70 transition-all duration-500 group cursor-pointer transform hover:scale-[1.01]"
                   style={{
                     backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.4)), url(${currentWeatherBg})`,
                     backgroundSize: 'cover',
                     backgroundPosition: 'center',
                     boxShadow: '0 0 30px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                   }}
                   onClick={() => navigate('/dashboard')}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-yellow-500/20 rounded-xl backdrop-blur-sm">
                      <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold tracking-tight text-white drop-shadow-lg">Current Weather</h3>
                  </div>
                  <div className="text-4xl transition-all duration-500 transform group-hover:scale-125 group-hover:rotate-12">
                    {weatherData?.icon ? (
                      (() => {
                        const IconComponent = getIconComponent(weatherData.icon);
                        return <IconComponent className="w-12 h-12 text-yellow-400 drop-shadow-lg" />;
                      })()
                    ) : (
                      <Sun className="w-12 h-12 text-yellow-400 drop-shadow-lg" />
                    )}
                  </div>
                </div>
                
                {loading ? (
                  <div className="py-12 text-center">
                    <div className="relative">
                      <div className="w-16 h-16 mx-auto mb-4">
                        <div className="absolute inset-0 border-4 rounded-full border-blue-400/30"></div>
                        <div className="absolute inset-0 border-4 rounded-full border-t-blue-400 animate-spin"></div>
                      </div>
                      <div className="mb-2 text-lg font-medium text-white">Fetching Weather Data</div>
                      <div className="text-sm text-blue-200">Getting real-time conditions...</div>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    {/* Main Temperature Display */}
                    <div className="text-center mb-6">
                      <div className="mb-2 text-6xl font-bold text-white drop-shadow-lg">
                        {weatherData?.temperature || 30}°C
                      </div>
                      <div className="mb-4 text-lg text-blue-200 drop-shadow-md">
                        {weatherData?.condition || 'Sunny & Clear'}
                      </div>
                    </div>
                      
                    {/* Weather Details Grid */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="p-3 text-center transition-all duration-300 border bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 hover:scale-105 group border-white/10 hover:border-white/30">
                        <Droplets className="w-6 h-6 mx-auto mb-2 text-blue-300 transition-all duration-300 group-hover:scale-125" />
                        <div className="mb-1 text-xs font-medium text-blue-200">Humidity</div>
                        <div className="text-lg font-bold text-white">
                          {weatherData?.humidity || 65}%
                        </div>
                      </div>
                      <div className="p-3 text-center transition-all duration-300 border bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 hover:scale-105 group border-white/10 hover:border-white/30">
                        <Wind className="w-6 h-6 mx-auto mb-2 text-green-300 transition-all duration-300 group-hover:scale-125" />
                        <div className="mb-1 text-xs font-medium text-blue-200">Wind</div>
                        <div className="text-lg font-bold text-white">
                          {weatherData?.windStatus || 12} km/h
                        </div>
                      </div>
                      <div className="p-3 text-center transition-all duration-300 border bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 hover:scale-105 group border-white/10 hover:border-white/30">
                        <Sun className="w-6 h-6 mx-auto mb-2 text-orange-300 transition-all duration-300 group-hover:scale-125" />
                        <div className="mb-1 text-xs font-medium text-blue-200">UV Index</div>
                        <div className="text-lg font-bold text-white">
                          {Math.round(weatherData?.uvIndex || 8)}
                        </div>
                      </div>
                    </div>

                    {/* 7-Day Forecast */}
                    <div className="p-4 bg-black/30 backdrop-blur-sm rounded-xl border border-white/10">
                      <div className="mb-3 text-sm font-semibold text-white">Weather Forecast</div>
                      {forecastData?.daily ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 max-h-96 overflow-y-auto">
                          {forecastData.daily.map((item, index) => {
                            const IconComponent = getIconComponent(item.icon);
                            return (
                              <div key={index} className="p-2 text-center transition-all duration-300 border rounded-lg cursor-pointer bg-white/5 hover:bg-white/15 hover:scale-105 border-white/10 hover:border-white/30">
                                <div className="mb-1 text-xs font-medium text-blue-200">{item.day}</div>
                                <IconComponent className="w-5 h-5 mx-auto my-2 text-yellow-400" />
                                <div className="text-sm font-bold text-white">{item.high}°</div>
                                <div className="text-xs text-blue-300">{item.low}°</div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="grid grid-cols-5 gap-2">
                          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, index) => (
                            <div key={day} className="p-2 text-center bg-white/5 rounded-lg border border-white/10">
                              <div className="mb-1 text-xs text-blue-200">{day}</div>
                              <Sun className="w-4 h-4 mx-auto my-1 text-yellow-400" />
                              <div className="text-sm font-bold text-white">{32 + index}°</div>
                              <div className="text-xs text-blue-300">{28 + index}°</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Row - Environmental Map (full width) */}
            <div className="w-full">
              <div className="relative p-8 overflow-hidden transition-all duration-500 border bg-gradient-to-br from-orange-800/90 via-red-800/80 to-red-900/90 rounded-3xl border-orange-600/50 backdrop-blur-xl hover:shadow-2xl hover:shadow-orange-900/30 group"
                   style={{
                     boxShadow: '0 0 30px rgba(249, 115, 22, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                   }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-500/20 rounded-xl">
                      <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 01.553-.894L9 2l6 3 5.447-2.724A1 1 0 0121 3.382v10.764a1 1 0 01-.553.894L15 18l-6-3z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold tracking-tight text-white">Environmental Map</h3>
                  </div>
                  <div className="flex space-x-2">
                    <div className="px-3 py-1.5 bg-red-500/20 text-red-300 text-xs font-medium rounded-full border border-red-500/30">
                      Heat Alert
                    </div>
                    <div className="px-3 py-1.5 bg-blue-500/20 text-blue-300 text-xs font-medium rounded-full border border-blue-500/30">
                      AQI Live
                    </div>
                  </div>
                </div>
                
                {/* Real Heat Map Visualization - Enhanced for full width */}
                <div className="relative h-64 mb-4 overflow-hidden bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 rounded-xl">
                  {/* Real temperature markers from multiple cities */}
                  {multipleCitiesAQI.map((cityData, index) => {
                    // Generate dynamic positions for all cities
                    const positions = [
                      { top: '20%', left: '15%' },
                      { top: '15%', left: '30%' },
                      { top: '25%', left: '50%' },
                      { top: '10%', left: '70%' },
                      { bottom: '30%', left: '25%' },
                      { bottom: '20%', left: '60%' },
                      { bottom: '35%', left: '80%' },
                      { top: '40%', left: '10%' },
                      { top: '35%', left: '40%' },
                      { top: '45%', left: '65%' },
                      { bottom: '45%', left: '15%' },
                      { bottom: '40%', left: '45%' },
                      { bottom: '50%', left: '75%' },
                      { top: '50%', left: '20%' },
                      { top: '55%', left: '55%' }
                    ];
                    // Cycle through positions if more cities than positions
                    const position = positions[index % positions.length];
                    
                    // Get temperature color based on AQI level
                    const tempColor = cityData.aqi > 100 ? 'bg-red-500' : 
                                     cityData.aqi > 75 ? 'bg-orange-400' : 
                                     'bg-yellow-400';
                    const textColor = cityData.aqi > 75 ? 'text-white' : 'text-black';
                    
                    return (
                      <div 
                        key={index}
                        className={`absolute w-12 h-12 ${tempColor} rounded-full flex items-center justify-center ${textColor} font-bold text-xs shadow-lg transition-all duration-300 hover:scale-110 cursor-pointer`}
                        style={position}
                        title={`${cityData.city}: AQI ${cityData.aqi}`}
                        onClick={() => handleCitySelectFromMap(cityData.city)}
                      >
                        <div className="text-center">
                          <div className="text-xs leading-none">{cityData.aqi}</div>
                          <div className="text-xs font-normal leading-none">{cityData.city.slice(0,3)}</div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Current location marker - centered */}
                  <div className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                    <div 
                      className="flex items-center justify-center w-16 h-16 text-sm font-bold border-4 border-white rounded-full shadow-lg animate-pulse"
                      style={{ backgroundColor: aqiData?.color || '#F59E0B' }}
                    >
                      <div className="text-center text-white">
                        <div className="text-sm leading-none">{aqiData?.aqi || 64}</div>
                        <div className="text-xs leading-none">AQI</div>
                        <div className="text-xs leading-none">{selectedLocation.split(',')[0].slice(0,3)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced gradient overlay for better visual */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent"></div>
                </div>

                {/* Enhanced Heat Alert Levels - Better layout for full width */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="p-4 bg-black/20 rounded-xl">
                    <div className="mb-2 text-xs text-orange-200">Heat Alert Levels</div>
                    <div className="flex items-center justify-between space-x-4">
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        <span className="text-xs text-white">Caution</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <span className="text-xs text-white">Warning</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <span className="text-xs text-white">Danger</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-black/20 rounded-xl">
                    <div className="mb-2 text-xs text-blue-200">AQI Categories</div>
                    <div className="flex items-center justify-between space-x-2">
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        <span className="text-xs text-white">Good</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <span className="text-xs text-white">Moderate</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <span className="text-xs text-white">Unhealthy</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-black/20 rounded-xl">
                    <div className="mb-2 text-xs text-purple-200">Live Updates</div>
                    <div className="text-sm text-white">
                      <div className="text-xs">Last Updated: {new Date().toLocaleTimeString()}</div>
                      <div className="text-xs">Active Cities: {multipleCitiesAQI.length}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>


      </div>
      <Footer />
    </>
  );
};

export default HomePage;