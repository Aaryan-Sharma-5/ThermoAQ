import { Cloud, CloudRain, Sun } from 'lucide-react';

export function OtherCities() {
  const cities = [
    {
      name: 'Beijing',
      condition: 'Cloudy',
      temp: 8,
      icon: Cloud,
    },
    {
      name: 'California',
      condition: 'Sunny',
      temp: 28,
      icon: Sun,
    },
    {
      name: 'Dubai',
      condition: 'Partly Sunny',
      temp: 35,
      icon: CloudRain,
    },
  ];

  return (
    <div className="bg-[#1e2430] rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-4">Other Cities</h3>
      <div className="space-y-3">
        {cities.map((city, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-4 bg-[#252d3d] rounded-xl hover:bg-[#2d3548] transition-colors"
          >
            <div className="flex items-center gap-3">
              <city.icon className="w-6 h-6 text-gray-400" />
              <div>
                <p className="font-medium">{city.name}</p>
                <p className="text-sm text-gray-400">{city.condition}</p>
              </div>
            </div>
            <p className="text-2xl font-bold">{city.temp}°</p>
          </div>
        ))}
      </div>
    </div>
  );
}