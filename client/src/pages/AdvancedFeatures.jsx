import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Header } from '../layout/Header';
import { ExportShareFeatures } from '../components/features/ExportShareFeatures';
import { FavoriteLocations } from '../components/features/FavoriteLocations';
import { HourlyTemperatureGraph } from '../components/charts/HourlyTemperatureGraph';
import { PollutantBreakdownDetailed } from '../components/charts/PollutantBreakdownDetailed';
import { SunMoonTimeline } from '../components/charts/SunMoonTimeline';
import { UVIndexGauge } from '../components/charts/UVIndexGauge';
import { WindCompass } from '../components/charts/WindCompass';
import aqiService from '../services/aqiService';
import weatherService from '../services/weatherService';

export function AdvancedFeatures() {
  const { userLocation, fetchUserLocation, user } = useAuth();
  const [selectedLocation, setSelectedLocation] = useState('Mumbai, Maharashtra');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [aqiData, setAqiData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user's saved location on component mount
  useEffect(() => {
    const initializeLocation = async () => {
      try {
        const location = await fetchUserLocation();
        if (location && location.city) {
          const locationString = `${location.city}, ${location.state || 'India'}`;
          setSelectedLocation(locationString);
        }
      } catch (error) {
        console.error('Error fetching user location:', error);
      }
    };

    initializeLocation();
  }, [fetchUserLocation]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const cityName = selectedLocation.split(',')[0].trim();
        
        const [weather, forecast, aqi] = await Promise.all([
          weatherService.getCurrentWeather(cityName),
          weatherService.getForecast(cityName, 7),
          aqiService.getAirQuality(cityName)
        ]);

        setWeatherData(weather);
        setForecastData(forecast);
        setAqiData(aqi);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedLocation]);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header onLocationChange={setSelectedLocation} />

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Banner with User Info */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Welcome back, {user?.name || 'User'}! 👋
              </h2>
              <p className="text-blue-100">
                Your current location: <span className="font-semibold">{selectedLocation}</span>
              </p>
              <p className="text-sm text-blue-200 mt-1">
                {userLocation?.lastUpdated 
                  ? `Last updated: ${new Date(userLocation.lastUpdated).toLocaleString()}`
                  : 'Location auto-detected on login'}
              </p>
            </div>
            <div className="text-right">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-xs text-white mb-1">Premium Features Unlocked</p>
                <p className="text-2xl font-bold text-white">✨</p>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-white text-xl">Loading advanced features...</div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Row 1: Favorite Locations & Export/Share */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <FavoriteLocations
                onLocationSelect={handleLocationSelect}
                currentLocation={selectedLocation}
              />
              <ExportShareFeatures
                weatherData={weatherData}
                aqiData={aqiData}
                locationName={selectedLocation}
              />
            </div>

            {/* Row 2: Hourly Temperature Graph */}
            <HourlyTemperatureGraph hourlyData={forecastData?.hourly} />

            {/* Row 3: Advanced Visualizations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <WindCompass
                windSpeed={weatherData?.windSpeed || 0}
                windDirection={weatherData?.windDirection || 0}
                windGust={weatherData?.windGust}
              />
              <UVIndexGauge uvIndex={weatherData?.uvIndex || 0} />
              <SunMoonTimeline
                sunrise={weatherData?.sunrise || '06:00'}
                sunset={weatherData?.sunset || '18:00'}
                currentTime={new Date()}
              />
            </div>

            {/* Row 4: Detailed Pollutant Breakdown */}
            <PollutantBreakdownDetailed pollutants={aqiData?.pollutants || {}} />

            {/* Info Section */}
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-2xl p-8 border border-blue-500/30">
              <h2 className="text-2xl font-bold text-white mb-4">About Advanced Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
                <div>
                  <h3 className="font-semibold text-blue-400 mb-2">📊 Data Visualizations</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• 24-hour temperature trends with precipitation</li>
                    <li>• Wind direction compass with speed categories</li>
                    <li>• UV index gauge with health recommendations</li>
                    <li>• Sunrise/sunset timeline with moon phases</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-green-400 mb-2">🌍 Location Features</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Auto-detect location with geolocation</li>
                    <li>• Save favorite locations for quick access</li>
                    <li>• Compare weather across multiple cities</li>
                    <li>• Set current location for personalized data</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-purple-400 mb-2">💨 Air Quality Analysis</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Detailed pollutant breakdown (PM2.5, PM10, O₃, etc.)</li>
                    <li>• Health recommendations by AQI level</li>
                    <li>• Pollutant sources and health effects</li>
                    <li>• Sensitive group advisories</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-orange-400 mb-2">📤 Export & Share</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Export weather reports as PDF</li>
                    <li>• Download historical data as CSV</li>
                    <li>• Share on Twitter, Facebook, LinkedIn</li>
                    <li>• Native share API support</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
