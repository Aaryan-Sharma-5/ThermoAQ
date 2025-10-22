const WEATHER_API_KEY = '8dc24606d7fd46a7a1991208250610';
const WEATHER_API_BASE = 'http://api.weatherapi.com/v1';

class WeatherService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; 
  }

  // Map WeatherAPI condition codes to emojis
  getWeatherIcon(code, isDay = 1) {
    const iconMap = {
      1000: isDay ? '☀️' : '🌙', 
      1003: isDay ? '🌤️' : '☁️', 
      1006: '☁️', // Cloudy
      1030: '🌫️', // Mist
      1063: '🌦️', // Patchy rain possible
      1087: '⛈️', // Thundery outbreaks possible
      1117: '🌨️', // Blizzard
      1135: '🌫️', // Fog
      1183: '🌧️', // Light rain
      1195: '🌧️', // Heavy rain
      1210: '🌨️', // Patchy light snow
      1225: '❄️', // Heavy snow
      1240: '🌦️', // Light rain shower
      1282: '⛈️'  // Moderate or heavy snow with thunder
    };

    return iconMap[code] || (isDay ? '☀️' : '🌙');
  }

  isCacheValid(key) {
    const cached = this.cache.get(key);
    if (!cached) return false;
    
    const now = Date.now();
    return (now - cached.timestamp) < this.cacheTimeout;
  }

  getCachedData(key) {
    if (this.isCacheValid(key)) {
      return this.cache.get(key).data;
    }
    return null;
  }

  setCacheData(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  async getCurrentWeather(city = 'Rameswaram') {
    const cacheKey = `current_${city}`;
    const cached = this.getCachedData(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const url = `${WEATHER_API_BASE}/current.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(city)}&aqi=yes`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`WeatherAPI error: ${response.status}`);
      }
      
      const apiData = await response.json();
      
      const transformedData = {
        location: `${apiData.location.name}, ${apiData.location.region}`,
        temperature: Math.round(apiData.current.temp_c),
        condition: apiData.current.condition.text,
        icon: this.getWeatherIcon(apiData.current.condition.code, apiData.current.is_day),
        details: [
          `Real Feel ${Math.round(apiData.current.feelslike_c)}°`,
          `Wind ${apiData.current.wind_dir} ${apiData.current.wind_kph} km/h`,
          `Pressure ${apiData.current.pressure_mb} mb`,
          `Humidity ${apiData.current.humidity}%`
        ],
        uvIndex: apiData.current.uv,
        humidity: apiData.current.humidity,
        visibility: apiData.current.vis_km,
        windStatus: apiData.current.wind_kph,
        aqi: apiData.current.air_quality ? Math.round(apiData.current.air_quality.pm2_5) : null
      };
      
      this.setCacheData(cacheKey, transformedData);
      return transformedData;
    } catch (error) {
      console.error('Failed to fetch current weather:', error);
      
      // Return Rameswaram specific mock data as fallback
      const mockData = {
        location: 'Rameswaram, Tamil Nadu',
        temperature: 30,
        condition: 'Sunny & Clear',
        icon: '☀️',
        details: [
          'Real Feel 32°',
          'Wind SW 12 km/h',
          'Pressure 1012 mb',
          'Humidity 68%'
        ],
        uvIndex: 8,
        humidity: 68,
        visibility: 10,
        windStatus: 12
      };
      
      this.setCacheData(cacheKey, mockData);
      return mockData;
    }
  }

  async getForecast(city = 'Mumbai', days = 7) {
    const cacheKey = `forecast_${city}_${days}`;
    const cached = this.getCachedData(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const url = `${WEATHER_API_BASE}/forecast.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(city)}&days=${days}&aqi=no&alerts=no`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`WeatherAPI forecast error: ${response.status}`);
      }
      
      const apiData = await response.json();
      
      const transformedForecast = {
        location: `${apiData.location.name}, ${apiData.location.region}`,
        daily: apiData.forecast.forecastday.map((day, index) => {
          const date = new Date(day.date);
          const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          
          return {
            day: index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : dayNames[date.getDay()],
            date: day.date,
            icon: this.getWeatherIcon(day.day.condition.code, 1),
            high: Math.round(day.day.maxtemp_c),
            low: Math.round(day.day.mintemp_c),
            condition: day.day.condition.text,
            chanceOfRain: day.day.daily_chance_of_rain,
            humidity: day.day.avghumidity,
            wind: day.day.maxwind_kph
          };
        }),
        tomorrow: {
          temperature: Math.round(apiData.forecast.forecastday[1]?.day.maxtemp_c || 22),
          condition: apiData.forecast.forecastday[1]?.day.condition.text || 'Sunny',
          humidity: apiData.forecast.forecastday[1]?.day.avghumidity || 68,
          windSpeed: Math.round(apiData.forecast.forecastday[1]?.day.maxwind_kph || 12),
          visibility: Math.round(apiData.forecast.forecastday[1]?.day.avgvis_km || 10)
        }
      };
      
      this.setCacheData(cacheKey, transformedForecast);
      return transformedForecast;
    } catch (error) {
      console.error('Failed to fetch forecast:', error);
      
      // Return mock forecast data
      const mockForecast = {
        daily: [
          { day: 'Today', icon: '🌧️', high: 16, low: 10, chanceOfRain: 80 },
          { day: 'Tomorrow', icon: '⛅', high: 17, low: 11, chanceOfRain: 40 },
          { day: 'Wed', icon: '🌤️', high: 18, low: 12, chanceOfRain: 20 },
          { day: 'Thu', icon: '☀️', high: 19, low: 13, chanceOfRain: 10 },
          { day: 'Fri', icon: '🌩️', high: 20, low: 14, chanceOfRain: 90 },
          { day: 'Sat', icon: '🌤️', high: 21, low: 15, chanceOfRain: 30 },
          { day: 'Sun', icon: '☀️', high: 22, low: 16, chanceOfRain: 5 }
        ],
        tomorrow: {
          temperature: 72,
          condition: 'sunny',
          humidity: 68,
          windSpeed: 12,
          visibility: 10
        }
      };
      
      this.setCacheData(cacheKey, mockForecast);
      return mockForecast;
    }
  }

  async getAirQuality(city = 'Mumbai') {
    const cacheKey = `aqi_${city}`;
    const cached = this.getCachedData(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const currentWeather = await this.getCurrentWeather(city);
      
      if (currentWeather.aqi) {
        const aqiData = {
          aqi: currentWeather.aqi,
          level: this.getAQILevel(currentWeather.aqi),
          pm25: currentWeather.aqi
        };
        
        this.setCacheData(cacheKey, aqiData);
        return aqiData;
      }
      
      throw new Error('AQI data not available');
    } catch (error) {
      console.error('Failed to fetch air quality:', error);
      
      // Return mock AQI data
      const mockAQI = {
        aqi: 68,
        level: 'Moderate',
        pollutants: {
          pm25: 45,
          pm10: 68,
          o3: 23,
          no2: 12
        }
      };
      
      this.setCacheData(cacheKey, mockAQI);
      return mockAQI;
    }
  }

  getAQILevel(aqi) {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  }

  async getMultipleCities(cities = ['Bengaluru', 'Kolkata', 'Delhi']) {
    const promises = cities.map(city => this.getCurrentWeather(city));
    
    try {
      const results = await Promise.all(promises);
      return results.map((data, index) => ({
        name: cities[index],
        temperature: data.temperature
      }));
    } catch (error) {
      console.error('Failed to fetch multiple cities:', error);
      
      // Return mock data 
      return [
        { name: 'Bengaluru', temperature: 8 },
        { name: 'Kolkata', temperature: 28 },
        { name: 'Delhi', temperature: 32 }
      ];
    }
  }
}


export const weatherService = new WeatherService();
export default weatherService;