import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Sun,
  Droplets,
  Wind,
  Eye
} from 'lucide-react';
import landingPageImage from "../assets/images/landingPage.png";
import { WeatherForecastChart } from '../components/charts/ChartComponents';
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
                className="bg-gradient-to-br from-slate-800/90 via-slate-800/80 to-slate-900/90 rounded-3xl p-8 border border-slate-600/50 backdrop-blur-xl cursor-pointer hover:border-slate-500/70 hover:shadow-2xl hover:shadow-slate-900/50 transition-all duration-500 transform hover:scale-[1.02] group"
                onClick={() => setShowAQIMap(true)}
                style={{
                  boxShadow: `0 0 30px ${aqiData?.color}20, inset 0 1px 0 rgba(255, 255, 255, 0.1)`
                }}
              >
                {/* Header Section with improved spacing */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-500/20 rounded-xl">
                      <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold tracking-tight text-white">Air Quality Index</h3>
                  </div>
                  <div className="flex items-center px-4 py-2 space-x-2 border rounded-full bg-red-500/10 border-red-500/20">
                    <div 
                      className="w-2.5 h-2.5 rounded-full animate-pulse" 
                      style={{ backgroundColor: aqiData?.color || '#EF4444' }}
                    />
                    <span className="text-sm font-medium text-red-400">Live Data</span>
                  </div>
                </div>
                
                {/* Main AQI Display Section */}
                <div className="relative mb-8 overflow-hidden bg-center bg-cover rounded-2xl" 
                     style={{
                       backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?w=600&h=300&fit=crop")',
                       height: '240px'
                     }}>
                  
                  {/* AQI Number and Status*/}
                  <div className="absolute left-8 top-8">
                    <div 
                      className="mb-2 font-bold leading-none text-7xl"
                      style={{ color: aqiData?.color || '#F59E0B' }}
                    >
                      {aqiData?.aqi || 79}
                    </div>
                  </div>

                  {/* Status and Location */}
                  <div className="absolute left-8 top-32">
                    <div 
                      className="text-base font-semibold tracking-wide uppercase"
                      style={{ color: aqiData?.color || '#F59E0B' }}
                    >
                      {aqiData?.level || 'Moderate'}
                    </div>
                    <div className="mt-2 text-sm text-gray-300">
                      {aqiData?.location || selectedLocation}
                    </div>
                  </div>

                  {/* Real Pollutant Levels - Right side */}
                  {aqiData?.pollutants && (
                    <div className="absolute space-y-4 right-8 top-8">
                      <div className="p-4 border bg-black/40 backdrop-blur-sm rounded-xl border-white/10">
                        <h4 className="mb-3 text-sm font-semibold text-white">Pollutant Levels</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="w-12 text-sm font-medium text-gray-300">PM2.5</span>
                            <div className="w-16 h-2 mx-3 bg-gray-700 rounded-full">
                              <div 
                                className="h-2 transition-all duration-500 rounded-full" 
                                style={{
                                  width: `${Math.min((aqiData.pollutants.pm25 / 100) * 100, 100)}%`,
                                  backgroundColor: aqiData.pollutants.pm25 > 50 ? '#EF4444' : aqiData.pollutants.pm25 > 25 ? '#F59E0B' : '#10B981'
                                }}
                              ></div>
                            </div>
                            <span className="w-8 text-sm font-bold text-right text-white">{aqiData.pollutants.pm25}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="w-12 text-sm font-medium text-gray-300">PM10</span>
                            <div className="w-16 h-2 mx-3 bg-gray-700 rounded-full">
                              <div 
                                className="h-2 transition-all duration-500 rounded-full" 
                                style={{
                                  width: `${Math.min((aqiData.pollutants.pm10 / 150) * 100, 100)}%`,
                                  backgroundColor: aqiData.pollutants.pm10 > 75 ? '#EF4444' : aqiData.pollutants.pm10 > 50 ? '#F59E0B' : '#10B981'
                                }}
                              ></div>
                            </div>
                            <span className="w-8 text-sm font-bold text-right text-white">{aqiData.pollutants.pm10}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="w-12 text-sm font-medium text-gray-300">O₃</span>
                            <div className="w-16 h-2 mx-3 bg-gray-700 rounded-full">
                              <div 
                                className="h-2 transition-all duration-500 rounded-full" 
                                style={{
                                  width: `${Math.min((aqiData.pollutants.o3 / 100) * 100, 100)}%`,
                                  backgroundColor: aqiData.pollutants.o3 > 60 ? '#EF4444' : aqiData.pollutants.o3 > 40 ? '#F59E0B' : '#10B981'
                                }}
                              ></div>
                            </div>
                            <span className="w-8 text-sm font-bold text-right text-white">{aqiData.pollutants.o3}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Enhanced AQI Trend Chart with better spacing */}
                {aqiHistory.length > 0 && (
                  <div className="p-4 bg-slate-700/50 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-white">7-Day Trend</h4>
                      <div className="text-xs text-gray-400">Latest Week</div>
                    </div>
                    <div className="flex items-end h-16 space-x-2">
                      {aqiHistory.slice(0, 7).map((item, index) => (
                        <div className="flex flex-col items-center flex-1 space-y-1" key={index}>
                          <div 
                            className="w-full transition-all duration-500 rounded-t hover:opacity-80"
                            style={{ 
                              height: `${Math.min((item.aqi / 200) * 100, 100)}%`,
                              backgroundColor: item.color || '#3B82F6',
                              minHeight: '8px'
                            }}
                          />
                          <div className="text-xs text-gray-400">
                            {new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 1)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Weather Forecast Widget (same size as AQI) */}
              <div className="bg-gradient-to-br from-blue-900/90 via-blue-800/80 to-slate-800/90 rounded-3xl p-8 border border-blue-600/50 backdrop-blur-xl relative overflow-hidden hover:shadow-2xl hover:shadow-blue-900/50 hover:border-blue-500/70 transition-all duration-500 group cursor-pointer transform hover:scale-[1.01]"
                   style={{
                     boxShadow: '0 0 30px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                   }}
                   onClick={() => navigate('/dashboard')}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-yellow-500/20 rounded-xl">
                      <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold tracking-tight text-white">Weather Forecast</h3>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button 
                      className="px-3 py-1.5 bg-blue-500/20 text-blue-300 text-xs font-medium rounded-full border border-blue-500/30 hover:bg-blue-500/40 hover:border-blue-400/50 hover:text-blue-200 hover:scale-105 transition-all duration-300 transform"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/dashboard');
                      }}
                    >
                      View Dashboard
                    </button>
                    <div className="text-3xl transition-all duration-500 transform group-hover:scale-125 group-hover:rotate-12">
                      {weatherData?.icon ? (
                        (() => {
                          const IconComponent = getIconComponent(weatherData.icon);
                          return <IconComponent className="w-12 h-12 text-blue-400 drop-shadow-lg" />;
                        })()
                      ) : (
                        <Sun className="w-12 h-12 text-yellow-400 drop-shadow-lg" />
                      )}
                    </div>
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
                    <div className="relative text-center">
                      <div className="mb-2 text-6xl font-bold text-white">
                        {weatherData?.temperature || 30}°C
                      </div>
                      <div className="mb-6 text-sm text-blue-200">
                        {weatherData?.condition || 'Sunny & Clear'}
                      </div>
                      
                      {/* Enhanced Weather Details */}
                      <div className="grid grid-cols-3 gap-6 mb-8">
                        <div className="p-4 text-center transition-all duration-300 border cursor-pointer bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 hover:scale-105 group border-white/5 hover:border-white/20">
                          <Droplets className="w-8 h-8 mx-auto mb-2 text-blue-300 transition-all duration-300 group-hover:scale-125 group-hover:text-blue-200" />
                          <div className="mb-1 text-xs font-medium tracking-wider text-blue-200 uppercase">Humidity</div>
                          <div className="text-lg font-bold text-white">
                            {weatherData?.humidity || 68}%
                          </div>
                          <div className="w-full bg-blue-900/30 rounded-full h-1.5 mt-2">
                            <div 
                              className="bg-gradient-to-r from-blue-400 to-blue-300 h-1.5 rounded-full transition-all duration-1000"
                              style={{ width: `${weatherData?.humidity || 68}%` }}
                            />
                          </div>
                        </div>
                        <div className="p-4 text-center transition-all duration-300 border cursor-pointer bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 hover:scale-105 group border-white/5 hover:border-white/20">
                          <Wind className="w-8 h-8 mx-auto mb-2 text-green-300 transition-all duration-300 group-hover:scale-125 group-hover:text-green-200" />
                          <div className="mb-1 text-xs font-medium tracking-wider text-blue-200 uppercase">Wind Speed</div>
                          <div className="text-lg font-bold text-white">
                            {weatherData?.windStatus || 12} km/h
                          </div>
                          <div className="w-full bg-green-900/30 rounded-full h-1.5 mt-2">
                            <div 
                              className="bg-gradient-to-r from-green-400 to-green-300 h-1.5 rounded-full transition-all duration-1000"
                              style={{ width: `${Math.min((weatherData?.windStatus || 12) / 50 * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                        <div className="p-4 text-center transition-all duration-300 border cursor-pointer bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 hover:scale-105 group border-white/5 hover:border-white/20">
                          <Sun className="w-8 h-8 mx-auto mb-2 text-orange-300 transition-all duration-300 group-hover:scale-125 group-hover:text-orange-200" />
                          <div className="mb-1 text-xs font-medium tracking-wider text-blue-200 uppercase">UV Index</div>
                          <div className="text-lg font-bold text-white">
                            {Math.round(weatherData?.uvIndex || 0)}
                          </div>
                          <div className="w-full bg-orange-900/30 rounded-full h-1.5 mt-2">
                            <div 
                              className={`h-1.5 rounded-full transition-all duration-1000 ${
                                Math.round(weatherData?.uvIndex || 0) <= 2 ? 'bg-gradient-to-r from-green-400 to-green-300' :
                                Math.round(weatherData?.uvIndex || 0) <= 5 ? 'bg-gradient-to-r from-yellow-400 to-yellow-300' :
                                Math.round(weatherData?.uvIndex || 0) <= 7 ? 'bg-gradient-to-r from-orange-400 to-orange-300' :
                                'bg-gradient-to-r from-red-400 to-red-300'
                              }`}
                              style={{ width: `${Math.min((Math.round(weatherData?.uvIndex || 0)) / 12 * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Real 7-Day Forecast */}
                      <div className="p-3 bg-white/10 rounded-xl">
                        <div className="mb-3 text-xs font-medium tracking-wider text-blue-200 uppercase">7-Day Forecast</div>
                        {forecastData?.daily ? (
                          <div className="grid grid-cols-7 gap-1">
                            {forecastData.daily.slice(0, 7).map((item, index) => {
                              const IconComponent = getIconComponent(item.icon);
                              return (
                                <div key={index} className="p-2 text-center transition-all duration-300 border rounded-lg cursor-pointer bg-white/5 hover:bg-white/15 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/20 border-white/5 hover:border-blue-400/30">
                                  <div className="mb-1 text-xs font-medium text-blue-200">{item.day}</div>
                                  <IconComponent className="w-5 h-5 mx-auto my-1 text-blue-300" />
                                  <div className="text-sm font-bold text-white">{item.high}°</div>
                                  <div className="text-xs text-blue-300">{item.low}°</div>
                                  {item.chanceOfRain > 0 && (
                                    <div className="mt-1 text-xs text-blue-400">{item.chanceOfRain}%</div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="h-16">
                            <WeatherForecastChart forecastData={forecastData} className="h-full" />
                          </div>
                        )}
                      </div>
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
                  {multipleCitiesAQI.slice(0, 7).map((cityData, index) => {
                    const positions = [
                      { top: '20%', left: '15%' },
                      { top: '15%', left: '30%' },
                      { top: '25%', left: '50%' },
                      { top: '10%', left: '70%' },
                      { bottom: '30%', left: '25%' },
                      { bottom: '20%', left: '60%' },
                      { bottom: '35%', left: '80%' }
                    ];
                    const position = positions[index] || positions[0];
                    
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