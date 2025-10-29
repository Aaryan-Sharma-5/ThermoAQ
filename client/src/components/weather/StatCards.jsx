import { Droplets, Eye, Sun, Wind } from 'lucide-react';

export function StatCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-[#1e2430] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm text-gray-400">Wind Status</h3>
          <Wind className="w-5 h-5 text-blue-400" />
        </div>
        <p className="text-4xl font-bold mb-1">12.5</p>
        <p className="text-sm text-gray-400">km/h</p>
        <div className="flex gap-2 mt-4">
          {[40, 60, 50].map((height, i) => (
            <div
              key={i}
              className="flex-1 bg-gray-700 rounded"
              style={{
                height: `${height}px`,
              }}
            >
              <div
                className="bg-blue-500 rounded w-full"
                style={{
                  height: '100%',
                }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>6AM</span>
          <span>12PM</span>
          <span>6PM</span>
        </div>
      </div>
      <div className="bg-[#1e2430] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm text-gray-400">UV Index</h3>
          <Sun className="w-5 h-5 text-yellow-400" />
        </div>
        <p className="text-4xl font-bold mb-1">5.50</p>
        <p className="text-sm text-gray-400">UV</p>
      </div>
      <div className="bg-[#1e2430] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm text-gray-400">Humidity</h3>
          <Droplets className="w-5 h-5 text-blue-400" />
        </div>
        <p className="text-4xl font-bold mb-1">68</p>
        <p className="text-sm text-gray-400">%</p>
        <p className="text-xs text-gray-500 mt-2">Normal humidity level</p>
      </div>
      <div className="bg-[#1e2430] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm text-gray-400">Visibility</h3>
          <Eye className="w-5 h-5 text-gray-400" />
        </div>
        <p className="text-4xl font-bold mb-1">8.2</p>
        <p className="text-sm text-gray-400">km</p>
        <p className="text-xs text-gray-500 mt-2">Good visibility conditions</p>
      </div>
    </div>
  );
}