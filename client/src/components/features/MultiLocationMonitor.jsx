import { AlertTriangle, Bell, BellOff, MapPin, Plus, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { authAPI } from '../../utils/api';
import aqiService from '../../services/aqiService';

export function MultiLocationMonitor() {
  const [monitoredLocations, setMonitoredLocations] = useState([]);
  const [locationData, setLocationData] = useState({});
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newLocation, setNewLocation] = useState('');
  const [loading, setLoading] = useState(true);

  const indianCities = [
    'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 
    'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat',
    'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane',
    'Bhopal', 'Visakhapatnam', 'Patna', 'Vadodara', 'Ludhiana'
  ];

  const loadMonitoredLocations = async () => {
    try {
      const response = await authAPI.getUserProfile();
      const locations = response.user.monitoredLocations || [];
      setMonitoredLocations(locations);
      
      // Fetch AQI data for all monitored locations
      for (const location of locations) {
        fetchLocationData(location.name);
      }
    } catch (error) {
      console.error('Error loading monitored locations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMonitoredLocations();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchLocationData = async (locationName) => {
    try {
      const cityName = locationName.split(',')[0].trim();
      const aqi = await aqiService.getAirQuality(cityName);
      setLocationData(prev => ({
        ...prev,
        [locationName]: aqi
      }));
    } catch (error) {
      console.error(`Error fetching data for ${locationName}:`, error);
    }
  };

  const addLocation = async () => {
    if (!newLocation.trim()) return;
    
    try {
      await authAPI.addMonitoredLocation({
        name: newLocation,
        alertEnabled: true
      });
      
      await loadMonitoredLocations();
      setNewLocation('');
      setShowAddDialog(false);
    } catch (error) {
      console.error('Error adding location:', error);
    }
  };

  const removeLocation = async (locationName) => {
    try {
      await authAPI.removeMonitoredLocation(locationName);
      setMonitoredLocations(prev => prev.filter(loc => loc.name !== locationName));
      setLocationData(prev => {
        const newData = { ...prev };
        delete newData[locationName];
        return newData;
      });
    } catch (error) {
      console.error('Error removing location:', error);
    }
  };

  const getAQIColor = (aqi) => {
    if (aqi <= 50) return 'text-green-400 bg-green-400/10';
    if (aqi <= 100) return 'text-yellow-400 bg-yellow-400/10';
    if (aqi <= 150) return 'text-orange-400 bg-orange-400/10';
    if (aqi <= 200) return 'text-red-400 bg-red-400/10';
    if (aqi <= 300) return 'text-purple-400 bg-purple-400/10';
    return 'text-red-600 bg-red-600/10';
  };

  const getAQILevel = (aqi) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Multi-Location Monitoring</h2>
          <p className="text-sm text-slate-400 mt-1">
            Track air quality in multiple cities simultaneously
          </p>
        </div>
        <button
          onClick={() => setShowAddDialog(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus size={18} />
          Add Location
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
        </div>
      ) : monitoredLocations.length === 0 ? (
        <div className="text-center py-12 bg-slate-700/30 rounded-lg">
          <MapPin className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <p className="text-slate-400">No locations being monitored</p>
          <p className="text-sm text-slate-500 mt-1">Add locations to start tracking</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {monitoredLocations.map((location) => {
            const data = locationData[location.name];
            const aqi = data?.aqi || 0;
            
            return (
              <div
                key={location.name}
                className="bg-slate-700/50 rounded-lg p-4 border border-slate-600 hover:border-slate-500 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <h3 className="font-semibold text-white">{location.name}</h3>
                  </div>
                  <button
                    onClick={() => removeLocation(location.name)}
                    className="text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {data ? (
                  <>
                    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${getAQIColor(aqi)} mb-3`}>
                      <span className="text-2xl font-bold">{aqi}</span>
                      <span className="text-sm">AQI</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">{getAQILevel(aqi)}</span>
                      {location.alertEnabled ? (
                        <Bell className="w-4 h-4 text-blue-400" />
                      ) : (
                        <BellOff className="w-4 h-4 text-slate-500" />
                      )}
                    </div>

                    {aqi > 150 && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-orange-400">
                        <AlertTriangle size={14} />
                        <span>Alert: High pollution level</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="animate-pulse">
                    <div className="h-10 bg-slate-600/50 rounded mb-2"></div>
                    <div className="h-4 bg-slate-600/50 rounded"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Location Dialog */}
      {showAddDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Add Location to Monitor</h3>
              <button
                onClick={() => setShowAddDialog(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <select
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-blue-400"
              >
                <option value="">Select a city</option>
                {indianCities
                  .filter(city => !monitoredLocations.some(loc => loc.name.startsWith(city)))
                  .map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))
                }
              </select>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddDialog(false)}
                  className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addLocation}
                  disabled={!newLocation}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Location
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
