import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

export function HourlyForecast() {
  const [activeView, setActiveView] = useState('hourly');

  const hourlyData = [
    {
      time: '00:00',
      temp: 32,
    },
    {
      time: '03:00',
      temp: 30,
    },
    {
      time: '06:00',
      temp: 28,
    },
    {
      time: '09:00',
      temp: 35,
    },
    {
      time: '12:00',
      temp: 42,
    },
    {
      time: '15:00',
      temp: 48,
    },
    {
      time: '18:00',
      temp: 45,
    },
    {
      time: '21:00',
      temp: 38,
    },
  ];

  const dailyData = [
    {
      time: 'Mon',
      temp: 42,
    },
    {
      time: 'Tue',
      temp: 38,
    },
    {
      time: 'Wed',
      temp: 45,
    },
    {
      time: 'Thu',
      temp: 48,
    },
    {
      time: 'Fri',
      temp: 44,
    },
    {
      time: 'Sat',
      temp: 40,
    },
    {
      time: 'Sun',
      temp: 43,
    },
  ];

  const weeklyData = [
    {
      time: 'Week 1',
      temp: 42,
    },
    {
      time: 'Week 2',
      temp: 45,
    },
    {
      time: 'Week 3',
      temp: 48,
    },
    {
      time: 'Week 4',
      temp: 44,
    },
  ];

  const data =
    activeView === 'hourly'
      ? hourlyData
      : activeView === 'daily'
        ? dailyData
        : weeklyData;

  return (
    <div className="bg-[#1e2430] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Temperature Forecast</h3>
        <div className="flex gap-2 text-sm">
          <button
            onClick={() => setActiveView('hourly')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeView === 'hourly' ? 'bg-blue-600' : 'bg-[#252d3d] hover:bg-[#2d3548]'
            }`}
          >
            Hourly
          </button>
          <button
            onClick={() => setActiveView('daily')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeView === 'daily' ? 'bg-blue-600' : 'bg-[#252d3d] hover:bg-[#2d3548]'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setActiveView('weekly')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeView === 'weekly' ? 'bg-blue-600' : 'bg-[#252d3d] hover:bg-[#2d3548]'
            }`}
          >
            Weekly
          </button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
          <XAxis dataKey="time" stroke="#718096" fontSize={12} />
          <YAxis stroke="#718096" fontSize={12} />
          <Line
            type="monotone"
            dataKey="temp"
            stroke="#22c55e"
            strokeWidth={3}
            dot={{
              fill: '#22c55e',
              r: 5,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}