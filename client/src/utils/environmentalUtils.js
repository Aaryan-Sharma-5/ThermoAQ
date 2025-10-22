// Enhanced utility functions for accurate environmental data calculations and beautiful formatting

// WHO and EPA accurate thresholds for air quality
export const AQI_THRESHOLDS = {
  PM25: {
    good: 12,
    moderate: 35.4,
    unhealthy_sg: 55.4,
    unhealthy: 150.4,
    very_unhealthy: 250.4,
    hazardous: 500.4
  },
  PM10: {
    good: 54,
    moderate: 154,
    unhealthy_sg: 254,
    unhealthy: 354,
    very_unhealthy: 424,
    hazardous: 604
  },
  CO: {
    good: 4.4,
    moderate: 9.4,
    unhealthy_sg: 12.4,
    unhealthy: 15.4,
    very_unhealthy: 30.4,
    hazardous: 50.4
  },
  SO2: {
    good: 35,
    moderate: 75,
    unhealthy_sg: 185,
    unhealthy: 304,
    very_unhealthy: 604,
    hazardous: 1004
  },
  NO2: {
    good: 53,
    moderate: 100,
    unhealthy_sg: 360,
    unhealthy: 649,
    very_unhealthy: 1249,
    hazardous: 2049
  },
  O3: {
    good: 54,
    moderate: 70,
    unhealthy_sg: 85,
    unhealthy: 105,
    very_unhealthy: 200,
    hazardous: 300
  }
};

// Calculate accurate AQI based on pollutant concentration
export const calculateAQI = (pollutant, concentration) => {
  const thresholds = AQI_THRESHOLDS[pollutant];
  if (!thresholds) return 0;

  let aqiLow, aqiHigh, concLow, concHigh;

  if (concentration <= thresholds.good) {
    [aqiLow, aqiHigh] = [0, 50];
    [concLow, concHigh] = [0, thresholds.good];
  } else if (concentration <= thresholds.moderate) {
    [aqiLow, aqiHigh] = [51, 100];
    [concLow, concHigh] = [thresholds.good + 0.1, thresholds.moderate];
  } else if (concentration <= thresholds.unhealthy_sg) {
    [aqiLow, aqiHigh] = [101, 150];
    [concLow, concHigh] = [thresholds.moderate + 0.1, thresholds.unhealthy_sg];
  } else if (concentration <= thresholds.unhealthy) {
    [aqiLow, aqiHigh] = [151, 200];
    [concLow, concHigh] = [thresholds.unhealthy_sg + 0.1, thresholds.unhealthy];
  } else if (concentration <= thresholds.very_unhealthy) {
    [aqiLow, aqiHigh] = [201, 300];
    [concLow, concHigh] = [thresholds.unhealthy + 0.1, thresholds.very_unhealthy];
  } else {
    [aqiLow, aqiHigh] = [301, 500];
    [concLow, concHigh] = [thresholds.very_unhealthy + 0.1, thresholds.hazardous];
  }

  const aqi = Math.round(((aqiHigh - aqiLow) / (concHigh - concLow)) * (concentration - concLow) + aqiLow);
  return Math.min(aqi, 500);
};

