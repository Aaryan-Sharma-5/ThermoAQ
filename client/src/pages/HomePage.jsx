import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import landingPageImage from "../assets/images/landingPage.png";
import { WeatherForecastChart } from '../components/charts/ChartComponents';
import { Header } from "../layout/Header";
import aqiService from '../services/aqiService';
import weatherService from '../services/weatherService';

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
  }, []);

  const getAQIColor = (aqi) => {
    if (aqi <= 50) return 'text-green-400';
    if (aqi <= 100) return 'text-yellow-400';
    if (aqi <= 150) return 'text-orange-400';
    return 'text-red-400';
  };

  const getAQIStrokeColor = (aqi) => {
    if (aqi <= 50) return '#10B981';
    if (aqi <= 100) return '#F59E0B';
    if (aqi <= 150) return '#F97316';
    return '#EF4444';
  };

  const handleCitySelectFromMap = (cityName) => {
    const locationString = `${cityName}, India`;
    setSelectedLocation(locationString);
    fetchAllData(locationString);
  };

  // Simple Map Placeholder Component
  const SimpleMapPlaceholder = ({ aqiData = [], selectedCity, onCitySelect, className = "" }) => {
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
            <div className="text-white text-xl mb-4">India AQI Map</div>
            <div className="grid grid-cols-3 gap-4 max-w-md">
              {cityData.map((cityInfo, index) => (
                <div 
                  key={index}
                  className="cursor-pointer transform hover:scale-110 transition-transform duration-200"
                  onClick={() => onCitySelect && onCitySelect(cityInfo.city)}
                >
                  <div 
                    className="w-16 h-16 rounded-full flex flex-col items-center justify-center text-white font-bold border-2 border-white shadow-lg"
                    style={{ backgroundColor: getMapAQIColor(cityInfo.aqi) }}
                  >
                    <div className="text-xs">{cityInfo.aqi}</div>
                    <div className="text-xs">{cityInfo.city.slice(0, 3)}</div>
                  </div>
                  <div className="text-white text-xs text-center mt-1">{cityInfo.city}</div>
                </div>
              ))}
            </div>
            <div className="text-gray-400 text-sm mt-4">Click on any city to view details</div>
          </div>
        </div>
      </div>
    );
  };

  // AQI Modal Component
  const AQIMapModal = () => {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-2xl w-full max-w-6xl h-[90vh] relative overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowAQIMap(false)}
                className="text-white hover:text-gray-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h2 className="text-white text-xl font-bold">AQI Map</h2>
            </div>
            <div className="text-white text-sm">
              {aqiData?.location || selectedLocation}
            </div>
          </div>

          <div className="flex h-[calc(100%-80px)]">
            {/* Left Sidebar */}
            <div className="w-80 bg-gray-900 p-6 overflow-y-auto">
              <div className="mb-6">
                <h3 className="text-white text-lg font-semibold mb-4">Air Quality Map</h3>
                <p className="text-gray-400 text-sm mb-4">{aqiData?.location || selectedLocation}</p>
                
                {/* AQI Value Display */}
                <div className="mb-6">
                  <div 
                    className="text-5xl font-bold mb-2"
                    style={{ color: aqiData?.color || '#F59E0B' }}
                  >
                    {aqiData?.aqi || 64}
                  </div>
                  <div 
                    className="text-sm mb-4"
                    style={{ color: aqiData?.color || '#F59E0B' }}
                  >
                    {aqiData?.level || 'Moderate'}
                  </div>
                  <div className="text-gray-400 text-xs">{aqiData?.description || 'AQI Level'}</div>
                </div>

                {/* Health Icon */}
                <div className="mb-6 flex justify-center">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
                    style={{ backgroundColor: aqiData?.color || '#F59E0B' }}
                  >
                    {(aqiData?.aqi || 64) > 100 ? '😷' : (aqiData?.aqi || 64) > 50 ? '😐' : '😊'}
                  </div>
                </div>

                {/* Pollutant Display */}
                <div className="mb-6">
                  <h4 className="text-white text-sm font-semibold mb-3">Pollutant Breakdown</h4>
                  {aqiData?.pollutants ? (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-300 text-sm">PM2.5</span>
                        <span className="text-white text-sm">{aqiData.pollutants.pm25} μg/m³</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300 text-sm">PM10</span>
                        <span className="text-white text-sm">{aqiData.pollutants.pm10} μg/m³</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300 text-sm">O₃</span>
                        <span className="text-white text-sm">{aqiData.pollutants.o3} μg/m³</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-400 text-sm">Loading pollutant data...</div>
                  )}
                </div>

                {/* History Display */}
                {aqiHistory.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-white text-sm font-semibold mb-3">Recent History</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {aqiHistory.slice(0, 6).map((item, index) => (
                        <div key={index} className="text-center bg-gray-800 rounded p-2">
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
            <div className="flex-1 relative bg-gray-700">
              <SimpleMapPlaceholder 
                aqiData={multipleCitiesAQI}
                selectedCity={selectedLocation.split(',')[0]}
                onCitySelect={handleCitySelectFromMap}
                className="w-full h-full"
              />
              
              {/* Map overlay indicators */}
              <div className="absolute bottom-4 left-4 bg-black/60 rounded-lg p-2">
                <div className="flex items-center space-x-2 text-white text-xs">
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
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${landingPageImage})`,
            }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          <Header onLocationChange={handleLocationChange} />
          <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 pt-20">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-8 tracking-tight">
                ThermoAQ
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 leading-relaxed max-w-3xl mx-auto mb-12">
                India's live district-level danger map—combining IMD heat-wave alerts
                with real-time air-quality data to deliver instant, life-saving risk warnings.
              </p>
            </div>
          </div>
        </section>

        {/* Real-Time Environmental Intelligence Section */}
        <section className="bg-black py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Real-Time Environmental Intelligence
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Monitor, analyze, and stay protected with our comprehensive platform
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {/* Live Map */}
              <div 
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 text-center hover:border-orange-500 transition-colors cursor-pointer"
                onClick={() => navigate('/heatwave')}
              >
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 01.553-.894L9 2l6 3 5.447-2.724A1 1 0 0121 3.382v10.764a1 1 0 01-.553.894L15 18l-6-3z" />
                  </svg>
                </div>
                <h3 className="text-white text-xl font-semibold mb-3">Live Map</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Real-time AQI and heat wave overlays across all Indian districts with interactive visualization.
                </p>
              </div>

              {/* District Analytics */}
              <div 
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 text-center hover:border-red-500 transition-colors cursor-pointer"
                onClick={() => navigate('/analytics')}
              >
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-white text-xl font-semibold mb-3">District Analytics</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Historical trends, forecasting insights, and detailed environmental data analysis.
                </p>
              </div>

              {/* Health Advisories */}
              <div 
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
                onClick={() => navigate('/health-advisory')}
              >
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-white text-xl font-semibold mb-3">Health Advisories</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Personalized health and safety recommendations based on current environmental conditions.
                </p>
              </div>
            </div>

            {/* Enhanced Dashboard Widgets - Top Row (AQI and Weather equal sizes) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              
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
                    <h3 className="text-white text-xl font-bold tracking-tight">Air Quality Index</h3>
                  </div>
                  <div className="flex items-center space-x-2 bg-red-500/10 px-4 py-2 rounded-full border border-red-500/20">
                    <div 
                      className="w-2.5 h-2.5 rounded-full animate-pulse" 
                      style={{ backgroundColor: aqiData?.color || '#EF4444' }}
                    />
                    <span className="text-red-400 text-sm font-medium">Live Data</span>
                  </div>
                </div>
                
                {/* Main AQI Display Section */}
                <div className="relative bg-cover bg-center rounded-2xl overflow-hidden mb-8" 
                     style={{
                       backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?w=600&h=300&fit=crop")',
                       height: '240px'
                     }}>
                  
                  {/* AQI Number and Status*/}
                  <div className="absolute left-8 top-8">
                    <div 
                      className="text-7xl font-bold leading-none"
                      style={{ color: aqiData?.color || '#F59E0B' }}
                    >
                      {aqiData?.aqi || 79}
                    </div>
                  </div>

                  {/* Status and Location */}
                  <div className="absolute left-8 top-32">
                    <div 
                      className="text-xl font-semibold mb-3"
                      style={{ color: aqiData?.color || '#F59E0B' }}
                    >
                      {aqiData?.level || 'Moderate'}
                    </div>
                    <div className="text-sm text-gray-300 bg-black/40 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10">
                      {aqiData?.location || selectedLocation}
                    </div>
                  </div>

                  {/* Enhanced Pollutant Levels */}
                  {aqiData?.pollutants && (
                    <div className="absolute right-8 top-8 space-y-4">
                      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                        <h4 className="text-white text-sm font-semibold mb-3">Pollutant Levels</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300 text-sm font-medium w-12">PM2.5</span>
                            <div className="w-16 h-2 bg-gray-700 rounded-full mx-3">
                              <div 
                                className="h-2 rounded-full transition-all duration-500" 
                                style={{
                                  width: `${Math.min((aqiData.pollutants.pm25 / 100) * 100, 100)}%`,
                                  backgroundColor: aqiData.pollutants.pm25 > 50 ? '#EF4444' : aqiData.pollutants.pm25 > 25 ? '#F59E0B' : '#10B981'
                                }}
                              ></div>
                            </div>
                            <span className="text-white text-sm font-bold w-8 text-right">{aqiData.pollutants.pm25}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300 text-sm font-medium w-12">PM10</span>
                            <div className="w-16 h-2 bg-gray-700 rounded-full mx-3">
                              <div 
                                className="h-2 rounded-full transition-all duration-500" 
                                style={{
                                  width: `${Math.min((aqiData.pollutants.pm10 / 150) * 100, 100)}%`,
                                  backgroundColor: aqiData.pollutants.pm10 > 75 ? '#EF4444' : aqiData.pollutants.pm10 > 50 ? '#F59E0B' : '#10B981'
                                }}
                              ></div>
                            </div>
                            <span className="text-white text-sm font-bold w-8 text-right">{aqiData.pollutants.pm10}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300 text-sm font-medium w-12">O₃</span>
                            <div className="w-16 h-2 bg-gray-700 rounded-full mx-3">
                              <div 
                                className="h-2 rounded-full transition-all duration-500" 
                                style={{
                                  width: `${Math.min((aqiData.pollutants.o3 / 100) * 100, 100)}%`,
                                  backgroundColor: aqiData.pollutants.o3 > 60 ? '#EF4444' : aqiData.pollutants.o3 > 40 ? '#F59E0B' : '#10B981'
                                }}
                              ></div>
                            </div>
                            <span className="text-white text-sm font-bold w-8 text-right">{aqiData.pollutants.o3}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Enhanced AQI Trend Chart with better spacing */}
                {aqiHistory.length > 0 && (
                  <div className="bg-slate-700/50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white text-sm font-semibold">7-Day Trend</h4>
                      <div className="text-gray-400 text-xs">Latest Week</div>
                    </div>
                    <div className="h-16 flex items-end space-x-2">
                      {aqiHistory.slice(0, 7).map((item, index) => (
                        <div className="flex-1 flex flex-col items-center space-y-1" key={index}>
                          <div 
                            className="w-full rounded-t transition-all duration-500 hover:opacity-80"
                            style={{ 
                              height: `${Math.min((item.aqi / 200) * 100, 100)}%`,
                              backgroundColor: item.color || '#3B82F6',
                              minHeight: '8px'
                            }}
                          />
                          <div className="text-gray-400 text-xs">
                            {new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 1)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Weather Forecast Widget */}
              <div className="bg-gradient-to-br from-blue-900/90 via-blue-800/80 to-slate-800/90 rounded-3xl p-8 border border-blue-600/50 backdrop-blur-xl relative overflow-hidden hover:shadow-2xl hover:shadow-blue-900/30 transition-all duration-500 group cursor-pointer"
                   style={{
                     boxShadow: '0 0 30px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                   }}
                   onClick={() => navigate('/weather')}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-yellow-500/20 rounded-xl">
                      <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <h3 className="text-white text-xl font-bold tracking-tight">Weather Forecast</h3>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button 
                      className="px-3 py-1.5 bg-blue-500/20 text-blue-300 text-xs font-medium rounded-full border border-blue-500/30 hover:bg-blue-500/30 transition-all duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/weather');
                      }}
                    >
                      View Dashboard
                    </button>
                    <div className="text-3xl transform group-hover:scale-110 transition-transform duration-300">
                      {weatherData?.icon || '☀️'}
                    </div>
                  </div>
                </div>
                
                {loading ? (
                  <div className="text-center py-12">
                    <div className="relative">
                      <div className="w-16 h-16 mx-auto mb-4">
                        <div className="absolute inset-0 rounded-full border-4 border-blue-400/30"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-t-blue-400 animate-spin"></div>
                      </div>
                      <div className="text-white text-lg font-medium mb-2">Fetching Weather Data</div>
                      <div className="text-blue-200 text-sm">Getting real-time conditions...</div>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="relative text-center">
                      <div className="text-6xl font-bold text-white mb-2">
                        {weatherData?.temperature || 30}°C
                      </div>
                      <div className="text-blue-200 text-sm mb-6">
                        {weatherData?.condition || 'Sunny & Clear'}
                      </div>
                      
                      {/* Enhanced Weather Details */}
                      <div className="grid grid-cols-3 gap-6 mb-8">
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center hover:bg-white/15 transition-all duration-300 group">
                          <div className="text-blue-300 text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">💧</div>
                          <div className="text-blue-200 text-xs font-medium mb-1 uppercase tracking-wider">Humidity</div>
                          <div className="text-white text-lg font-bold">
                            {weatherData?.humidity || 68}%
                          </div>
                          <div className="w-full bg-blue-900/30 rounded-full h-1.5 mt-2">
                            <div 
                              className="bg-gradient-to-r from-blue-400 to-blue-300 h-1.5 rounded-full transition-all duration-1000"
                              style={{ width: `${weatherData?.humidity || 68}%` }}
                            />
                          </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center hover:bg-white/15 transition-all duration-300 group">
                          <div className="text-green-300 text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">🌬️</div>
                          <div className="text-blue-200 text-xs font-medium mb-1 uppercase tracking-wider">Wind Speed</div>
                          <div className="text-white text-lg font-bold">
                            {weatherData?.windStatus || 12} km/h
                          </div>
                          <div className="w-full bg-green-900/30 rounded-full h-1.5 mt-2">
                            <div 
                              className="bg-gradient-to-r from-green-400 to-green-300 h-1.5 rounded-full transition-all duration-1000"
                              style={{ width: `${Math.min((weatherData?.windStatus || 12) / 50 * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center hover:bg-white/15 transition-all duration-300 group">
                          <div className="text-orange-300 text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">☀️</div>
                          <div className="text-blue-200 text-xs font-medium mb-1 uppercase tracking-wider">UV Index</div>
                          <div className="text-white text-lg font-bold">
                            {weatherData?.uvIndex || 8}
                          </div>
                          <div className="w-full bg-orange-900/30 rounded-full h-1.5 mt-2">
                            <div 
                              className={`h-1.5 rounded-full transition-all duration-1000 ${
                                (weatherData?.uvIndex || 8) <= 2 ? 'bg-gradient-to-r from-green-400 to-green-300' :
                                (weatherData?.uvIndex || 8) <= 5 ? 'bg-gradient-to-r from-yellow-400 to-yellow-300' :
                                (weatherData?.uvIndex || 8) <= 7 ? 'bg-gradient-to-r from-orange-400 to-orange-300' :
                                'bg-gradient-to-r from-red-400 to-red-300'
                              }`}
                              style={{ width: `${Math.min((weatherData?.uvIndex || 8) / 12 * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Real 7-Day Forecast */}
                      <div className="bg-white/10 rounded-xl p-3">
                        <div className="text-blue-200 text-xs mb-2">7-Day Forecast</div>
                        {forecastData?.daily ? (
                          <div className="grid grid-cols-7 gap-1">
                            {forecastData.daily.slice(0, 7).map((item, index) => (
                              <div key={index} className="text-center">
                                <div className="text-blue-200 text-xs">{item.day}</div>
                                <div className="text-sm my-1">{item.icon}</div>
                                <div className="text-white text-xs">{item.high}°</div>
                                <div className="text-blue-300 text-xs">{item.low}°</div>
                                {item.chanceOfRain > 0 && (
                                  <div className="text-blue-400 text-xs">{item.chanceOfRain}%</div>
                                )}
                              </div>
                            ))}
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
              <div className="bg-gradient-to-br from-orange-800/90 via-red-800/80 to-red-900/90 rounded-3xl p-8 border border-orange-600/50 backdrop-blur-xl relative overflow-hidden hover:shadow-2xl hover:shadow-orange-900/30 transition-all duration-500 group"
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
                    <h3 className="text-white text-xl font-bold tracking-tight">Environmental Map</h3>
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
                <div className="relative h-64 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 rounded-xl mb-4 overflow-hidden">
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
                          <div className="text-xs leading-none font-normal">{cityData.city.slice(0,3)}</div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Current location marker - centered */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-sm shadow-lg border-4 border-white animate-pulse"
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-black/20 rounded-xl p-4">
                    <div className="text-orange-200 text-xs mb-2">Heat Alert Levels</div>
                    <div className="flex justify-between items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        <span className="text-white text-xs">Caution</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <span className="text-white text-xs">Warning</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <span className="text-white text-xs">Danger</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-black/20 rounded-xl p-4">
                    <div className="text-blue-200 text-xs mb-2">AQI Categories</div>
                    <div className="flex justify-between items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        <span className="text-white text-xs">Good</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <span className="text-white text-xs">Moderate</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <span className="text-white text-xs">Unhealthy</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-black/20 rounded-xl p-4">
                    <div className="text-purple-200 text-xs mb-2">Live Updates</div>
                    <div className="text-white text-sm">
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
        <footer className="bg-black py-8 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">ThermoAQ</h3>
              <p className="text-gray-400 text-sm mb-4">
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