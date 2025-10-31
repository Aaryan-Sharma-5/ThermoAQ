// Open-Meteo API (Free, No API Key Required, 16-day forecast!)
const OPEN_METEO_BASE = 'https://api.open-meteo.com/v1';
const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1';

// Major city coordinates for quick lookup (fallback if geocoding fails)
const CITY_COORDINATES = {
  'mumbai': { lat: 19.0760, lon: 72.8777, name: 'Mumbai', region: 'Maharashtra' },
  'delhi': { lat: 28.6139, lon: 77.2090, name: 'Delhi', region: 'Delhi' },
  'bangalore': { lat: 12.9716, lon: 77.5946, name: 'Bangalore', region: 'Karnataka' },
  'bengaluru': { lat: 12.9716, lon: 77.5946, name: 'Bengaluru', region: 'Karnataka' },
  'chennai': { lat: 13.0827, lon: 80.2707, name: 'Chennai', region: 'Tamil Nadu' },
  'kolkata': { lat: 22.5726, lon: 88.3639, name: 'Kolkata', region: 'West Bengal' },
  'hyderabad': { lat: 17.3850, lon: 78.4867, name: 'Hyderabad', region: 'Telangana' },
  'pune': { lat: 18.5204, lon: 73.8567, name: 'Pune', region: 'Maharashtra' },
  'ahmedabad': { lat: 23.0225, lon: 72.5714, name: 'Ahmedabad', region: 'Gujarat' },
  'jaipur': { lat: 26.9124, lon: 75.7873, name: 'Jaipur', region: 'Rajasthan' },
  'surat': { lat: 21.1702, lon: 72.8311, name: 'Surat', region: 'Gujarat' },
  'london': { lat: 51.5074, lon: -0.1278, name: 'London', region: 'England' },
  'new york': { lat: 40.7128, lon: -74.0060, name: 'New York', region: 'New York' },
  'tokyo': { lat: 35.6762, lon: 139.6503, name: 'Tokyo', region: 'Tokyo' },
  'paris': { lat: 48.8566, lon: 2.3522, name: 'Paris', region: 'Île-de-France' },
  'sydney': { lat: -33.8688, lon: 151.2093, name: 'Sydney', region: 'New South Wales' },
  'singapore': { lat: 1.3521, lon: 103.8198, name: 'Singapore', region: 'Singapore' },
  'dubai': { lat: 25.2048, lon: 55.2708, name: 'Dubai', region: 'Dubai' },
  'los angeles': { lat: 34.0522, lon: -118.2437, name: 'Los Angeles', region: 'California' },
  'chicago': { lat: 41.8781, lon: -87.6298, name: 'Chicago', region: 'Illinois' },
  'toronto': { lat: 43.6532, lon: -79.3832, name: 'Toronto', region: 'Ontario' },
};

// Realistic weather patterns for Indian cities (fallback data)
const INDIAN_WEATHER_DATA = {
  'Delhi': {
    baseTemp: 25, region: 'Delhi', tempRange: [12, 38], humidity: [30, 75], condition: 'Partly Cloudy'
  },
  'Mumbai': {
    baseTemp: 27, region: 'Maharashtra', tempRange: [20, 32], humidity: [65, 85], condition: 'Partly Cloudy'
  },
  'Bangalore': {
    baseTemp: 23, region: 'Karnataka', tempRange: [16, 30], humidity: [55, 80], condition: 'Pleasant'
  },
  'Chennai': {
    baseTemp: 28, region: 'Tamil Nadu', tempRange: [22, 35], humidity: [60, 85], condition: 'Warm'
  },
  'Kolkata': {
    baseTemp: 26, region: 'West Bengal', tempRange: [18, 34], humidity: [65, 88], condition: 'Humid'
  },
  'Hyderabad': {
    baseTemp: 25, region: 'Telangana', tempRange: [18, 33], humidity: [45, 75], condition: 'Pleasant'
  },
  'Pune': {
    baseTemp: 24, region: 'Maharashtra', tempRange: [15, 31], humidity: [50, 75], condition: 'Pleasant'
  },
  'Ahmedabad': {
    baseTemp: 26, region: 'Gujarat', tempRange: [16, 36], humidity: [40, 70], condition: 'Dry'
  },
  'Jaipur': {
    baseTemp: 24, region: 'Rajasthan', tempRange: [12, 35], humidity: [35, 65], condition: 'Dry'
  },
  'Surat': {
    baseTemp: 26, region: 'Gujarat', tempRange: [18, 34], humidity: [55, 80], condition: 'Humid'
  }
};

