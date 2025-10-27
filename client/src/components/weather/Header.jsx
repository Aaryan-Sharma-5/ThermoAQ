import { ChevronDown, MapPin, Search, User, Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, CloudSun, Cloudy, Flame, Moon, Snowflake, Sun } from 'lucide-react';
import { useState } from 'react';

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

export function Header({ onLocationChange, selectedLocation, weatherData }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const popularCities = [
    'Mumbai, Maharashtra',
    'Delhi, Delhi',
    'Bangalore, Karnataka', 
    'Chennai, Tamil Nadu',
    'Kolkata, West Bengal',
    'Hyderabad, Telangana',
    'Pune, Maharashtra',
    'Ahmedabad, Gujarat'
  ];

  const filteredCities = popularCities.filter(city =>
    city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCitySelect = (city) => {
    onLocationChange && onLocationChange(city);
    setSearchQuery('');
    setShowSearch(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onLocationChange && onLocationChange(searchQuery.trim());
      setSearchQuery('');
      setShowSearch(false);
    }
  };

  return (
    <header className="bg-black border-b border-gray-800">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-bold">ThermoAQ</h1>
          <nav className="hidden md:flex items-center gap-6">
            <a href="/" className="text-white hover:text-gray-300 transition-colors">Home</a>
            <a href="/dashboard" className="text-white hover:text-gray-300 transition-colors">Dashboard</a>
          </nav>
        </div>
        
        {/* Current Weather Display */}
        {weatherData && (
          <div className="hidden lg:flex items-center gap-3 text-sm">
            {(() => {
              const IconComponent = getIconComponent(weatherData.icon);
              return <IconComponent className="w-6 h-6 text-blue-400" />;
            })()}
            <div>
              <div className="text-white font-semibold">{weatherData.temperature}°C</div>
              <div className="text-gray-400 text-xs">{weatherData.condition}</div>
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-4">
          {/* Location Selector */}
          <div className="relative">
            <button 
              onClick={() => setShowSearch(!showSearch)}
              className="flex items-center gap-2 bg-[#1e2430] px-4 py-2 rounded-lg hover:bg-[#252d3d] transition-colors"
            >
              <MapPin className="w-4 h-4" />
              <span>{selectedLocation || 'Mumbai, Maharashtra'}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {/* Location Search Dropdown */}
            {showSearch && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-[#252d3d] rounded-lg shadow-xl border border-gray-700 z-50">
                <form onSubmit={handleSearchSubmit} className="p-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for a city..."
                      className="w-full pl-10 pr-4 py-2 bg-[#1e2430] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                  </div>
                </form>
                
                <div className="max-h-60 overflow-y-auto">
                  {filteredCities.length > 0 ? (
                    filteredCities.map((city, index) => (
                      <button
                        key={index}
                        onClick={() => handleCitySelect(city)}
                        className="w-full px-4 py-3 text-left hover:bg-[#1e2430] transition-colors text-gray-300 hover:text-white border-t border-gray-700 first:border-t-0"
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3 text-blue-400" />
                          {city}
                        </div>
                      </button>
                    ))
                  ) : searchQuery ? (
                    <div className="px-4 py-3 text-gray-400 border-t border-gray-700">
                      Press Enter to search for "{searchQuery}"
                    </div>
                  ) : (
                    <div className="px-4 py-3 text-gray-400 border-t border-gray-700">
                      Type to search for cities
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <button className="flex items-center gap-2 bg-[#1e2430] px-4 py-2 rounded-lg hover:bg-[#252d3d] transition-colors">
            <span>Login</span>
          </button>
          <button className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
            <User className="w-4 h-4" />
            <span>SignUp</span>
          </button>
        </div>
      </div>
      
      {/* Click outside to close search */}
      {showSearch && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowSearch(false)}
        />
      )}
    </header>
  );
}