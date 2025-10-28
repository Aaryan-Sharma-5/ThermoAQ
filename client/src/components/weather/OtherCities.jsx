import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Cloudy,
  Flame,
  Moon,
  Snowflake,
  Sun,
  Search,
  Plus,
  X
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import weatherService from '../../services/weatherService';

// Popular cities for autocomplete suggestions
const POPULAR_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Kolkata', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad',
  'London', 'New York', 'Tokyo', 'Paris', 'Dubai', 'Singapore', 'Sydney', 'Los Angeles',
  'Berlin', 'Rome', 'Madrid', 'Amsterdam', 'Toronto', 'Beijing', 'Shanghai', 'Hong Kong',
  'Bangkok', 'Seoul', 'Moscow', 'Istanbul', 'Cairo', 'Johannesburg', 'São Paulo', 'Mexico City',
  'Buenos Aires', 'Lima', 'Santiago', 'Bogotá', 'Caracas', 'Vancouver', 'Montreal', 'Boston',
  'Chicago', 'San Francisco', 'Seattle', 'Miami', 'Las Vegas', 'Denver', 'Atlanta', 'Houston',
  'Dallas', 'Phoenix', 'Philadelphia', 'Manchester', 'Liverpool', 'Edinburgh', 'Dublin', 'Oslo',
  'Stockholm', 'Copenhagen', 'Helsinki', 'Vienna', 'Prague', 'Budapest', 'Warsaw', 'Athens',
  'Lisbon', 'Barcelona', 'Milan', 'Munich', 'Zurich', 'Geneva', 'Brussels', 'Karachi',
  'Lahore', 'Islamabad', 'Dhaka', 'Kathmandu', 'Colombo', 'Jaipur', 'Lucknow', 'Kochi'
];

// Helper function to get icon component from icon name
const getIconComponent = (iconName) => {
  const icons = {
    Sun,
    Moon,
    CloudSun,
    Cloud,
    Cloudy,
    CloudFog,
    CloudRain,
    CloudSnow,
    CloudDrizzle,
    CloudLightning,
    Snowflake,
    Flame
  };
  return icons[iconName] || Cloud;
};

export function OtherCities({ multipleCitiesData, loading, onCitiesUpdate }) {
  const [searchCity, setSearchCity] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  // Filter suggestions based on search input
  useEffect(() => {
    if (searchCity.trim().length > 0) {
      const filtered = POPULAR_CITIES
        .filter(city => 
          city.toLowerCase().includes(searchCity.toLowerCase())
        )
        .slice(0, 8); // Show top 8 suggestions
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchCity]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddCity = async (cityName) => {
    const city = cityName || searchCity;
    if (!city.trim()) return;

    // Check if city already exists
    if (multipleCitiesData.some(c => c.city.toLowerCase() === city.toLowerCase())) {
      setSearchError('City already added');
      setTimeout(() => setSearchError(''), 3000);
      return;
    }

    setIsAdding(true);
    setSearchError('');
    setShowSuggestions(false);

    try {
      // Fetch the new city's weather
      const cityWeather = await weatherService.getCurrentWeather(city);
      
      // Add to existing cities
      const newCity = {
        city: city,
        data: cityWeather,
        error: null
      };

      // Call parent to update cities list
      if (onCitiesUpdate) {
        onCitiesUpdate([...multipleCitiesData, newCity]);
      }

      setSearchCity('');
    } catch (err) {
      setSearchError('City not found. Please try another name.');
      console.error('Failed to add city:', err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleSuggestionClick = (city) => {
    setSearchCity(city);
    setShowSuggestions(false);
    handleAddCity(city);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddCity();
  };

  const handleRemoveCity = (cityName) => {
    if (onCitiesUpdate) {
      const updatedCities = multipleCitiesData.filter(c => c.city !== cityName);
      onCitiesUpdate(updatedCities);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#1e2430] rounded-2xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-600 rounded mb-4 w-32"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-[#252d3d] rounded-xl p-4">
                <div className="h-4 bg-gray-600 rounded mb-2 w-20"></div>
                <div className="h-8 bg-gray-600 rounded mb-2 w-12"></div>
                <div className="h-3 bg-gray-600 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const cities = multipleCitiesData?.filter(city => city.data) || [];

  return (
    <div className="bg-[#1e2430] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        <h3 className="text-xl font-semibold">Other Cities</h3>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative" ref={searchRef}>
            <input
              type="text"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              onFocus={() => searchCity && setShowSuggestions(true)}
              placeholder="Search cities..."
              className="bg-[#252d3d] text-white px-4 py-2 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-56"
              autoComplete="off"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            
            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#252d3d] border border-gray-600 rounded-lg shadow-xl max-h-60 overflow-y-auto z-50">
                {suggestions.map((city, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(city)}
                    className="w-full px-4 py-2 text-left hover:bg-[#2d3548] transition-colors first:rounded-t-lg last:rounded-b-lg flex items-center justify-between"
                  >
                    <span>{city}</span>
                    <Plus className="w-3 h-3 text-gray-400" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={isAdding || !searchCity.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-4 py-2 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            {isAdding ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Adding...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add
              </>
            )}
          </button>
        </form>
      </div>

      {searchError && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm flex items-center justify-between">
          <span>{searchError}</span>
          <button onClick={() => setSearchError('')} className="text-red-400 hover:text-red-300">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cities.map((cityData, i) => {
          const city = cityData.data;
          const IconComponent = getIconComponent(city.icon);
          return (
            <div key={i} className="bg-[#252d3d] rounded-xl p-4 hover:bg-[#2d3548] transition-colors cursor-pointer group relative">
              <button
                onClick={() => handleRemoveCity(cityData.city)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 rounded-full p-1"
                title="Remove city"
              >
                <X className="w-3 h-3" />
              </button>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium truncate pr-6">{cityData.city}</h4>
                <IconComponent className="w-6 h-6 text-blue-400 flex-shrink-0" />
              </div>
              <div className="text-2xl font-bold mb-1">{city.temperature}°C</div>
              <div className="text-sm text-gray-400 truncate">{city.condition}</div>
              <div className="text-xs text-gray-500 mt-2">
                Humidity: {city.humidity}%
              </div>
            </div>
          );
        })}
        
        {/* Show message if no data */}
        {cities.length === 0 && !loading && (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-400 mb-2">No cities added yet</p>
            <p className="text-sm text-gray-500">Search and add cities to track their weather</p>
          </div>
        )}
      </div>
    </div>
  );
}