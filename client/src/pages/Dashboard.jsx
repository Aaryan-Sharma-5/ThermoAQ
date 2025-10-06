import React, { useState, useEffect } from 'react';
import { Header } from '../layout/Header';
import { 
  WeatherCard, 
  MetricCard, 
  WeeklyForecast, 
  TomorrowCard, 
  OtherCitiesCard, 
  ChartCard 
} from '../components/dashboard/WeatherWidgets';
import weatherService from '../services/weatherService';

const Dashboard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const [currentWeather, forecast, airQuality, otherCities] = await Promise.all([
          weatherService.getCurrentWeather('Mumbai'),
          weatherService.getForecast('Mumbai'),
          weatherService.getAirQuality('Mumbai'),
          weatherService.getMultipleCities(['Beijing', 'California', 'Delhi'])
        ]);

        setWeatherData({
          current: currentWeather,
          forecast: forecast,
          airQuality: airQuality,
          otherCities: otherCities,
          uvIndex: currentWeather.uvIndex,
          humidity: currentWeather.humidity,
          visibility: currentWeather.visibility,
          windStatus: currentWeather.windStatus,
          tomorrow: forecast.tomorrow || {
            temperature: 72,
            condition: 'sunny',
            humidity: 68,
            windSpeed: 12,
            visibility: 10
          }
        });
        
      } catch (error) {
        console.error('Failed to fetch weather data:', error);
        
        // Fallback data
        const mockWeatherData = {
          current: {
            location: 'Mumbai, Maharashtra',
            temperature: 16,
            condition: 'Cloudy',
            icon: '☁️',
            details: [
              'Real Feel 19°',
              'Wind E 7 km/h',
              'Pressure 1028 mb',
              'Humidity 94%'
            ]
          },
          uvIndex: 5.50,
          humidity: 68,
          visibility: 8.2,
          windStatus: 12.5,
          tomorrow: {
            temperature: 72,
            condition: 'sunny',
            humidity: 68,
            windSpeed: 12,
            visibility: 10
          }
        };
        setWeatherData(mockWeatherData);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-xl text-white">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <div className="p-6 mx-auto max-w-7xl">
        <div className="grid min-h-screen grid-cols-12 gap-4">
          
          <WeatherCard data={weatherData?.current} />
          <WeeklyForecast data={weatherData?.forecast} />

          <div className="col-span-4 p-6 bg-gray-800 rounded-2xl">
            <h3 className="mb-2 text-lg font-medium text-white">Weather Insights</h3>
            <p className="mb-4 text-sm text-gray-400">
              Get detailed forecasts and weather analytics for better planning.
            </p>
            <button className="px-4 py-2 text-sm text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
              Get Started
            </button>
          </div>

          <ChartCard title="Chance of Rain">
            <div className="flex items-center justify-center w-full h-full rounded bg-gradient-to-r from-blue-500/20 to-blue-600/20">
              <span className="text-2xl text-blue-400">📊</span>
            </div>
          </ChartCard>

          <MetricCard 
            title="Wind Status" 
            value={weatherData?.windStatus} 
            unit="km/h" 
            icon="💨" 
          />
          
          <MetricCard 
            title="UV Index" 
            value={weatherData?.uvIndex} 
            unit="Good" 
            icon="☀️" 
          />
          
          <MetricCard 
            title="Humidity" 
            value={weatherData?.humidity} 
            unit="%" 
            icon="💧" 
          />
          
          <MetricCard 
            title="Visibility" 
            value={weatherData?.visibility} 
            unit="km" 
            icon="👁️" 
          />

          <TomorrowCard data={weatherData?.tomorrow} />
          <OtherCitiesCard data={weatherData?.otherCities} />
          
          <ChartCard title="Global Weather Map" colSpan={6}>
            <span className="text-4xl text-gray-500">🗺️</span>
          </ChartCard>

          <ChartCard title="24 Hour Forecast">
            <span className="text-2xl text-gray-500">📈</span>
          </ChartCard>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;