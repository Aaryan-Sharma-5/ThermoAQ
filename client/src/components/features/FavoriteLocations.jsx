import { Heart, MapPin, Navigation, Plus, Star, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'thermoaq_favorite_locations';

export function FavoriteLocations({ onLocationSelect, currentLocation }) {
  const [favorites, setFavorites] = useState([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newLocation, setNewLocation] = useState('');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Load favorites from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (e) {
        console.error('Error loading favorites:', e);
      }
    }
  }, []);

  // Save favorites to localStorage
  const saveFavorites = (newFavorites) => {
    setFavorites(newFavorites);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
  };

  // Add new favorite
  const addFavorite = () => {
    if (!newLocation.trim()) return;
    
    const favorite = {
      id: Date.now(),
      name: newLocation.trim(),
      addedAt: new Date().toISOString(),
      isCurrent: false
    };

    saveFavorites([...favorites, favorite]);
    setNewLocation('');
    setShowAddDialog(false);
  };

  // Remove favorite
  const removeFavorite = (id) => {
    saveFavorites(favorites.filter(f => f.id !== id));
  };

  // Toggle current location
  const toggleCurrent = (id) => {
    saveFavorites(favorites.map(f => ({
      ...f,
      isCurrent: f.id === id ? !f.isCurrent : false
    })));
  };

  // Detect geolocation
  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsDetectingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Reverse geocoding to get city name
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
          );
          const data = await response.json();
          
          const cityName = data.address.city || data.address.town || data.address.village || 'Current Location';
          
          const favorite = {
            id: Date.now(),
            name: `${cityName} (Auto-detected)`,
            addedAt: new Date().toISOString(),
            isCurrent: true,
            lat: position.coords.latitude,
            lon: position.coords.longitude
          };

          saveFavorites([...favorites, favorite]);
          
          if (onLocationSelect) {
            onLocationSelect(cityName);
          }
        } catch (error) {
          console.error('Error reverse geocoding:', error);
          alert('Failed to detect location');
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Failed to get your location. Please enable location services.');
        setIsDetectingLocation(false);
      }
    );
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-pink-500 to-rose-500 p-3 rounded-xl">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Favorite Locations</h3>
            <p className="text-sm text-gray-400">Quick access to your saved places</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddDialog(true)}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-semibold">Add</span>
        </button>
      </div>

      {/* Auto-detect Location Button */}
      <button
        onClick={detectLocation}
        disabled={isDetectingLocation}
        className="w-full mb-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        <Navigation className={`w-5 h-5 ${isDetectingLocation ? 'animate-spin' : ''}`} />
        <span className="font-semibold">
          {isDetectingLocation ? 'Detecting Location...' : 'Auto-Detect My Location'}
        </span>
      </button>

      {/* Favorites List */}
      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-2">No favorite locations yet</p>
          <p className="text-sm text-gray-500">Add locations to quickly access weather data</p>
        </div>
      ) : (
        <div className="space-y-3">
          {favorites.map((favorite) => (
            <div
              key={favorite.id}
              className={`bg-slate-700/50 hover:bg-slate-700/70 rounded-lg p-4 transition-all duration-200 cursor-pointer border-2 ${
                favorite.isCurrent || favorite.name === currentLocation
                  ? 'border-blue-500'
                  : 'border-transparent'
              }`}
              onClick={() => onLocationSelect && onLocationSelect(favorite.name)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <div className="flex-1">
                    <p className="text-white font-semibold">{favorite.name}</p>
                    <p className="text-xs text-gray-400">
                      Added {new Date(favorite.addedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCurrent(favorite.id);
                    }}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      favorite.isCurrent
                        ? 'bg-yellow-500 text-white'
                        : 'bg-slate-600 text-gray-400 hover:bg-slate-500'
                    }`}
                    title={favorite.isCurrent ? 'Current location' : 'Set as current'}
                  >
                    <Star className={`w-4 h-4 ${favorite.isCurrent ? 'fill-white' : ''}`} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFavorite(favorite.id);
                    }}
                    className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all duration-200"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {(favorite.isCurrent || favorite.name === currentLocation) && (
                <div className="mt-2 px-3 py-1 bg-blue-500/20 border border-blue-500/40 rounded text-xs text-blue-300 inline-block">
                  Current Location
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Dialog */}
      {showAddDialog && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-slate-600 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Add Favorite Location</h3>
              <button
                onClick={() => setShowAddDialog(false)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-2">Location Name</label>
              <input
                type="text"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addFavorite()}
                placeholder="e.g., Mumbai, Maharashtra"
                className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAddDialog(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addFavorite}
                disabled={!newLocation.trim()}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-200"
              >
                Add Location
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
