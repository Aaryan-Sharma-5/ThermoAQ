import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  FileText, 
  Heart, 
  Loader, 
  Send,
  Thermometer,
  Wind,
  Droplets,
  Eye,
  TrendingUp,
  AlertTriangle,
  User,
  Calendar,
  Stethoscope
} from 'lucide-react';
import { authAPI } from '../../utils/api';
import aqiService from '../../services/aqiService';
import weatherService from '../../services/weatherService';

const HealthAssessment = () => {
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('');
  const [environmentalData, setEnvironmentalData] = useState(null);
  const [healthReport, setHealthReport] = useState(null);
  
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    symptoms: {
      cough: false,
      breathingDifficulty: false,
      chestPain: false,
      headache: false,
      dizziness: false,
      fatigue: false,
      eyeIrritation: false,
      throatIrritation: false,
      nausea: false,
      skinRash: false
    },
    preExistingConditions: {
      asthma: false,
      copd: false,
      heartDisease: false,
      diabetes: false,
      hypertension: false,
      allergies: false,
      other: ''
    },
    activityLevel: 'moderate', // sedentary, light, moderate, active, very-active
    timeOutdoors: '1-2', // <1, 1-2, 2-4, 4-6, >6 hours
    additionalConcerns: ''
  });

  useEffect(() => {
    loadEnvironmentalData();
  }, []);

  const loadEnvironmentalData = async () => {
    setLoading(true);
    try {
      // Get user's current location from profile or use default
      const profileResponse = await authAPI.getUserProfile();
      const location = profileResponse.user?.preferences?.defaultLocation || 'Mumbai, Maharashtra';
      setCurrentLocation(location);
      
      const cityName = location.split(',')[0].trim();
      
      // Fetch current environmental conditions
      const [aqiData, weatherData] = await Promise.all([
        aqiService.getAirQuality(cityName),
        weatherService.getCurrentWeather(cityName)
      ]);
      
      setEnvironmentalData({
        aqi: aqiData.aqi,
        aqiLevel: aqiData.level,
        pollutants: aqiData.pollutants,
        temperature: weatherData.temperature,
        humidity: weatherData.humidity,
        uvIndex: weatherData.uvIndex,
        windSpeed: weatherData.windSpeed,
        visibility: weatherData.visibility
      });
    } catch (error) {
      console.error('Failed to load environmental data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSymptomChange = (symptom) => {
    setFormData(prev => ({
      ...prev,
      symptoms: {
        ...prev.symptoms,
        [symptom]: !prev.symptoms[symptom]
      }
    }));
  };

  const handleConditionChange = (condition) => {
    setFormData(prev => ({
      ...prev,
      preExistingConditions: {
        ...prev.preExistingConditions,
        [condition]: !prev.preExistingConditions[condition]
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGenerating(true);
    
    try {
      const response = await authAPI.generateHealthReport({
        userData: formData,
        environmentalData,
        location: currentLocation
      });
      
      setHealthReport(response.report);
    } catch (error) {
      console.error('Failed to generate health report:', error);
      alert('Failed to generate health report. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const getAQIColor = (aqi) => {
    if (aqi <= 50) return 'text-green-400';
    if (aqi <= 100) return 'text-yellow-400';
    if (aqi <= 150) return 'text-orange-400';
    if (aqi <= 200) return 'text-red-400';
    if (aqi <= 300) return 'text-purple-400';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Stethoscope className="w-10 h-10 text-blue-400" />
            <h1 className="text-3xl font-bold text-white md:text-4xl">Health Assessment</h1>
          </div>
          <p className="text-slate-400">
            Get a personalized health report based on your location's environmental conditions
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Environmental Conditions Card */}
          <div className="p-6 border shadow-xl lg:col-span-1 bg-slate-800/50 backdrop-blur-sm rounded-3xl border-slate-700/50">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-semibold text-white">Current Conditions</h2>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader className="w-8 h-8 text-blue-400 animate-spin" />
              </div>
            ) : environmentalData ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30">
                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-slate-300">AQI</span>
                  </div>
                  <span className={`text-lg font-bold ${getAQIColor(environmentalData.aqi)}`}>
                    {environmentalData.aqi}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-orange-400" />
                    <span className="text-sm text-slate-300">Temperature</span>
                  </div>
                  <span className="text-lg font-bold text-white">{environmentalData.temperature}°C</span>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-slate-300">Humidity</span>
                  </div>
                  <span className="text-lg font-bold text-white">{environmentalData.humidity}%</span>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-slate-300">UV Index</span>
                  </div>
                  <span className="text-lg font-bold text-white">{environmentalData.uvIndex}</span>
                </div>
                
                <div className="p-3 border rounded-lg bg-slate-900/50 border-slate-600">
                  <p className="mb-2 text-xs font-semibold text-slate-400">Location</p>
                  <p className="text-sm text-white">{currentLocation}</p>
                </div>
              </div>
            ) : (
              <p className="text-center text-slate-400">No data available</p>
            )}
          </div>

          {/* Health Assessment Form */}
          <div className="p-6 border shadow-xl lg:col-span-2 bg-slate-800/50 backdrop-blur-sm rounded-3xl border-slate-700/50">
            <div className="flex items-center gap-2 mb-6">
              <Heart className="w-5 h-5 text-red-400" />
              <h2 className="text-xl font-semibold text-white">Your Health Information</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-300">
                    <User className="inline w-4 h-4 mr-1" />
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 text-white border rounded-lg bg-slate-700/50 border-slate-600 focus:border-blue-400 focus:outline-none"
                    placeholder="Enter your age"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-300">
                    <User className="inline w-4 h-4 mr-1" />
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 text-white border rounded-lg bg-slate-700/50 border-slate-600 focus:border-blue-400 focus:outline-none"
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Current Symptoms */}
              <div>
                <label className="block mb-3 text-sm font-medium text-slate-300">
                  <AlertCircle className="inline w-4 h-4 mr-1" />
                  Current Symptoms (Select all that apply)
                </label>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {Object.keys(formData.symptoms).map((symptom) => (
                    <label
                      key={symptom}
                      className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all ${
                        formData.symptoms[symptom]
                          ? 'bg-blue-500/20 border-blue-400'
                          : 'bg-slate-700/30 border-slate-600'
                      } border`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.symptoms[symptom]}
                        onChange={() => handleSymptomChange(symptom)}
                        className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-white capitalize">
                        {symptom.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Pre-existing Conditions */}
              <div>
                <label className="block mb-3 text-sm font-medium text-slate-300">
                  <FileText className="inline w-4 h-4 mr-1" />
                  Pre-existing Conditions
                </label>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {Object.keys(formData.preExistingConditions)
                    .filter(c => c !== 'other')
                    .map((condition) => (
                      <label
                        key={condition}
                        className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all ${
                          formData.preExistingConditions[condition]
                            ? 'bg-orange-500/20 border-orange-400'
                            : 'bg-slate-700/30 border-slate-600'
                        } border`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.preExistingConditions[condition]}
                          onChange={() => handleConditionChange(condition)}
                          className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <span className="text-sm text-white uppercase">
                          {condition}
                        </span>
                      </label>
                    ))}
                </div>
                <input
                  type="text"
                  placeholder="Other conditions (comma separated)"
                  value={formData.preExistingConditions.other}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    preExistingConditions: {
                      ...prev.preExistingConditions,
                      other: e.target.value
                    }
                  }))}
                  className="w-full px-4 py-2 mt-3 text-white border rounded-lg bg-slate-700/50 border-slate-600 focus:border-orange-400 focus:outline-none"
                />
              </div>

              {/* Activity & Exposure */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-300">
                    <Activity className="inline w-4 h-4 mr-1" />
                    Activity Level
                  </label>
                  <select
                    name="activityLevel"
                    value={formData.activityLevel}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 text-white border rounded-lg bg-slate-700/50 border-slate-600 focus:border-blue-400 focus:outline-none"
                  >
                    <option value="sedentary">Sedentary</option>
                    <option value="light">Light Activity</option>
                    <option value="moderate">Moderate Activity</option>
                    <option value="active">Active</option>
                    <option value="very-active">Very Active</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-300">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    Time Outdoors (hours/day)
                  </label>
                  <select
                    name="timeOutdoors"
                    value={formData.timeOutdoors}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 text-white border rounded-lg bg-slate-700/50 border-slate-600 focus:border-blue-400 focus:outline-none"
                  >
                    <option value="<1">Less than 1 hour</option>
                    <option value="1-2">1-2 hours</option>
                    <option value="2-4">2-4 hours</option>
                    <option value="4-6">4-6 hours</option>
                    <option value=">6">More than 6 hours</option>
                  </select>
                </div>
              </div>

              {/* Additional Concerns */}
              <div>
                <label className="block mb-2 text-sm font-medium text-slate-300">
                  Additional Concerns or Notes
                </label>
                <textarea
                  name="additionalConcerns"
                  value={formData.additionalConcerns}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-2 text-white border rounded-lg bg-slate-700/50 border-slate-600 focus:border-blue-400 focus:outline-none"
                  placeholder="Describe any specific health concerns or questions..."
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={generating}
                className="flex items-center justify-center w-full gap-2 px-6 py-3 text-white transition-all duration-300 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generating ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Generating Report...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Generate Health Report
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Health Report Display */}
        {healthReport && (
          <div className="p-6 mt-6 border shadow-xl bg-slate-800/50 backdrop-blur-sm rounded-3xl border-slate-700/50">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="w-6 h-6 text-green-400" />
              <h2 className="text-2xl font-bold text-white">Your Personalized Health Report</h2>
            </div>

            <div className="prose prose-invert max-w-none">
              <div className="p-4 mb-6 border-l-4 rounded-lg bg-blue-500/10 border-blue-400">
                <p className="text-sm text-blue-200">
                  <AlertTriangle className="inline w-4 h-4 mr-1" />
                  This report is AI-generated and for informational purposes only. Always consult healthcare professionals for medical advice.
                </p>
              </div>

              <div 
                className="space-y-4 text-slate-200"
                dangerouslySetInnerHTML={{ __html: healthReport.replace(/\n/g, '<br/>') }}
              />
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 text-white transition-all bg-green-600 rounded-lg hover:bg-green-700"
              >
                <FileText className="w-4 h-4" />
                Print Report
              </button>
              <button
                onClick={() => setHealthReport(null)}
                className="px-4 py-2 text-white transition-all border rounded-lg bg-slate-700 border-slate-600 hover:bg-slate-600"
              >
                Generate New Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthAssessment;
