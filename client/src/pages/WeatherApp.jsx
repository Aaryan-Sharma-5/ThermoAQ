import { GlobalWeatherMap } from '../components/weather/GlobalWeatherMap'
import { Header } from '../components/weather/Header'
import { HourlyForecast } from '../components/weather/HourlyForecast'
import { OtherCities } from '../components/weather/OtherCities'
import { RainCharts } from '../components/weather/RainCharts'
import { SevenDayForecast } from '../components/weather/SevenDayForecast'
import { StatCards } from '../components/weather/StatCards'
import { TodayWeather } from '../components/weather/TodayWeather'
import { TomorrowWeather } from '../components/weather/TomorrowWeather'
import { WeatherInsights } from '../components/weather/WeatherInsights'
import { WeeklyForecast } from '../components/weather/WeeklyForecast'

export function WeatherApp() {
  return (
    <div className="w-full min-h-screen bg-black text-white">
      <Header />
      <main className="max-w-[1400px] mx-auto p-4 md:p-6 space-y-6">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <TodayWeather />
          <div className="lg:col-span-2 space-y-6">
            <WeeklyForecast />
            <WeatherInsights />
          </div>
        </div>
        {/* Stats Section */}
        <StatCards />
        {/* Tomorrow and Rain Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TomorrowWeather />
          </div>
          <RainCharts />
        </div>
        {/* Other Cities */}
        <OtherCities />
        {/* 24-Hour Forecast */}
        <HourlyForecast />
        {/* 7-Day Forecast */}
        <SevenDayForecast />
        {/* Global Weather Map */}
        <GlobalWeatherMap />
      </main>
    </div>
  )
}

export default WeatherApp;