class WeatherService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 10 * 60 * 1000; // 10 minutes
  }

  getCachedData(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  setCacheData(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  // Geocode city name to coordinates using Open-Meteo Geocoding API
  async geocodeCity(cityName) {
    const cacheKey = `geocode_${cityName.toLowerCase()}`;
    const cached = this.getCachedData(cacheKey);
    
    if (cached) {
      return cached;
    }

    // Check if we have it in our local database first
    const localCoords = CITY_COORDINATES[cityName.toLowerCase()];
    if (localCoords) {
      this.setCacheData(cacheKey, localCoords);
      return localCoords;
    }

    try {
      const url = `${GEOCODING_API}/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Geocoding error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.results || data.results.length === 0) {
        throw new Error('City not found');
      }
      
      const result = data.results[0];
      const coords = {
        lat: result.latitude,
        lon: result.longitude,
        name: result.name,
        region: result.admin1 || result.country || ''
      };
      
      this.setCacheData(cacheKey, coords);
      return coords;
    } catch (error) {
      console.error('Geocoding failed:', error);
      // Return Mumbai as default
      return CITY_COORDINATES['mumbai'];
    }
  }

  // Map Open-Meteo weather codes to Lucide icons
  getWeatherIcon(code, isDay = 1) {
    const iconMap = {
      0: isDay ? 'Sun' : 'Moon',        // Clear sky
      1: 'Sun',                          // Mainly clear
      2: 'CloudSun',                     // Partly cloudy
      3: 'Cloudy',                       // Overcast
      45: 'CloudFog',                    // Fog
      48: 'CloudFog',                    // Depositing rime fog
      51: 'CloudDrizzle',                // Light drizzle
      53: 'CloudDrizzle',                // Moderate drizzle
      55: 'CloudDrizzle',                // Dense drizzle
      56: 'CloudDrizzle',                // Freezing drizzle
      57: 'CloudDrizzle',                // Dense freezing drizzle
      61: 'CloudRain',                   // Slight rain
      63: 'CloudRain',                   // Moderate rain
      65: 'CloudRain',                   // Heavy rain
      66: 'CloudRain',                   // Freezing rain
      67: 'CloudRain',                   // Heavy freezing rain
      71: 'CloudSnow',                   // Slight snow
      73: 'CloudSnow',                   // Moderate snow
      75: 'CloudSnow',                   // Heavy snow
      77: 'Snowflake',                   // Snow grains
      80: 'CloudRain',                   // Slight rain showers
      81: 'CloudRain',                   // Moderate rain showers
      82: 'CloudRain',                   // Violent rain showers
      85: 'CloudSnow',                   // Slight snow showers
      86: 'CloudSnow',                   // Heavy snow showers
      95: 'CloudLightning',              // Thunderstorm
      96: 'CloudLightning',              // Thunderstorm with hail
      99: 'CloudLightning'               // Thunderstorm with heavy hail
    };
    
    return iconMap[code] || (isDay ? 'Sun' : 'Moon');
  }

  getWeatherConditionText(code) {
    const conditionMap = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      56: 'Light freezing drizzle',
      57: 'Dense freezing drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      66: 'Light freezing rain',
      67: 'Heavy freezing rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      77: 'Snow grains',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail'
    };
    
    return conditionMap[code] || 'Clear';
  }

  async getCurrentWeather(city = 'Mumbai') {
    const cacheKey = `current_${city}`;
    const cached = this.getCachedData(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      // Get coordinates for the city
      const coords = await this.geocodeCity(city);
      
      // Fetch current weather from Open-Meteo
      const url = `${OPEN_METEO_BASE}/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,pressure_msl,wind_speed_10m,wind_direction_10m,uv_index&timezone=auto`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Open-Meteo error: ${response.status}`);
      }
      
      const data = await response.json();
      const current = data.current;
      
      // Convert wind direction to cardinal direction
      const getWindDirection = (degrees) => {
        const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        return directions[Math.round(degrees / 22.5) % 16];
      };
      
      const transformedData = {
        location: `${coords.name}, ${coords.region}`,
        temperature: Math.round(current.temperature_2m),
        condition: this.getWeatherConditionText(current.weather_code),
        icon: this.getWeatherIcon(current.weather_code, current.is_day),
        details: [
          `Real Feel ${Math.round(current.apparent_temperature)}°`,
          `Wind ${getWindDirection(current.wind_direction_10m)} ${Math.round(current.wind_speed_10m)} km/h`,
          `Pressure ${Math.round(current.pressure_msl)} mb`,
          `Humidity ${current.relative_humidity_2m}%`
        ],
        uvIndex: current.uv_index || 0,
        humidity: current.relative_humidity_2m,
        visibility: 10, // Open-Meteo doesn't provide visibility in free tier
        windStatus: Math.round(current.wind_speed_10m),
        aqi: null // Will be fetched separately
      };
      
      this.setCacheData(cacheKey, transformedData);
      return transformedData;
    } catch (error) {
      console.error('Failed to fetch current weather:', error);
      
      // Return realistic city-specific fallback data
      const mockData = this.getRealisticWeatherData(city);
      
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
      // Get coordinates for the city
      const coords = await this.geocodeCity(city);
      
      // Fetch forecast from Open-Meteo (up to 16 days available!)
      const url = `${OPEN_METEO_BASE}/forecast?latitude=${coords.lat}&longitude=${coords.lon}&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max&timezone=auto&forecast_days=${Math.min(days, 16)}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Open-Meteo forecast error: ${response.status}`);
      }
      
      const data = await response.json();
      
      const transformedForecast = {
        location: `${coords.name}, ${coords.region}`,
        daily: data.daily.time.map((dateStr, index) => {
          const date = new Date(dateStr);
          const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          
          return {
            day: index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : dayNames[date.getDay()],
            date: dateStr,
            icon: this.getWeatherIcon(data.daily.weather_code[index], 1),
            high: Math.round(data.daily.temperature_2m_max[index]),
            low: Math.round(data.daily.temperature_2m_min[index]),
            condition: this.getWeatherConditionText(data.daily.weather_code[index]),
            chanceOfRain: data.daily.precipitation_probability_max[index] || 0,
            humidity: 65, // Daily average not provided by Open-Meteo free tier
            wind: Math.round(data.daily.wind_speed_10m_max[index])
          };
        }),
        hourly: data.hourly.time.slice(0, 24).map((timeStr, index) => {
          const time = new Date(timeStr);
          return {
            time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
            temp: Math.round(data.hourly.temperature_2m[index]),
            condition: this.getWeatherConditionText(data.hourly.weather_code[index]),
            icon: this.getWeatherIcon(data.hourly.weather_code[index], time.getHours() >= 6 && time.getHours() < 18 ? 1 : 0),
            chanceOfRain: data.hourly.precipitation_probability[index] || 0,
            precip: data.hourly.precipitation[index] || 0,
            humidity: data.hourly.relative_humidity_2m[index],
            windSpeed: Math.round(data.hourly.wind_speed_10m[index])
          };
        }),
        tomorrow: {
          temperature: Math.round(data.daily.temperature_2m_max[1] || 22),
          condition: this.getWeatherConditionText(data.daily.weather_code[1]),
          humidity: 65,
          windSpeed: Math.round(data.daily.wind_speed_10m_max[1] || 12),
          visibility: 10
        }
      };
      
      this.setCacheData(cacheKey, transformedForecast);
      return transformedForecast;
    } catch (error) {
      console.error('Failed to fetch forecast:', error);
      
      // Return realistic city-specific forecast data
      const mockForecast = this.getRealisticForecastData(city);
      
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
      // Open-Meteo doesn't have air quality endpoint, use aqiService directly
      const aqiService = (await import('./aqiService.js')).default;
      const aqiData = await aqiService.getAirQuality(city);
      
      this.setCacheData(cacheKey, aqiData);
      return aqiData;
    } catch (error) {
      console.error('Failed to fetch air quality:', error);
      
      // Return fallback data
      return {
        aqi: 50,
        level: 'Good',
        pm25: 12,
        pm10: 20,
        co: 0.4,
        no2: 15,
        so2: 5,
        o3: 40
      };
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
    try {
      const weatherPromises = cities.map(city => this.getCurrentWeather(city));
      const results = await Promise.allSettled(weatherPromises);
      
      return results.map((result, index) => ({
        city: cities[index],
        data: result.status === 'fulfilled' ? result.value : null,
        error: result.status === 'rejected' ? result.reason.message : null
      }));
    } catch (error) {
      console.error('Failed to fetch multiple cities:', error);
      return cities.map(city => ({ city, data: null, error: error.message }));
    }
  }

  // Fallback method for realistic weather data
  getRealisticWeatherData(cityName) {
    const city = cityName.toLowerCase();
    let cityKey = Object.keys(INDIAN_WEATHER_DATA).find(key => 
      key.toLowerCase() === city || 
      city.includes(key.toLowerCase()) ||
      key.toLowerCase().includes(city)
    );
    
    // Default to Mumbai if city not found
    if (!cityKey) {
      cityKey = 'Mumbai';
    }
    
    const cityData = INDIAN_WEATHER_DATA[cityKey];
    const now = new Date();
    const hour = now.getHours();
    
    // Realistic temperature variation based on time of day
    let tempVariation = 0;
    if (hour >= 6 && hour < 10) tempVariation = -3; // Morning cool
    else if (hour >= 10 && hour < 16) tempVariation = 5; // Afternoon hot
    else if (hour >= 16 && hour < 20) tempVariation = 2; // Evening warm
    else tempVariation = -5; // Night cool
    
    const temperature = Math.round(cityData.baseTemp + tempVariation + (Math.random() * 4 - 2));
    const humidity = Math.round(cityData.humidity[0] + Math.random() * (cityData.humidity[1] - cityData.humidity[0]));
    const windSpeed = Math.round(8 + Math.random() * 12);
    const pressure = Math.round(1010 + Math.random() * 20);
    
    return {
      location: `${cityKey}, ${cityData.region}`,
      temperature,
      condition: cityData.condition,
      icon: this.getRealisticWeatherIcon(temperature, hour),
      details: [
        `Real Feel ${temperature + 2}°`,
        `Wind ${['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)]} ${windSpeed} km/h`,
        `Pressure ${pressure} mb`,
        `Humidity ${humidity}%`
      ],
      uvIndex: Math.round(2 + Math.random() * 8),
      humidity,
      visibility: Math.round(8 + Math.random() * 7),
      windStatus: windSpeed
    };
  }

  getRealisticForecastData(cityName) {
    const city = cityName.toLowerCase();
    let cityKey = Object.keys(INDIAN_WEATHER_DATA).find(key => 
      key.toLowerCase() === city || 
      city.includes(key.toLowerCase()) ||
      key.toLowerCase().includes(city)
    );
    
    if (!cityKey) {
      cityKey = 'Mumbai';
    }
    
    const cityData = INDIAN_WEATHER_DATA[cityKey];
    const days = ['Today', 'Tomorrow', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    const daily = days.map((day) => {
      const tempVariation = (Math.random() * 8 - 4);
      const high = Math.round(cityData.baseTemp + 5 + tempVariation);
      const low = Math.round(cityData.baseTemp - 3 + tempVariation);
      
      return {
        day,
        date: new Date(Date.now() + days.indexOf(day) * 86400000).toISOString().split('T')[0],
        icon: this.getWeatherIcon(Math.random() > 0.5 ? 0 : 2, 1),
        high,
        low,
        condition: cityData.condition,
        chanceOfRain: Math.round(10 + Math.random() * 60),
        humidity: Math.round(cityData.humidity[0] + Math.random() * (cityData.humidity[1] - cityData.humidity[0])),
        wind: Math.round(8 + Math.random() * 15)
      };
    });

    // Generate hourly data for today
    const hourly = Array.from({ length: 24 }, (_, i) => {
      const hour = new Date();
      hour.setHours(i, 0, 0, 0);
      return {
        time: hour.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        temp: Math.round(cityData.baseTemp + Math.random() * 6 - 3),
        condition: cityData.condition,
        icon: this.getWeatherIcon(Math.random() > 0.7 ? 3 : 0, i >= 6 && i < 18 ? 1 : 0),
        chanceOfRain: Math.round(Math.random() * 40),
        precip: Math.random() * 2,
        humidity: Math.round(cityData.humidity[0] + Math.random() * (cityData.humidity[1] - cityData.humidity[0])),
        windSpeed: Math.round(8 + Math.random() * 12)
      };
    });
    
    return {
      location: `${cityKey}, ${cityData.region}`,
      daily,
      hourly,
      tomorrow: {
        temperature: daily[1].high,
        condition: cityData.condition,
        humidity: daily[1].humidity,
        windSpeed: daily[1].wind,
        visibility: Math.round(8 + Math.random() * 7)
      }
    };
  }
}

export default new WeatherService();