// Get comprehensive AQI information
export const getAQIInfo = (aqi) => {
  if (aqi <= 50) return {
    level: 'Good',
    color: '#10B981',
    gradient: ['#10B981', '#34D399'],
    bgColor: 'bg-green-500',
    textColor: 'text-green-400',
    emoji: '😊',
    description: 'Air quality is satisfactory, and air pollution poses little or no risk.',
    healthAdvice: 'Enjoy outdoor activities!',
    glow: 'rgba(16, 185, 129, 0.4)',
    category: 'excellent'
  };
  
  if (aqi <= 100) return {
    level: 'Moderate',
    color: '#F59E0B',
    gradient: ['#F59E0B', '#FBBF24'],
    bgColor: 'bg-yellow-500',
    textColor: 'text-yellow-400',
    emoji: '😐',
    description: 'Air quality is acceptable for most people. Sensitive individuals may experience minor issues.',
    healthAdvice: 'Sensitive people should limit prolonged outdoor exertion.',
    glow: 'rgba(245, 158, 11, 0.4)',
    category: 'acceptable'
  };
  
  if (aqi <= 150) return {
    level: 'Unhealthy for Sensitive Groups',
    color: '#F97316',
    gradient: ['#F97316', '#FB923C'],
    bgColor: 'bg-orange-500',
    textColor: 'text-orange-400',
    emoji: '😷',
    description: 'Sensitive groups may experience health effects. General public is less likely to be affected.',
    healthAdvice: 'Sensitive groups should avoid outdoor activities.',
    glow: 'rgba(249, 115, 22, 0.4)',
    category: 'concerning'
  };
  
  if (aqi <= 200) return {
    level: 'Unhealthy',
    color: '#EF4444',
    gradient: ['#EF4444', '#F87171'],
    bgColor: 'bg-red-500',
    textColor: 'text-red-400',
    emoji: '😨',
    description: 'Everyone may begin to experience health effects. Sensitive groups may experience more serious effects.',
    healthAdvice: 'Everyone should limit outdoor activities.',
    glow: 'rgba(239, 68, 68, 0.4)',
    category: 'unhealthy'
  };
  
  if (aqi <= 300) return {
    level: 'Very Unhealthy',
    color: '#DC2626',
    gradient: ['#DC2626', '#EF4444'],
    bgColor: 'bg-red-600',
    textColor: 'text-red-500',
    emoji: '😰',
    description: 'Health warnings of emergency conditions. Everyone is more likely to be affected.',
    healthAdvice: 'Everyone should avoid outdoor activities.',
    glow: 'rgba(220, 38, 38, 0.4)',
    category: 'dangerous'
  };
  
  return {
    level: 'Hazardous',
    color: '#7F1D1D',
    gradient: ['#7F1D1D', '#DC2626'],
    bgColor: 'bg-red-900',
    textColor: 'text-red-600',
    emoji: '☠️',
    description: 'Health alert: everyone may experience more serious health effects.',
    healthAdvice: 'Everyone should avoid all outdoor activities.',
    glow: 'rgba(127, 29, 29, 0.4)',
    category: 'hazardous'
  };
};

// Weather condition mapping with accurate icons and descriptions
export const getWeatherInfo = (condition, temp) => {
  const conditionLower = condition?.toLowerCase() || '';
  
  const weatherMappings = {
    'clear': { icon: '☀️', emoji: '☀️', description: 'Clear skies', color: '#F59E0B' },
    'sunny': { icon: '☀️', emoji: '☀️', description: 'Sunny weather', color: '#F59E0B' },
    'partly cloudy': { icon: '⛅', emoji: '⛅', description: 'Partly cloudy', color: '#6B7280' },
    'cloudy': { icon: '☁️', emoji: '☁️', description: 'Cloudy skies', color: '#6B7280' },
    'overcast': { icon: '☁️', emoji: '☁️', description: 'Overcast conditions', color: '#6B7280' },
    'rain': { icon: '🌧️', emoji: '🌧️', description: 'Rainy weather', color: '#3B82F6' },
    'drizzle': { icon: '🌦️', emoji: '🌦️', description: 'Light drizzle', color: '#3B82F6' },
    'thunderstorm': { icon: '⛈️', emoji: '⛈️', description: 'Thunderstorms', color: '#7C3AED' },
    'snow': { icon: '🌨️', emoji: '❄️', description: 'Snow fall', color: '#E5E7EB' },
    'fog': { icon: '🌫️', emoji: '🌫️', description: 'Foggy conditions', color: '#9CA3AF' },
    'mist': { icon: '🌫️', emoji: '🌫️', description: 'Misty weather', color: '#9CA3AF' },
    'haze': { icon: '🌫️', emoji: '🌫️', description: 'Hazy atmosphere', color: '#9CA3AF' }
  };

  // Find matching condition
  const matchedCondition = Object.keys(weatherMappings).find(key => 
    conditionLower.includes(key)
  );

  const weatherInfo = matchedCondition ? weatherMappings[matchedCondition] : weatherMappings['clear'];

  // Add temperature-based suggestions
  let tempAdvice = '';
  if (temp <= 10) tempAdvice = 'Bundle up! It\'s quite cold.';
  else if (temp <= 20) tempAdvice = 'Dress warmly, it\'s cool outside.';
  else if (temp <= 30) tempAdvice = 'Perfect weather for outdoor activities!';
  else if (temp <= 40) tempAdvice = 'Stay hydrated, it\'s getting hot.';
  else tempAdvice = 'Extreme heat! Stay indoors and drink plenty of water.';

  return {
    ...weatherInfo,
    tempAdvice,
    category: temp <= 10 ? 'cold' : temp <= 20 ? 'cool' : temp <= 30 ? 'comfortable' : temp <= 40 ? 'hot' : 'extreme'
  };
};

