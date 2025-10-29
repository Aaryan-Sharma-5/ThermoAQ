import { Droplets, Eye, Sun, Wind } from 'lucide-react';

export function TomorrowWeather() {
  return (
    <div
      className="bg-[#1e2430] rounded-2xl p-8 relative overflow-hidden h-full"
      style={{
        backgroundImage:
          'url(https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="relative z-10 h-full flex flex-col">
        <div className="mb-auto">
          <p className="text-lg mb-1">Tomorrow</p>
          <p className="text-sm text-gray-300">22nd Dec, 2024</p>
        </div>
        <div className="flex items-center justify-center my-8">
          <Sun className="w-32 h-32 text-yellow-400" />
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-6xl font-bold mb-2">72°</p>
            <p className="text-xl">Sunny</p>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4" />
              <span>Wind</span>
              <span className="font-semibold">12 mph</span>
            </div>
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4" />
              <span>Humidity</span>
              <span className="font-semibold">68%</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>Visibility</span>
              <span className="font-semibold">10 mi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}