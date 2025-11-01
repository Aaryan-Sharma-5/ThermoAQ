import { Activity, AlertCircle, Heart, Sparkles, Wind } from 'lucide-react';
import { useEffect, useState } from 'react';
import { authAPI } from '../../utils/api';
import aqiService from '../../services/aqiService';

export function HealthRecommendations() {
  const [currentAQI, setCurrentAQI] = useState(null);
  const [location] = useState('Mumbai');
  const [healthConditions, setHealthConditions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUserData = async () => {
    try {
      const response = await authAPI.getUserProfile();
      if (response.user.preferences?.healthConditions) {
        setHealthConditions(response.user.preferences.healthConditions);
      }
      
      // Get current location AQI
      const aqiData = await aqiService.getAirQuality(location);
      setCurrentAQI(aqiData.aqi);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAQILevel = (aqi) => {
    if (aqi <= 50) return { level: 'Good', color: 'green' };
    if (aqi <= 100) return { level: 'Moderate', color: 'yellow' };
    if (aqi <= 150) return { level: 'Unhealthy for Sensitive Groups', color: 'orange' };
    if (aqi <= 200) return { level: 'Unhealthy', color: 'red' };
    return { level: 'Very Unhealthy', color: 'purple' };
  };

  const getGeneralRecommendations = (aqi) => {
    if (aqi <= 50) {
      return [
        { icon: Activity, text: 'Great day for outdoor activities and exercise', type: 'positive' },
        { icon: Wind, text: 'Air quality is excellent - enjoy time outside', type: 'positive' },
        { icon: Heart, text: 'Perfect conditions for cardiovascular workouts', type: 'positive' }
      ];
    } else if (aqi <= 100) {
      return [
        { icon: Activity, text: 'Generally safe for outdoor activities', type: 'neutral' },
        { icon: Wind, text: 'Sensitive individuals should monitor symptoms', type: 'neutral' },
        { icon: Heart, text: 'Reduce intensity of outdoor workouts if sensitive', type: 'neutral' }
      ];
    } else if (aqi <= 150) {
      return [
        { icon: AlertCircle, text: 'Limit prolonged outdoor activities', type: 'warning' },
        { icon: Wind, text: 'Sensitive groups should stay indoors when possible', type: 'warning' },
        { icon: Heart, text: 'Consider indoor exercise alternatives', type: 'warning' }
      ];
    } else if (aqi <= 200) {
      return [
        { icon: AlertCircle, text: 'Avoid outdoor activities if possible', type: 'danger' },
        { icon: Wind, text: 'Everyone should reduce outdoor exertion', type: 'danger' },
        { icon: Heart, text: 'Stay indoors and keep windows closed', type: 'danger' }
      ];
    } else {
      return [
        { icon: AlertCircle, text: 'Health alert: Stay indoors', type: 'danger' },
        { icon: Wind, text: 'Avoid all outdoor activities', type: 'danger' },
        { icon: Heart, text: 'Use air purifiers if available', type: 'danger' }
      ];
    }
  };

  const getConditionSpecificAdvice = (condition, aqi) => {
    const advice = {
      'Asthma': {
        low: 'Great air quality - safe for all activities',
        moderate: 'Keep rescue inhaler nearby during outdoor activities',
        unhealthy: 'Stay indoors, keep rescue inhaler accessible',
        veryUnhealthy: 'Remain indoors, use prescribed medications, avoid triggers'
      },
      'Respiratory Issues': {
        low: 'Excellent conditions for breathing exercises',
        moderate: 'Monitor symptoms during outdoor activities',
        unhealthy: 'Limit outdoor exposure, stay in air-conditioned spaces',
        veryUnhealthy: 'Stay indoors, use humidifier, consult doctor if symptoms worsen'
      },
      'Heart Disease': {
        low: 'Safe for moderate cardiovascular exercise',
        moderate: 'Light to moderate activity acceptable, monitor symptoms',
        unhealthy: 'Avoid strenuous activities, stay indoors',
        veryUnhealthy: 'Complete rest recommended, monitor heart rate and symptoms'
      },
      'Allergies': {
        low: 'Good day for outdoor activities',
        moderate: 'Take antihistamines if planning outdoor activities',
        unhealthy: 'Stay indoors with windows closed, use air purifier',
        veryUnhealthy: 'Remain indoors, use HEPA filters, take prescribed medications'
      },
      'COPD': {
        low: 'Safe to be outdoors with normal activities',
        moderate: 'Pace yourself, take breaks during activities',
        unhealthy: 'Stay indoors, use oxygen therapy as prescribed',
        veryUnhealthy: 'Emergency plan ready, stay indoors, contact doctor if symptoms worsen'
      }
    };

    const severityLevel = aqi <= 50 ? 'low' : aqi <= 100 ? 'moderate' : aqi <= 150 ? 'unhealthy' : 'veryUnhealthy';
    return advice[condition]?.[severityLevel] || 'Monitor your condition and consult with your healthcare provider';
  };

  const getProtectiveMeasures = (aqi) => {
    if (aqi <= 50) {
      return [
        'Enjoy outdoor activities freely',
        'Open windows for fresh air circulation',
        'Perfect time for gardening or walks'
      ];
    } else if (aqi <= 100) {
      return [
        'Close windows during peak pollution hours',
        'Consider wearing a mask during long outdoor exposure',
        'Stay hydrated to help body process pollutants'
      ];
    } else if (aqi <= 150) {
      return [
        'Wear N95/N99 mask when going outside',
        'Keep windows and doors closed',
        'Use air purifiers indoors if available',
        'Limit outdoor time to essential activities only'
      ];
    } else {
      return [
        'Mandatory N95/N99 mask usage outdoors',
        'Seal windows and doors',
        'Run air purifiers continuously',
        'Avoid all non-essential outdoor activities',
        'Check AQI before leaving home'
      ];
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
        </div>
      </div>
    );
  }

  const aqiInfo = getAQILevel(currentAQI);
  const generalRecs = getGeneralRecommendations(currentAQI);
  const protectiveMeasures = getProtectiveMeasures(currentAQI);

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Health Recommendations</h2>
          <p className="text-sm text-slate-400 mt-1">
            Personalized advice based on current air quality
          </p>
        </div>
        <Sparkles className="w-8 h-8 text-blue-400" />
      </div>

      {/* Current AQI Status */}
      <div className={`p-4 rounded-lg mb-6 ${
        aqiInfo.color === 'green' ? 'bg-green-500/10 border border-green-500/20' :
        aqiInfo.color === 'yellow' ? 'bg-yellow-500/10 border border-yellow-500/20' :
        aqiInfo.color === 'orange' ? 'bg-orange-500/10 border border-orange-500/20' :
        aqiInfo.color === 'red' ? 'bg-red-500/10 border border-red-500/20' :
        'bg-purple-500/10 border border-purple-500/20'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Current Air Quality</p>
            <p className={`text-3xl font-bold ${
              aqiInfo.color === 'green' ? 'text-green-400' :
              aqiInfo.color === 'yellow' ? 'text-yellow-400' :
              aqiInfo.color === 'orange' ? 'text-orange-400' :
              aqiInfo.color === 'red' ? 'text-red-400' :
              'text-purple-400'
            }`}>
              {currentAQI}
            </p>
          </div>
          <div className="text-right">
            <p className={`text-lg font-semibold ${
              aqiInfo.color === 'green' ? 'text-green-400' :
              aqiInfo.color === 'yellow' ? 'text-yellow-400' :
              aqiInfo.color === 'orange' ? 'text-orange-400' :
              aqiInfo.color === 'red' ? 'text-red-400' :
              'text-purple-400'
            }`}>
              {aqiInfo.level}
            </p>
            <p className="text-sm text-slate-400">{location}</p>
          </div>
        </div>
      </div>

      {/* General Recommendations */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">General Recommendations</h3>
        <div className="space-y-2">
          {generalRecs.map((rec, index) => {
            const Icon = rec.icon;
            return (
              <div
                key={index}
                className={`flex items-start gap-3 p-3 rounded-lg ${
                  rec.type === 'positive' ? 'bg-green-500/10 border border-green-500/20' :
                  rec.type === 'neutral' ? 'bg-blue-500/10 border border-blue-500/20' :
                  rec.type === 'warning' ? 'bg-orange-500/10 border border-orange-500/20' :
                  'bg-red-500/10 border border-red-500/20'
                }`}
              >
                <Icon className={`w-5 h-5 mt-0.5 ${
                  rec.type === 'positive' ? 'text-green-400' :
                  rec.type === 'neutral' ? 'text-blue-400' :
                  rec.type === 'warning' ? 'text-orange-400' :
                  'text-red-400'
                }`} />
                <p className="text-slate-200">{rec.text}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Condition-Specific Advice */}
      {healthConditions.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">
            Your Health Conditions ({healthConditions.length})
          </h3>
          <div className="space-y-3">
            {healthConditions.map((condition, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-slate-700/50 border border-white/10"
              >
                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-red-400 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">{condition}</h4>
                    <p className="text-sm text-slate-300">
                      {getConditionSpecificAdvice(condition, currentAQI)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Protective Measures */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Protective Measures</h3>
        <div className="space-y-2">
          {protectiveMeasures.map((measure, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg bg-slate-700/30"
            >
              <div className="w-2 h-2 rounded-full bg-blue-400 mt-2"></div>
              <p className="text-slate-200">{measure}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <p className="text-xs text-slate-400">
          <span className="font-semibold text-blue-400">Note:</span> These are general recommendations. 
          Always consult with your healthcare provider for personalized medical advice.
        </p>
      </div>
    </div>
  );
}
