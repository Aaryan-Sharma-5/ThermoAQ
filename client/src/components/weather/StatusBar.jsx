import { RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';

export function StatusBar({ lastUpdated, onRefresh, autoRefresh, onToggleAutoRefresh, isRefreshing }) {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    if (!lastUpdated) return;

    const updateTimeAgo = () => {
      const now = new Date();
      const diff = Math.floor((now - lastUpdated) / 1000); // difference in seconds

      if (diff < 60) {
        setTimeAgo('Just now');
      } else if (diff < 3600) {
        const minutes = Math.floor(diff / 60);
        setTimeAgo(`${minutes} minute${minutes > 1 ? 's' : ''} ago`);
      } else {
        const hours = Math.floor(diff / 3600);
        setTimeAgo(`${hours} hour${hours > 1 ? 's' : ''} ago`);
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [lastUpdated]);

  return (
    <div className="bg-[#1a1f2e] border-b border-gray-800 sticky top-0 z-40">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-2 flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <span className="text-gray-400">
              Last updated: <span className="text-gray-300">{timeAgo}</span>
            </span>
          )}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-colors ${
              isRefreshing
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-gray-400">Auto-refresh</span>
            <div className="relative">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => onToggleAutoRefresh(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </div>
            <span className="text-xs text-gray-500">(every 10 min)</span>
          </label>
        </div>
      </div>
    </div>
  );
}
