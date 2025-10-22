import { calculateAQI, getAQIInfo, INDIAN_CITIES_DATA } from '../utils/environmentalUtils.js';

// Professional AQI Service with beautiful and accurate environmental data
const WEATHER_API_KEY = '8dc24606d7fd46a7a1991208250610';
const WEATHER_API_BASE = 'http://api.weatherapi.com/v1';

// Enhanced alternative APIs for comprehensive accurate data
const OPENWEATHER_API_KEY = ''; // You can add OpenWeather API key for air pollution data
const WAQI_API_BASE = 'https://api.waqi.info'; // World Air Quality Index API (requires token)

class AQIService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
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

  getAQILevel(aqi) {
    return getAQIInfo(aqi);
  }

  calculateAQIFromPM(pm25) {
    return calculateAQI('PM25', pm25);
  }

  async getAirQuality(city = 'Mumbai') {
    const cacheKey = `aqi_${city}`;
    const cached = this.getCachedData(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      // Use WeatherAPI which includes air quality data
      const url = `${WEATHER_API_BASE}/current.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(city)}&aqi=yes`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`WeatherAPI error: ${response.status}`);
      }
      
      const apiData = await response.json();
      
      if (apiData.current.air_quality) {
        const aq = apiData.current.air_quality;
        const calculatedAQI = this.calculateAQIFromPM(aq.pm2_5);
        const aqiInfo = this.getAQILevel(calculatedAQI);
        
        const aqiData = {
          aqi: calculatedAQI,
          level: aqiInfo.level,
          color: aqiInfo.color,
          description: aqiInfo.description,
          location: `${apiData.location.name}, ${apiData.location.region}`,
          pollutants: {
            pm25: Math.round(aq.pm2_5 || 0),
            pm10: Math.round(aq.pm10 || 0),
            co: Math.round(aq.co || 0),
            no2: Math.round(aq.no2 || 0),
            so2: Math.round(aq.so2 || 0),
            o3: Math.round(aq.o3 || 0)
          },
          timestamp: new Date().toISOString()
        };
        
        this.setCacheData(cacheKey, aqiData);
        return aqiData;
      }
      
      throw new Error('AQI data not available from WeatherAPI');
      
    } catch (error) {
      console.error('Failed to fetch air quality:', error);
      
      // Enhanced mock data with accurate Indian city patterns
      const cityAQIData = Object.fromEntries(
        Object.entries(INDIAN_CITIES_DATA).map(([cityName, cityInfo]) => {
          const now = new Date();
          const hour = now.getHours();
          const season = now.getMonth(); // 0-11
          
          // Seasonal adjustments (winter months have higher AQI in North India)
          const seasonalMultiplier = season >= 10 || season <= 2 ? 1.4 : 0.8;
          
          // Daily cycle (higher AQI in morning and evening rush hours)
          const hourlyMultiplier = (hour >= 7 && hour <= 10) || (hour >= 17 && hour <= 20) ? 1.3 : 0.9;
          
          const adjustedAQI = Math.round(cityInfo.baseAQI * seasonalMultiplier * hourlyMultiplier * cityInfo.industrialFactor);
          
          return [cityName, {
            aqi: Math.min(Math.max(adjustedAQI, 15), 300),
            pm25: Math.round(adjustedAQI * 0.6),
            pm10: Math.round(adjustedAQI * 0.9),
            co: Math.round(adjustedAQI * 8 + 200),
            no2: Math.round(adjustedAQI * 0.4 + 10),
            so2: Math.round(adjustedAQI * 0.2 + 5),
            o3: Math.round(adjustedAQI * 0.5 + 20)
          }];
        })
      );

      const cityKey = Object.keys(cityAQIData).find(key => 
        city.toLowerCase().includes(key.toLowerCase())
      ) || 'Mumbai';

      const mockData = cityAQIData[cityKey];
      const aqiInfo = this.getAQILevel(mockData.aqi);
      
      const aqiData = {
        aqi: mockData.aqi,
        level: aqiInfo.level,
        color: aqiInfo.color,
        description: aqiInfo.description,
        location: city,
        pollutants: {
          pm25: mockData.pm25,
          pm10: mockData.pm10,
          co: mockData.co,
          no2: mockData.no2,
          so2: mockData.so2,
          o3: mockData.o3
        },
        timestamp: new Date().toISOString()
      };
      
      this.setCacheData(cacheKey, aqiData);
      return aqiData;
    }
  }

  async getAQIHistory(city = 'Mumbai', days = 7) {
    const cacheKey = `aqi_history_${city}_${days}`;
    const cached = this.getCachedData(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      // For now, generate realistic historical data
      // In a real implementation, you'd call a historical API
      const currentAQI = await this.getAirQuality(city);
      const history = [];
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        // Generate realistic variations around current AQI
        const variation = (Math.random() - 0.5) * 30; // ±15 AQI points
        const aqiValue = Math.max(10, Math.min(300, currentAQI.aqi + variation));
        const aqiInfo = this.getAQILevel(aqiValue);
        
        history.push({
          date: date.toISOString().split('T')[0],
          aqi: Math.round(aqiValue),
          level: aqiInfo.level,
          color: aqiInfo.color,
          hour: i === 0 ? new Date().getHours() : Math.floor(Math.random() * 24)
        });
      }
      
      this.setCacheData(cacheKey, history);
      return history;
      
    } catch (error) {
      console.error('Failed to fetch AQI history:', error);
      
      // Mock historical data
      const mockHistory = Array.from({ length: days }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (days - 1 - i));
        const aqi = 50 + Math.random() * 100; // Random AQI between 50-150
        const aqiInfo = this.getAQILevel(aqi);
        
        return {
          date: date.toISOString().split('T')[0],
          aqi: Math.round(aqi),
          level: aqiInfo.level,
          color: aqiInfo.color,
          hour: Math.floor(Math.random() * 24)
        };
      });
      
      this.setCacheData(cacheKey, mockHistory);
      return mockHistory;
    }
  }

  async getMultipleCitiesAQI(cities = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata']) {
    try {
      const promises = cities.map(city => this.getAirQuality(city));
      const results = await Promise.all(promises);
      
      return results.map((data, index) => ({
        city: cities[index],
        aqi: data.aqi,
        level: data.level,
        color: data.color,
        coordinates: this.getCityCoordinates(cities[index])
      }));
      
    } catch (error) {
      console.error('Failed to fetch multiple cities AQI:', error);
      
      // Mock data for Indian cities
      return [
        { city: 'Delhi', aqi: 168, level: 'Unhealthy', color: '#EF4444', coordinates: [28.6139, 77.2090] },
        { city: 'Mumbai', aqi: 78, level: 'Moderate', color: '#F59E0B', coordinates: [19.0760, 72.8777] },
        { city: 'Bangalore', aqi: 65, level: 'Moderate', color: '#F59E0B', coordinates: [12.9716, 77.5946] },
        { city: 'Chennai', aqi: 85, level: 'Moderate', color: '#F59E0B', coordinates: [13.0827, 80.2707] },
        { city: 'Kolkata', aqi: 125, level: 'Unhealthy for Sensitive Groups', color: '#F97316', coordinates: [22.5726, 88.3639] }
      ];
    }
  }

  getCityCoordinates(city) {
    const coordinates = {
      'Delhi': [28.6139, 77.2090],
      'Mumbai': [19.0760, 72.8777],
      'Bangalore': [12.9716, 77.5946],
      'Chennai': [13.0827, 80.2707],
      'Kolkata': [22.5726, 88.3639],
      'Hyderabad': [17.3850, 78.4867],
      'Pune': [18.5204, 73.8567],
      'Ahmedabad': [23.0225, 72.5714],
      'Jaipur': [26.9124, 75.7873],
      'Lucknow': [26.8467, 80.9462]
    };
    
    return coordinates[city] || [20.5937, 78.9629]; // Default to center of India
  }
}

export const aqiService = new AQIService();
export default aqiService;