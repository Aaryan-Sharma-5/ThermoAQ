import { Cloud, CloudRain, CloudSnow, Sun } from 'lucide-react';

export function WeeklyForecast() {
  const days = [
    {
      day: 'Sat',
      date: '21',
      icon: Cloud,
      temp: '16°',
      bg: 'bg-blue-600',
    },
    {
      day: 'Sun',
      date: '22',
      icon: Sun,
      temp: '22°',
      bg: 'bg-gray-700',
    },
    {
      day: 'Mon',
      date: '23',
      icon: CloudRain,
      temp: '14°',
      bg: 'bg-gray-700',
    },
    {
      day: 'Tue',
      date: '24',
      icon: Cloud,
      temp: '18°',
      bg: 'bg-gray-700',
    },
    {
      day: 'Wed',
      date: '25',
      icon: CloudSnow,
      temp: '25°',
      bg: 'bg-gray-700',
    },
    {
      day: 'Thu',
      date: '26',
      icon: Cloud,
      temp: '12°',
      bg: 'bg-gray-700',
    },
    {
      day: 'Fri',
      date: '27',
      icon: CloudSnow,
      temp: '8°',
      bg: 'bg-gray-700',
    },
  ];

  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((day, i) => (
        <div
          key={i}
          className={`${day.bg} rounded-xl p-4 text-center hover:scale-105 transition-transform cursor-pointer`}
        >
          <p className="text-sm mb-1">{day.day}</p>
          <day.icon className="w-8 h-8 mx-auto mb-2" />
          <p className="text-lg font-bold">{day.temp}</p>
        </div>
      ))}
    </div>
  );
}