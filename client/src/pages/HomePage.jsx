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
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import landingPageImage from "../assets/images/landingPage.png";
import aqiBg from "../assets/images/LandingPage_AQI.png";
import currentWeatherBg from "../assets/images/LandingPage_CurrentWeather.png";
import { Header } from "../layout/Header";
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

  // Function to handle location change from Header
  const handleLocationChange = (location) => {
    setSelectedLocation(location);
    fetchAllData(location);
  };

  const fetchAllData = async (location) => {
    setLoading(true);
    try {
      // Extract city name from "City, State" format
      const cityName = location.split(',')[0].trim();
      
      // Fetch all data in parallel
      const [weather, forecast, aqi, aqiHist, multiCityAQI] = await Promise.all([
        weatherService.getCurrentWeather(cityName),
        weatherService.getForecast(cityName, 7),
        aqiService.getAirQuality(cityName),
        aqiService.getAQIHistory(cityName, 7),
        aqiService.getMultipleCitiesAQI(['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune'])
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
      
      // Use AQI service fallback which has realistic city-based data
      const fallbackAQI = await aqiService.getAirQuality(cityName);
      setAqiData(fallbackAQI);
      
      const fallbackHistory = await aqiService.getAQIHistory(cityName, 7);
      setAqiHistory(fallbackHistory);
      
      const fallbackMultiCity = await aqiService.getMultipleCitiesAQI();
      setMultipleCitiesAQI(fallbackMultiCity);
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData(selectedLocation);
  }, [selectedLocation]);

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
                    <div className="grid grid-cols-3 gap-2">
                      {aqiHistory.slice(0, 6).map((item, index) => (
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
                India's live district-level danger map—combining IMD heat-wave alerts
                with real-time air-quality data to deliver instant, life-saving risk warnings.
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
                      <div className="mb-3 text-sm font-semibold text-white">7-Day Forecast</div>
                      {forecastData?.daily ? (
                        <div className="grid grid-cols-7 gap-2">
                          {forecastData.daily.slice(0, 7).map((item, index) => {
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

            {/* Bottom Row - Heat Wave Alert Map (full width) */}
            <div className="w-full">
              <div 
                className="relative p-4 overflow-hidden transition-all duration-500 border-2 bg-gradient-to-br from-red-900/95 via-orange-800/90 to-yellow-700/85 rounded-3xl border-orange-500/30 backdrop-blur-xl hover:shadow-2xl hover:shadow-red-900/40 group cursor-pointer hover:scale-[1.01] transform"
                style={{
                  boxShadow: '0 0 40px rgba(239, 68, 68, 0.2), inset 0 2px 0 rgba(255, 255, 255, 0.1)',
                  background: 'linear-gradient(135deg, rgba(127, 29, 29, 0.95) 0%, rgba(194, 65, 12, 0.9) 50%, rgba(161, 98, 7, 0.85) 100%)'
                }}
                onClick={() => navigate('/heatwave')}
              >
                {/* Enhanced Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-red-500/30 to-orange-500/20 rounded-xl backdrop-blur-sm border border-red-400/20 shadow-lg">
                      <svg className="w-5 h-5 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold tracking-tight text-white drop-shadow-lg">Heat Wave Alert Map</h3>
                      <p className="text-sm text-red-200/80 drop-shadow-sm">Real-time heat monitoring across India</p>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <div className="px-3 py-1.5 bg-gradient-to-r from-red-500/30 to-red-600/20 text-red-200 text-sm font-semibold rounded-full border border-red-400/30 backdrop-blur-sm shadow-lg hover:scale-105 transition-transform">
                      Heat Wave
                    </div>
                    <div className="px-3 py-1.5 bg-gradient-to-r from-blue-500/30 to-blue-600/20 text-blue-200 text-sm font-semibold rounded-full border border-blue-400/30 backdrop-blur-sm shadow-lg hover:scale-105 transition-transform">
                      AQI Layer
                    </div>
                  </div>
                </div>
                
                {/* Beautiful Heat Wave Map Visualization */}
                <div className="relative h-48 mb-4 overflow-hidden rounded-2xl shadow-2xl border border-white/10" 
                     style={{
                       background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 25%, #dc2626 50%, #7f1d1d 75%, #450a0a 100%)'
                     }}>
                  
                  {/* Subtle heat wave effects - reduced animation */}
                  <div className="absolute inset-0">
                    <div className="absolute top-8 left-12 w-32 h-32 bg-red-500/30 rounded-full blur-3xl opacity-60"></div>
                    <div className="absolute top-16 right-20 w-40 h-40 bg-orange-400/25 rounded-full blur-3xl opacity-50"></div>
                    <div className="absolute bottom-12 left-1/4 w-36 h-36 bg-yellow-400/20 rounded-full blur-3xl opacity-40"></div>
                    <div className="absolute top-12 left-1/2 w-28 h-28 bg-red-600/35 rounded-full blur-2xl opacity-55"></div>
                    <div className="absolute bottom-16 right-12 w-44 h-44 bg-orange-500/25 rounded-full blur-3xl opacity-45"></div>
                  </div>
                  
                  {/* Subtle flowing heat patterns - removed excessive animation */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute w-full h-full bg-gradient-to-r from-transparent via-red-400/15 to-transparent transform -skew-x-12"></div>
                    <div className="absolute w-full h-full bg-gradient-to-l from-transparent via-orange-400/10 to-transparent transform skew-x-12"></div>
                  </div>
                  
                  {/* Enhanced city temperature markers */}
                  {multipleCitiesAQI.slice(0, 8).map((cityData, index) => {
                    const positions = [
                      { top: '18%', left: '15%', city: 'Delhi' },
                      { top: '28%', left: '25%', city: 'Jaipur' },
                      { top: '22%', left: '45%', city: 'Lucknow' },
                      { top: '35%', left: '18%', city: 'Ahmedabad' },
                      { bottom: '32%', left: '22%', city: 'Mumbai' },
                      { bottom: '28%', left: '48%', city: 'Bangalore' },
                      { top: '32%', left: '68%', city: 'Bhubaneswar' },
                      { bottom: '38%', left: '72%', city: 'Chennai' }
                    ];
                    const position = positions[index] || positions[0];
                    
                    const heatLevel = Math.min(Math.max(cityData.aqi / 2 + 25, 30), 52);
                    const isExtreme = heatLevel > 45;
                    const isHigh = heatLevel > 40;
                    const isModerate = heatLevel > 35;
                    
                    return (
                      <div 
                        key={index}
                        className="absolute group transition-all duration-300 hover:scale-110 cursor-pointer"
                        style={{ top: position.top, left: position.left }}
                        title={`${position.city}: ${Math.round(heatLevel)}°C Heat Index`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCitySelectFromMap(cityData.city);
                        }}
                      >
                        {/* Subtle glow effect - only for extreme heat, no blinking */}
                        {isExtreme && (
                          <div className="absolute inset-0 w-16 h-16 rounded-full" 
                               style={{ 
                                 backgroundColor: 'rgba(220, 38, 38, 0.2)',
                                 boxShadow: '0 0 20px rgba(220, 38, 38, 0.4)'
                               }}>
                          </div>
                        )}
                        
                        {/* Main marker - removed excessive animations */}
                        <div 
                          className="relative w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-2xl border-2 border-white/50 backdrop-blur-sm transition-all duration-300 hover:shadow-3xl"
                          style={{ 
                            background: isExtreme ? 'linear-gradient(135deg, #dc2626, #7f1d1d)' : 
                                       isHigh ? 'linear-gradient(135deg, #ea580c, #c2410c)' : 
                                       isModerate ? 'linear-gradient(135deg, #eab308, #a16207)' : 'linear-gradient(135deg, #22c55e, #16a34a)',
                            boxShadow: `0 8px 32px ${isExtreme ? 'rgba(220, 38, 38, 0.3)' : isHigh ? 'rgba(234, 88, 12, 0.3)' : 'rgba(234, 179, 8, 0.3)'}`
                          }}
                        >
                          <div className="text-center">
                            <div className="text-sm leading-none font-bold drop-shadow-lg">{Math.round(heatLevel)}°</div>
                            <div className="text-xs font-normal leading-none opacity-90 drop-shadow-md">{position.city.slice(0,3)}</div>
                          </div>
                        </div>
                        
                        {/* Improved tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap backdrop-blur-sm border border-white/20">
                          {position.city}: {Math.round(heatLevel)}°C
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90"></div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Enhanced current location marker - reduced blinking */}
                  <div className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 group">
                    {/* Single subtle pulse ring - much slower */}
                    <div className="absolute inset-0 w-24 h-24 rounded-full border-2 border-white/30 animate-ping" style={{ animationDuration: '3s' }}></div>
                    
                    {/* Main location marker */}
                    <div 
                      className="relative w-20 h-20 rounded-full flex items-center justify-center text-white font-bold border-3 border-white shadow-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105"
                      style={{ 
                        background: (aqiData?.aqi > 100) ? 'linear-gradient(135deg, #dc2626, #7f1d1d)' : 
                                   (aqiData?.aqi > 75) ? 'linear-gradient(135deg, #ea580c, #c2410c)' : 'linear-gradient(135deg, #eab308, #a16207)',
                        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3), 0 0 0 4px rgba(255, 255, 255, 0.2)'
                      }}
                    >
                      <div className="text-center">
                        <div className="text-lg leading-none font-bold drop-shadow-lg">{Math.round((aqiData?.aqi || 64) / 2 + 30)}°</div>
                        <div className="text-xs leading-none opacity-90 drop-shadow-md">YOU</div>
                        <div className="text-xs leading-none opacity-75 drop-shadow-sm">{selectedLocation.split(',')[0].slice(0,4)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Refined overlay gradients */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent"></div>
                </div>

                {/* Enhanced Information Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="p-4 bg-gradient-to-br from-black/50 to-black/30 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-white/20">
                    <div className="mb-3 text-sm text-orange-200 font-semibold flex items-center">
                      <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                      Heat Alert Levels
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full shadow-lg"></div>
                          <span className="text-sm text-white font-medium">Caution</span>
                        </div>
                        <span className="text-xs text-gray-300 font-mono bg-black/20 px-2 py-1 rounded">27-32°C</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full shadow-lg"></div>
                          <span className="text-sm text-white font-medium">Warning</span>
                        </div>
                        <span className="text-xs text-gray-300 font-mono bg-black/20 px-2 py-1 rounded">32-39°C</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-gradient-to-r from-red-400 to-red-500 rounded-full shadow-lg"></div>
                          <span className="text-sm text-white font-medium">Danger</span>
                        </div>
                        <span className="text-xs text-gray-300 font-mono bg-black/20 px-2 py-1 rounded">39°C+</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-br from-black/50 to-black/30 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-white/20">
                    <div className="mb-3 text-sm text-blue-200 font-semibold flex items-center">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                      Current Conditions
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 rounded-lg bg-white/5 border border-white/5">
                        <span className="text-sm text-gray-300">Heat Index:</span>
                        <span className="text-lg font-bold text-orange-300 drop-shadow-lg">{Math.round((aqiData?.aqi || 64) / 2 + 30)}°C</span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-lg bg-white/5 border border-white/5">
                        <span className="text-sm text-gray-300">Risk Level:</span>
                        <span className={`text-sm font-bold px-2 py-1 rounded-full border ${(aqiData?.aqi > 100) ? 'text-red-300 bg-red-500/20 border-red-500/30' : (aqiData?.aqi > 75) ? 'text-orange-300 bg-orange-500/20 border-orange-500/30' : 'text-yellow-300 bg-yellow-500/20 border-yellow-500/30'}`}>
                          {(aqiData?.aqi > 100) ? 'High' : (aqiData?.aqi > 75) ? 'Moderate' : 'Low'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-lg bg-white/5 border border-white/5">
                        <span className="text-sm text-gray-300">Location:</span>
                        <span className="text-sm text-white font-medium">{selectedLocation.split(',')[0]}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-br from-black/50 to-black/30 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-white/20">
                    <div className="mb-3 text-sm text-purple-200 font-semibold flex items-center">
                      <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                      Live Updates
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 rounded-lg bg-white/5 border border-white/5">
                        <span className="text-sm text-gray-300">Last Updated:</span>
                        <span className="text-sm text-green-400 font-mono bg-green-500/10 px-2 py-1 rounded">{new Date().toLocaleTimeString()}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-lg bg-white/5 border border-white/5">
                        <span className="text-sm text-gray-300">Active Alerts:</span>
                        <span className="text-lg font-bold text-orange-400">{multipleCitiesAQI.filter(city => city.aqi > 75).length}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-lg bg-white/5 border border-white/5">
                        <span className="text-sm text-gray-300">Monitored Cities:</span>
                        <span className="text-lg font-bold text-blue-400">{multipleCitiesAQI.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 bg-black border-t border-gray-800">
          <div className="px-6 mx-auto max-w-7xl">
            <div className="text-center">
              <h3 className="mb-2 text-2xl font-bold text-white">ThermoAQ</h3>
              <p className="mb-4 text-sm text-gray-400">
                Protecting India through environmental intelligence
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePage;