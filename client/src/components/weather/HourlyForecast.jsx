import { useEffect, useState } from 'react';
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from 'recharts';
import weatherService from '../../services/weatherService';

export function HourlyForecast({ selectedLocation, loading }) {
  const [activeView, setActiveView] = useState('hourly');
  const [hourlyData, setHourlyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  // Generate hourly data from current weather
  const generateHourlyData = (currentTemp) => {
    const now = new Date();
    const data = [];
    
    for (let i = 0; i < 24; i += 3) {
      const time = new Date(now.getTime() + i * 60 * 60 * 1000);
      const hour = time.getHours();
      
      // Simulate temperature variation throughout the day
      let tempVariation = 0;
      if (hour >= 6 && hour < 10) tempVariation = -3;
      else if (hour >= 10 && hour < 16) tempVariation = 5;
      else if (hour >= 16 && hour < 20) tempVariation = 2;
      else tempVariation = -5;
      
      const temp = currentTemp + tempVariation + (Math.random() * 4 - 2);
      
      data.push({
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        temp: Math.round(temp)
      });
    }
    
    return data;
  };

  // Generate daily data from forecast
  const generateDailyData = (forecastData) => {
    if (!forecastData?.daily) return [];
    
    return forecastData.daily.map(day => ({
      time: day.day === 'Today' ? 'Today' : 
            day.day === 'Tomorrow' ? 'Tom' : 
            day.day.slice(0, 3),
      temp: day.high
    }));
  };

  // Generate weekly data
  const generateWeeklyData = (forecastData) => {
    if (!forecastData?.daily) return [];
    
    const weeks = [];
    const dailyData = forecastData.daily;
    
    // Group days into weeks and calculate average
    for (let i = 0; i < 4; i++) {
      const weekStart = i * 7;
      const weekData = dailyData.slice(weekStart, weekStart + 7);
      
      if (weekData.length > 0) {
        const avgTemp = Math.round(
          weekData.reduce((sum, day) => sum + day.high, 0) / weekData.length
        );
        
        weeks.push({
          time: `Week ${i + 1}`,
          temp: avgTemp
        });
      }
    }
    
    return weeks;
  };

  useEffect(() => {
    const fetchHourlyData = async () => {
      if (!selectedLocation) return;
      
      setDataLoading(true);
      try {
        const cityName = selectedLocation.includes(',') ? selectedLocation.split(',')[0].trim() : selectedLocation;
        
        // Fetch current weather and forecast
        const [currentWeather, forecast] = await Promise.all([
          weatherService.getCurrentWeather(cityName),
          weatherService.getForecast(cityName, 7)
        ]);
        
        setHourlyData(generateHourlyData(currentWeather.temperature));
        setDailyData(generateDailyData(forecast));
        setWeeklyData(generateWeeklyData(forecast));
      } catch (error) {
        console.error('Failed to fetch hourly data:', error);
        
        // Fallback data
        setHourlyData([
          { time: '00:00', temp: 25 },
          { time: '03:00', temp: 23 },
          { time: '06:00', temp: 22 },
          { time: '09:00', temp: 28 },
          { time: '12:00', temp: 32 },
          { time: '15:00', temp: 35 },
          { time: '18:00', temp: 33 },
          { time: '21:00', temp: 28 }
        ]);
        setDailyData([
          { time: 'Mon', temp: 28 },
          { time: 'Tue', temp: 30 },
          { time: 'Wed', temp: 25 },
          { time: 'Thu', temp: 27 },
          { time: 'Fri', temp: 32 },
          { time: 'Sat', temp: 29 },
          { time: 'Sun', temp: 26 }
        ]);
        setWeeklyData([
          { time: 'Week 1', temp: 28 },
          { time: 'Week 2', temp: 30 },
          { time: 'Week 3', temp: 27 },
          { time: 'Week 4', temp: 29 }
        ]);
      } finally {
        setDataLoading(false);
      }
    };

    fetchHourlyData();
  }, [selectedLocation]);

  const data = activeView === 'hourly' ? hourlyData : 
               activeView === 'daily' ? dailyData : weeklyData;

  if (loading || dataLoading) {
    return (
      <div className="bg-[#1e2430] rounded-2xl p-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 bg-gray-600 rounded w-40"></div>
            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-600 rounded w-20"></div>
              ))}
            </div>
          </div>
          <div className="h-72 bg-gray-600 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1e2430] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Temperature Forecast</h3>
        <div className="flex gap-2 text-sm">
          <button
            onClick={() => setActiveView('hourly')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeView === 'hourly' ? 'bg-blue-600' : 'bg-[#252d3d] hover:bg-[#2d3548]'
            }`}
          >
            Hourly
          </button>
          <button
            onClick={() => setActiveView('daily')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeView === 'daily' ? 'bg-blue-600' : 'bg-[#252d3d] hover:bg-[#2d3548]'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setActiveView('weekly')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeView === 'weekly' ? 'bg-blue-600' : 'bg-[#252d3d] hover:bg-[#2d3548]'
            }`}
          >
            Weekly
          </button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
          <XAxis dataKey="time" stroke="#718096" fontSize={12} />
          <YAxis stroke="#718096" fontSize={12} />
          <Line
            type="monotone"
            dataKey="temp"
            stroke="#22c55e"
            strokeWidth={3}
            dot={{
              fill: '#22c55e',
              r: 5,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}