import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Header } from '../layout/Header';
import { MultiLocationMonitor } from '../components/features/MultiLocationMonitor';
import { AQIAlerts } from '../components/features/AQIAlerts';
import { PollutionHistory } from '../components/features/PollutionHistory';
import { HealthRecommendations } from '../components/features/HealthRecommendations';
import { ReportDownload } from '../components/features/ReportDownload';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header onLocationChange={setSelectedLocation} />

      <main className="container px-4 py-8 mx-auto">
        {/* Welcome Banner with User Info */}
        <div className="p-6 mb-8 shadow-xl bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="mb-2 text-2xl font-bold text-white">
                Welcome back, {user?.name || 'User'}! 👋
              </h2>
              <p className="text-blue-100">
                Your current location: <span className="font-semibold">{selectedLocation}</span>
              </p>
              <p className="mt-1 text-sm text-blue-200">
                {userLocation?.lastUpdated 
                  ? `Last updated: ${new Date(userLocation.lastUpdated).toLocaleString()}`
                  : 'Location auto-detected on login'}
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-xl text-white">Loading advanced features...</div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Row 1: Multi-Location Monitor & AQI Alerts */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <MultiLocationMonitor />
              <AQIAlerts />
            </div>

            {/* Row 2: Pollution History & Health Recommendations */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <PollutionHistory />
              <HealthRecommendations />
            </div>

            {/* Row 3: Download Report */}
            <ReportDownload />

            {/* Row 4: Hourly Temperature Graph */}
            <HourlyTemperatureGraph hourlyData={forecastData?.hourly} />

            {/* Row 5: Advanced Visualizations */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
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

            {/* Row 6: Detailed Pollutant Breakdown */}
            <PollutantBreakdownDetailed pollutants={aqiData?.pollutants || {}} />
          </div>
        )}
      </main>
    </div>
  );
}
