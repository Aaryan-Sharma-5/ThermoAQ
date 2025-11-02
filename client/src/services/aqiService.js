import { calculateAQI, getAQIInfo, INDIAN_CITIES_DATA, generateAQIHistory } from '../utils/environmentalUtils.js';

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY || '';
const WEATHER_API_BASE = 'http://api.weatherapi.com/v1';

// Enhanced alternative APIs for comprehensive accurate data
const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || '';
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
      // Try WeatherAPI first for actual air quality data
      const response = await fetch(
        `${WEATHER_API_BASE}/current.json?key=${WEATHER_API_KEY}&q=${city}&aqi=yes`
      );
      
      if (response.ok) {
        const data = await response.json();
        const airQuality = data?.current?.air_quality;
        
        if (airQuality) {
          // Use real API data when available
          const pm25 = airQuality.pm2_5 || 0;
          const pm10 = airQuality.pm10 || 0;
          const co = airQuality.co || 0;
          const no2 = airQuality.no2 || 0;
          const so2 = airQuality.so2 || 0;
          const o3 = airQuality.o3 || 0;
          
          // Calculate AQI from the dominant pollutant
          const pm25AQI = this.calculateAQIFromPM(pm25);
          const calculatedAQI = Math.max(pm25AQI, Math.round(pm10 * 0.6), Math.round(o3 * 1.2));
          
          const aqiInfo = this.getAQILevel(calculatedAQI);
          
          // Get correct state from our city mapping
          const cityData = Object.entries(INDIAN_CITIES_DATA).find(([name]) => 
            city.toLowerCase().includes(name.toLowerCase())
          );
          const correctState = cityData ? cityData[1].state : data.location.region;
          const correctCityName = cityData ? cityData[0] : data.location.name;
          
          const aqiData = {
            aqi: calculatedAQI,
            level: aqiInfo.level,
            color: aqiInfo.color,
            description: aqiInfo.description,
            location: `${correctCityName}, ${correctState}`,
            pollutants: {
              pm25: Math.round(pm25),
              pm10: Math.round(pm10),
              co: Math.round(co * 1000), // Convert to µg/m³
              no2: Math.round(no2),
              so2: Math.round(so2),
              o3: Math.round(o3)
            },
            source: 'WeatherAPI',
            timestamp: new Date().toISOString()
          };
          
          this.setCacheData(cacheKey, aqiData);
          return aqiData;
        }
      }
      
      // Fallback to realistic simulated data based on current conditions
      return this.getRealisticAQIData(city);
      
    } catch (error) {
      console.error('Failed to fetch air quality:', error);
      return this.getRealisticAQIData(city);
    }
  }

  // Generate realistic AQI data based on actual environmental factors
  getRealisticAQIData(city) {
    const cityData = Object.entries(INDIAN_CITIES_DATA).find(([name]) => 
      city.toLowerCase().includes(name.toLowerCase())
    );
    
    const cityInfo = cityData ? cityData[1] : INDIAN_CITIES_DATA['Mumbai'];
    const cityName = cityData ? cityData[0] : 'Mumbai';
    const stateName = cityData ? cityData[1].state : 'Maharashtra';
    
    const now = new Date();
    const hour = now.getHours();
    const month = now.getMonth(); // 0-11
    const dayOfWeek = now.getDay(); // 0 = Sunday
    
    // Realistic time-based factors
    const rushHourMultiplier = (hour >= 7 && hour <= 10) || (hour >= 17 && hour <= 20) ? 1.4 : 
                               (hour >= 23 || hour <= 5) ? 0.7 : 1.0;
    
    // Seasonal factors (winter pollution is higher in North India)
    const winterMonths = [10, 11, 0, 1, 2]; // Nov-Feb
    const isWinter = winterMonths.includes(month);
    const isNorthernCity = cityInfo.coords[0] > 23; // Above Tropic of Cancer
    const seasonalMultiplier = (isWinter && isNorthernCity) ? 1.6 : 
                              isWinter ? 1.2 : 
                              (month >= 3 && month <= 5) ? 1.1 : 0.9; // Summer months slightly higher
    
    // Weekend effect (lower traffic on weekends)
    const weekendMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.8 : 1.0;
    
    // Calculate realistic AQI
    const baseAQI = cityInfo.baseAQI;
    const variation = cityInfo.seasonalVariation * (Math.random() - 0.5); // Random daily variation
    
    const calculatedAQI = Math.round(
      baseAQI * 
      rushHourMultiplier * 
      seasonalMultiplier * 
      weekendMultiplier * 
      cityInfo.industrialFactor + 
      variation
    );
    
    const finalAQI = Math.max(15, Math.min(350, calculatedAQI));
    
    // Calculate realistic pollutant concentrations based on AQI
    const pm25 = Math.round(finalAQI * 0.65 + (Math.random() - 0.5) * 10);
    const pm10 = Math.round(finalAQI * 1.1 + (Math.random() - 0.5) * 15);
    const co = Math.round(finalAQI * 12 + 300 + (Math.random() - 0.5) * 100);
    const no2 = Math.round(finalAQI * 0.45 + 15 + (Math.random() - 0.5) * 8);
    const so2 = Math.round(finalAQI * 0.25 + 8 + (Math.random() - 0.5) * 5);
    const o3 = Math.round(finalAQI * 0.6 + 25 + (Math.random() - 0.5) * 12);
    
    const aqiInfo = this.getAQILevel(finalAQI);
    
    return {
      aqi: finalAQI,
      level: aqiInfo.level,
      color: aqiInfo.color,
      description: aqiInfo.description,
      location: `${cityName}, ${stateName}`,
      pollutants: {
        pm25: Math.max(5, pm25),
        pm10: Math.max(10, pm10),
        co: Math.max(200, co),
        no2: Math.max(8, no2),
        so2: Math.max(3, so2),
        o3: Math.max(15, o3)
      },
      source: 'Realistic Simulation',
      timestamp: new Date().toISOString(),
      factors: {
        rushHour: rushHourMultiplier > 1,
        winter: isWinter,
        weekend: dayOfWeek === 0 || dayOfWeek === 6,
        industrial: cityInfo.industrialFactor > 1
      }
    };
  }

  async getAQIHistory(city = 'Mumbai', days = 7) {
    const cacheKey = `history_${city}_${days}`;
    const cached = this.getCachedData(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      // Get current AQI data to base the history on
      const currentAQI = await this.getAirQuality(city);
      const baseAQI = currentAQI.aqi;
      
      // Generate realistic historical variations
      const history = generateAQIHistory(baseAQI, days);
      
      this.setCacheData(cacheKey, history);
      return history;
      
    } catch (error) {
      console.error('Failed to generate AQI history:', error);
      
      // Fallback to realistic generated history
      const cityData = Object.entries(INDIAN_CITIES_DATA).find(([name]) => 
        city.toLowerCase().includes(name.toLowerCase())
      );
      const baseAQI = cityData ? cityData[1].baseAQI : 85;
      
      return generateAQIHistory(baseAQI, days);
    }
  }

  async getMultipleCitiesAQI(cities = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune']) {
    const cacheKey = `multi_cities_${cities.join('_')}`;
    const cached = this.getCachedData(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      // Fetch AQI data for all cities in parallel
      const promises = cities.map(async city => {
        const aqiData = await this.getAirQuality(city);
        const coords = this.getCityCoordinates(city);
        
        return {
          city,
          aqi: aqiData.aqi,
          level: aqiData.level,
          color: aqiData.color,
          coordinates: coords,
          pollutants: aqiData.pollutants,
          source: aqiData.source
        };
      });
      
      const results = await Promise.all(promises);
      this.setCacheData(cacheKey, results);
      return results;
      
    } catch (error) {
      console.error('Failed to fetch multiple cities AQI:', error);
      
      // Fallback to realistic simulated data
      return cities.map(city => {
        const aqiData = this.getRealisticAQIData(city);
        const coords = this.getCityCoordinates(city);
        
        return {
          city,
          aqi: aqiData.aqi,
          level: aqiData.level,
          color: aqiData.color,
          coordinates: coords,
          pollutants: aqiData.pollutants,
          source: aqiData.source
        };
      });
    }
  }

  getCityCoordinates(city) {
    const cityData = Object.entries(INDIAN_CITIES_DATA).find(([name]) => 
      city.toLowerCase().includes(name.toLowerCase())
    );
    
    if (cityData) {
      return cityData[1].coords;
    }
    
    // Default to Mumbai coordinates if city not found
    return INDIAN_CITIES_DATA['Mumbai'].coords;
  }
}

// Create and export a singleton instance
const aqiService = new AQIService();
export default aqiService;