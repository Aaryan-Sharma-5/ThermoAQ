import { LineChart, MapPin, TrendingDown, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { authAPI } from '../../utils/api';

export function PollutionHistory() {
  const [history, setHistory] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const response = await authAPI.getAQIHistory();
      setHistory(response.history || []);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAQIColor = (aqi) => {
    if (aqi <= 50) return 'text-green-400';
    if (aqi <= 100) return 'text-yellow-400';
    if (aqi <= 150) return 'text-orange-400';
    if (aqi <= 200) return 'text-red-400';
    return 'text-purple-400';
  };

  const getAQIBgColor = (aqi) => {
    if (aqi <= 50) return 'bg-green-500/10 border-green-500/20';
    if (aqi <= 100) return 'bg-yellow-500/10 border-yellow-500/20';
    if (aqi <= 150) return 'bg-orange-500/10 border-orange-500/20';
    if (aqi <= 200) return 'bg-red-500/10 border-red-500/20';
    return 'bg-purple-500/10 border-purple-500/20';
  };

  const getAQILevel = (aqi) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    return 'Very Unhealthy';
  };

  const uniqueLocations = [...new Set(history.map(h => h.location))];
  const filteredHistory = selectedLocation === 'all' 
    ? history 
    : history.filter(h => h.location === selectedLocation);

  const getStats = () => {
    if (filteredHistory.length === 0) return { avg: 0, max: 0, min: 0, trend: 0 };
    
    const aqiValues = filteredHistory.map(h => h.aqi);
    const avg = Math.round(aqiValues.reduce((a, b) => a + b, 0) / aqiValues.length);
    const max = Math.max(...aqiValues);
    const min = Math.min(...aqiValues);
    
    // Calculate trend (comparing first half vs second half)
    const midpoint = Math.floor(filteredHistory.length / 2);
    const firstHalfAvg = filteredHistory.slice(0, midpoint)
      .reduce((sum, h) => sum + h.aqi, 0) / midpoint;
    const secondHalfAvg = filteredHistory.slice(midpoint)
      .reduce((sum, h) => sum + h.aqi, 0) / (filteredHistory.length - midpoint);
    const trend = secondHalfAvg - firstHalfAvg;
    
    return { avg, max, min, trend };
  };

  const stats = getStats();

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Pollution History</h2>
          <p className="text-sm text-slate-400 mt-1">
            Track AQI trends for locations you've visited
          </p>
        </div>
        <LineChart className="w-8 h-8 text-blue-400" />
      </div>

      {/* Location Filter */}
      {uniqueLocations.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Filter by Location
          </label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Locations ({history.length} readings)</option>
            {uniqueLocations.map(location => (
              <option key={location} value={location}>
                {location} ({history.filter(h => h.location === location).length} readings)
              </option>
            ))}
          </select>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="text-center py-12 bg-slate-700/30 rounded-lg">
          <LineChart className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <p className="text-slate-400">No pollution history yet</p>
          <p className="text-sm text-slate-500 mt-1">
            History will be automatically recorded as you check different locations
          </p>
        </div>
      ) : (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-700/50 rounded-lg p-4 border border-white/10">
              <p className="text-xs text-slate-400 mb-1">Average AQI</p>
              <p className={`text-2xl font-bold ${getAQIColor(stats.avg)}`}>
                {stats.avg}
              </p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4 border border-white/10">
              <p className="text-xs text-slate-400 mb-1">Max AQI</p>
              <p className={`text-2xl font-bold ${getAQIColor(stats.max)}`}>
                {stats.max}
              </p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4 border border-white/10">
              <p className="text-xs text-slate-400 mb-1">Min AQI</p>
              <p className={`text-2xl font-bold ${getAQIColor(stats.min)}`}>
                {stats.min}
              </p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4 border border-white/10">
              <p className="text-xs text-slate-400 mb-1">Trend</p>
              <div className="flex items-center gap-2">
                {stats.trend > 0 ? (
                  <>
                    <TrendingUp className="w-5 h-5 text-red-400" />
                    <span className="text-xl font-bold text-red-400">+{Math.round(stats.trend)}</span>
                  </>
                ) : stats.trend < 0 ? (
                  <>
                    <TrendingDown className="w-5 h-5 text-green-400" />
                    <span className="text-xl font-bold text-green-400">{Math.round(stats.trend)}</span>
                  </>
                ) : (
                  <span className="text-xl font-bold text-slate-400">0</span>
                )}
              </div>
            </div>
          </div>

          {/* History Timeline */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredHistory.map((record, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${getAQIBgColor(record.aqi)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <MapPin className={`w-5 h-5 mt-0.5 ${getAQIColor(record.aqi)}`} />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white">{record.location}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          record.aqi <= 50 ? 'bg-green-500/20 text-green-400' :
                          record.aqi <= 100 ? 'bg-yellow-500/20 text-yellow-400' :
                          record.aqi <= 150 ? 'bg-orange-500/20 text-orange-400' :
                          record.aqi <= 200 ? 'bg-red-500/20 text-red-400' :
                          'bg-purple-500/20 text-purple-400'
                        }`}>
                          {getAQILevel(record.aqi)}
                        </span>
                      </div>
                      <p className={`text-3xl font-bold mb-1 ${getAQIColor(record.aqi)}`}>
                        {record.aqi}
                      </p>
                      <p className="text-xs text-slate-400">
                        {new Date(record.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Visual Timeline Graph (Simple) */}
          <div className="mt-6 p-4 bg-slate-700/30 rounded-lg">
            <h3 className="text-sm font-semibold text-white mb-3">AQI Timeline</h3>
            <div className="flex items-end justify-between gap-1 h-32">
              {filteredHistory.slice(-20).map((record, index) => {
                const maxAQI = Math.max(...filteredHistory.slice(-20).map(h => h.aqi));
                const height = (record.aqi / maxAQI) * 100;
                return (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center"
                    title={`${record.location}: ${record.aqi}`}
                  >
                    <div
                      className={`w-full rounded-t transition-all ${
                        record.aqi <= 50 ? 'bg-green-500' :
                        record.aqi <= 100 ? 'bg-yellow-500' :
                        record.aqi <= 150 ? 'bg-orange-500' :
                        record.aqi <= 200 ? 'bg-red-500' :
                        'bg-purple-500'
                      }`}
                      style={{ height: `${height}%` }}
                    ></div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>Oldest</span>
              <span>Most Recent ({filteredHistory.length > 20 ? 'Last 20 shown' : 'All shown'})</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
