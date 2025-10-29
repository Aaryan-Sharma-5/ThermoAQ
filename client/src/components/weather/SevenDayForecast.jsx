import { Cloud, CloudRain, CloudSnow, Sun } from 'lucide-react';

export function SevenDayForecast() {
  const forecast = [
    {
      day: 'Today',
      icon: Sun,
      high: 72,
      low: 58,
    },
    {
      day: 'Tue',
      icon: CloudRain,
      high: 69,
      low: 55,
    },
    {
      day: 'Wed',
      icon: Cloud,
      high: 63,
      low: 48,
    },
    {
      day: 'Thu',
      icon: Cloud,
      high: 66,
      low: 52,
    },
    {
      day: 'Fri',
      icon: Sun,
      high: 74,
      low: 59,
    },
    {
      day: 'Sat',
      icon: CloudSnow,
      high: 71,
      low: 57,
    },
  ];

  return (
    <div className="bg-[#1e2430] rounded-2xl p-6">
      <h3 className="text-xl font-semibold mb-4">7-Day Forecast</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {forecast.map((day, i) => (
          <div key={i} className="bg-[#252d3d] rounded-xl p-4 text-center">
            <p className="text-sm text-gray-400 mb-2">{day.day}</p>
            <day.icon className="w-10 h-10 mx-auto mb-3 text-blue-400" />
            <div className="flex justify-center gap-2 text-sm">
              <span className="font-semibold">{day.high}°</span>
              <span className="text-gray-500">{day.low}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}