// UV Index information
export const getUVInfo = (uvIndex) => {
  if (uvIndex <= 2) return {
    level: 'Low',
    color: '#10B981',
    advice: 'No protection needed. You can safely enjoy being outside.',
    icon: '🟢'
  };
  if (uvIndex <= 5) return {
    level: 'Moderate',
    color: '#F59E0B',
    advice: 'Some protection required. Seek shade during midday hours.',
    icon: '🟡'
  };
  if (uvIndex <= 7) return {
    level: 'High',
    color: '#F97316',
    advice: 'Protection essential. Avoid being outside during midday hours.',
    icon: '🟠'
  };
  if (uvIndex <= 10) return {
    level: 'Very High',
    color: '#EF4444',
    advice: 'Extra protection needed. Stay in shade, wear protective clothing.',
    icon: '🔴'
  };
  return {
    level: 'Extreme',
    color: '#7F1D1D',
    advice: 'Avoid being outside during midday hours. Extreme protection required.',
    icon: '🟣'
  };
};

// Format numbers beautifully
export const formatNumber = (number, decimals = 0) => {
  if (number === null || number === undefined) return '—';
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(number);
};

// Time formatting
export const formatTime = (date) => {
  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(new Date(date));
};

// Date formatting
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date));
};

// Generate realistic AQI variations for historical data
export const generateAQIHistory = (baseAQI, days = 7) => {
  const history = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Generate realistic daily variations
    const timeVariation = Math.sin((i / days) * Math.PI * 2) * 15; // Seasonal variation
    const randomVariation = (Math.random() - 0.5) * 20; // Random daily variation
    const weekendEffect = date.getDay() === 0 || date.getDay() === 6 ? -10 : 5; // Lower on weekends
    
    const aqiValue = Math.max(10, Math.min(300, 
      baseAQI + timeVariation + randomVariation + weekendEffect
    ));
    
    const aqiInfo = getAQIInfo(aqiValue);
    
    history.push({
      date: date.toISOString().split('T')[0],
      aqi: Math.round(aqiValue),
      level: aqiInfo.level,
      color: aqiInfo.color,
      hour: i === 0 ? new Date().getHours() : Math.floor(Math.random() * 24),
      trend: i > 0 ? (aqiValue > history[history.length - 1]?.aqi ? 'rising' : 'falling') : 'stable'
    });
  }
  
  return history;
};

// Indian cities with accurate coordinates and typical AQI patterns
export const INDIAN_CITIES_DATA = {
  'Delhi': { 
    coords: [28.6139, 77.2090], 
    baseAQI: 180, 
    population: '32M',
    seasonalVariation: 40,
    industrialFactor: 1.3
  },
  'Mumbai': { 
    coords: [19.0760, 72.8777], 
    baseAQI: 85, 
    population: '20M',
    seasonalVariation: 20,
    industrialFactor: 1.1
  },
  'Bangalore': { 
    coords: [12.9716, 77.5946], 
    baseAQI: 70, 
    population: '13M',
    seasonalVariation: 15,
    industrialFactor: 0.9
  },
  'Chennai': { 
    coords: [13.0827, 80.2707], 
    baseAQI: 90, 
    population: '11M',
    seasonalVariation: 25,
    industrialFactor: 1.0
  },
  'Kolkata': { 
    coords: [22.5726, 88.3639], 
    baseAQI: 140, 
    population: '15M',
    seasonalVariation: 35,
    industrialFactor: 1.2
  },
  'Hyderabad': { 
    coords: [17.3850, 78.4867], 
    baseAQI: 75, 
    population: '10M',
    seasonalVariation: 20,
    industrialFactor: 0.95
  },
  'Pune': { 
    coords: [18.5204, 73.8567], 
    baseAQI: 72, 
    population: '7M',
    seasonalVariation: 18,
    industrialFactor: 0.9
  },
  'Ahmedabad': { 
    coords: [23.0225, 72.5714], 
    baseAQI: 105, 
    population: '8M',
    seasonalVariation: 30,
    industrialFactor: 1.15
  }
};

export default {
  calculateAQI,
  getAQIInfo,
  getWeatherInfo,
  getUVInfo,
  formatNumber,
  formatTime,
  formatDate,
  generateAQIHistory,
  INDIAN_CITIES_DATA,
  AQI_THRESHOLDS
};