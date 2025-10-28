import { AlertTriangle, CloudRain, Thermometer, Wind, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export function WeatherAlerts({ weatherData, aqiData }) {
  const [alerts, setAlerts] = useState([]);
  const [dismissedAlerts, setDismissedAlerts] = useState([]);

  useEffect(() => {
    if (!weatherData && !aqiData) return;

    const newAlerts = [];

    // Temperature alerts
    if (weatherData?.temperature) {
      if (weatherData.temperature > 40) {
        newAlerts.push({
          id: 'extreme-heat',
          type: 'danger',
          icon: Thermometer,
          title: 'Extreme Heat Warning',
          message: `Temperature is ${weatherData.temperature}°C. Stay hydrated and avoid outdoor activities.`,
          color: 'bg-red-600'
        });
      } else if (weatherData.temperature > 35) {
        newAlerts.push({
          id: 'high-heat',
          type: 'warning',
          icon: Thermometer,
          title: 'High Temperature Alert',
          message: `Temperature is ${weatherData.temperature}°C. Take precautions in the heat.`,
          color: 'bg-orange-600'
        });
      } else if (weatherData.temperature < 5) {
        newAlerts.push({
          id: 'cold-warning',
          type: 'warning',
          icon: Thermometer,
          title: 'Cold Weather Alert',
          message: `Temperature is ${weatherData.temperature}°C. Dress warmly.`,
          color: 'bg-blue-600'
        });
      }
    }

    // Weather condition alerts
    if (weatherData?.condition) {
      const condition = weatherData.condition.toLowerCase();
      if (condition.includes('storm') || condition.includes('thunder')) {
        newAlerts.push({
          id: 'storm-warning',
          type: 'danger',
          icon: AlertTriangle,
          title: 'Storm Warning',
          message: 'Thunderstorms expected. Stay indoors and avoid travel if possible.',
          color: 'bg-red-600'
        });
      } else if (condition.includes('heavy rain') || condition.includes('torrential')) {
        newAlerts.push({
          id: 'heavy-rain',
          type: 'warning',
          icon: CloudRain,
          title: 'Heavy Rainfall Alert',
          message: 'Heavy rain expected. Be cautious of flooding.',
          color: 'bg-yellow-600'
        });
      }
    }

    // Wind alerts
    if (weatherData?.windStatus > 40) {
      newAlerts.push({
        id: 'high-wind',
        type: 'warning',
        icon: Wind,
        title: 'High Wind Alert',
        message: `Wind speed is ${weatherData.windStatus} km/h. Secure loose objects.`,
        color: 'bg-orange-600'
      });
    }

    // AQI alerts
    if (aqiData?.aqi) {
      if (aqiData.aqi > 300) {
        newAlerts.push({
          id: 'aqi-hazardous',
          type: 'danger',
          icon: AlertTriangle,
          title: 'Hazardous Air Quality',
          message: 'Air quality is hazardous. Avoid all outdoor activities.',
          color: 'bg-purple-900'
        });
      } else if (aqiData.aqi > 200) {
        newAlerts.push({
          id: 'aqi-very-unhealthy',
          type: 'danger',
          icon: AlertTriangle,
          title: 'Very Unhealthy Air',
          message: 'Air quality is very unhealthy. Limit outdoor exposure.',
          color: 'bg-red-600'
        });
      } else if (aqiData.aqi > 150) {
        newAlerts.push({
          id: 'aqi-unhealthy',
          type: 'warning',
          icon: AlertTriangle,
          title: 'Unhealthy Air Quality',
          message: 'Sensitive groups should reduce outdoor activities.',
          color: 'bg-orange-600'
        });
      }
    }

    // Filter out dismissed alerts
    const activeAlerts = newAlerts.filter(alert => !dismissedAlerts.includes(alert.id));
    setAlerts(activeAlerts);
  }, [weatherData, aqiData, dismissedAlerts]);

  const handleDismiss = (alertId) => {
    setDismissedAlerts([...dismissedAlerts, alertId]);
  };

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-3">
      {alerts.map((alert) => {
        const Icon = alert.icon;
        return (
          <div
            key={alert.id}
            className={`${alert.color} rounded-lg p-4 flex items-start gap-3 animate-slide-in shadow-lg`}
          >
            <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-white mb-1">{alert.title}</h4>
              <p className="text-sm text-white/90">{alert.message}</p>
            </div>
            <button
              onClick={() => handleDismiss(alert.id)}
              className="text-white/80 hover:text-white transition-colors p-1"
              aria-label="Dismiss alert"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
