import React, { useState, useEffect } from "react";
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
  Stethoscope,
  MessageSquare,
  MapPin,
  Clock,
} from "lucide-react";
import { authAPI } from "../../utils/api";
import aqiService from "../../services/aqiService";
import weatherService from "../../services/weatherService";
import { Header } from "../../layout/Header";
import { Footer } from "../../layout/Footer";

const HealthAssessment = () => {
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("");
  const [environmentalData, setEnvironmentalData] = useState(null);
  const [healthReport, setHealthReport] = useState(null);

  const [formData, setFormData] = useState({
    age: "",
    gender: "",
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
      skinRash: false,
    },
    preExistingConditions: {
      asthma: false,
      copd: false,
      heartDisease: false,
      diabetes: false,
      hypertension: false,
      allergies: false,
      other: "",
    },
    activityLevel: "moderate", // sedentary, light, moderate, active, very-active
    timeOutdoors: "1-2", // <1, 1-2, 2-4, 4-6, >6 hours
    additionalConcerns: "",
  });

  useEffect(() => {
    loadEnvironmentalData();
  }, []);

  const loadEnvironmentalData = async () => {
    setLoading(true);
    try {
      // Get user's current location from profile or use default
      const profileResponse = await authAPI.getUserProfile();
      const location =
        profileResponse.user?.preferences?.defaultLocation ||
        "Mumbai, Maharashtra";
      setCurrentLocation(location);

      const cityName = location.split(",")[0].trim();

      // Fetch current environmental conditions
      const [aqiData, weatherData] = await Promise.all([
        aqiService.getAirQuality(cityName),
        weatherService.getCurrentWeather(cityName),
      ]);

      setEnvironmentalData({
        aqi: aqiData.aqi,
        aqiLevel: aqiData.level,
        pollutants: aqiData.pollutants,
        temperature: weatherData.temperature,
        humidity: weatherData.humidity,
        uvIndex: weatherData.uvIndex,
        windSpeed: weatherData.windSpeed,
        visibility: weatherData.visibility,
      });
    } catch (error) {
      console.error("Failed to load environmental data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSymptomChange = (symptom) => {
    setFormData((prev) => ({
      ...prev,
      symptoms: {
        ...prev.symptoms,
        [symptom]: !prev.symptoms[symptom],
      },
    }));
  };

  const handleConditionChange = (condition) => {
    setFormData((prev) => ({
      ...prev,
      preExistingConditions: {
        ...prev.preExistingConditions,
        [condition]: !prev.preExistingConditions[condition],
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGenerating(true);

    try {
      const response = await authAPI.generateHealthReport({
        userData: formData,
        environmentalData,
        location: currentLocation,
      });

      setHealthReport(response.report);
    } catch (error) {
      console.error("Failed to generate health report:", error);
      alert("Failed to generate health report. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const getAQIColor = (aqi) => {
    if (aqi <= 50) return "text-green-400";
    if (aqi <= 100) return "text-yellow-400";
    if (aqi <= 150) return "text-orange-400";
    if (aqi <= 200) return "text-red-400";
    if (aqi <= 300) return "text-purple-400";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen text-white bg-black">
      <Header onLocationChange={(location) => setCurrentLocation(location)} />
      <div className="p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <Stethoscope className="w-10 h-10 text-blue-400" />
            <h1 className="text-3xl font-bold text-white md:text-4xl">
              Health Assessment
            </h1>
          </div>
          <p className="text-lg text-gray-400">
            Get a{" "}
            <span className="font-semibold text-blue-400">
              personalized health report
            </span>{" "}
            based on your location's environmental conditions
          </p>
        </div>

        {/* Environmental Conditions - Horizontal Layout */}
        <div className="p-6 mb-6 border shadow-lg bg-gray-900/50 backdrop-blur-sm rounded-2xl border-gray-800">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold text-white">
              Current Conditions
            </h2>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="w-10 h-10 text-blue-400 animate-spin" />
            </div>
          ) : environmentalData ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
              <div className="flex items-center justify-between p-4 transition-colors border rounded-lg bg-gray-800/50 border-gray-700 hover:border-blue-500/50">
                <div className="flex items-center gap-3">
                  <Wind className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Air Quality</p>
                    <div className="flex items-baseline gap-2">
                      <span className={`text-2xl font-bold ${getAQIColor(environmentalData.aqi)}`}>
                        {environmentalData.aqi}
                      </span>
                      <span className="text-xs text-gray-500">
                        {environmentalData.aqiLevel}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 transition-colors border rounded-lg bg-gray-800/50 border-gray-700 hover:border-orange-500/50">
                <div className="flex items-center gap-3">
                  <Thermometer className="w-5 h-5 text-orange-400" />
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Temperature</p>
                    <span className="text-2xl font-bold text-white">
                      {environmentalData.temperature}°C
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 transition-colors border rounded-lg bg-gray-800/50 border-gray-700 hover:border-cyan-500/50">
                <div className="flex items-center gap-3">
                  <Droplets className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Humidity</p>
                    <span className="text-2xl font-bold text-white">
                      {environmentalData.humidity}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 transition-colors border rounded-lg bg-gray-800/50 border-gray-700 hover:border-purple-500/50">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">UV Index</p>
                    <span className="text-2xl font-bold text-white">
                      {environmentalData.uvIndex}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 transition-colors border rounded-lg bg-gray-800/50 border-gray-700">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Location</p>
                    <p className="text-sm font-semibold text-white">
                      {currentLocation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500">No data available</p>
          )}
        </div>

        {/* Health Assessment Form */}
        <div className="grid grid-cols-1 gap-6">
          <div className="p-6 border shadow-lg bg-gray-900/50 backdrop-blur-sm rounded-2xl border-gray-800">
            <div className="flex items-center gap-3 mb-6">
              <Heart className="w-6 h-6 text-red-400" />
              <h2 className="text-xl font-bold text-white">
                Your Health Information
              </h2>
            </div>

            <div className="relative z-10">

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="p-4 border rounded-lg bg-gray-800/50 border-gray-700">
                  <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-white">
                    <User className="w-5 h-5" />
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-300">
                        Age
                      </label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 text-white transition-all border rounded-lg bg-gray-700/50 border-gray-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none"
                        placeholder="Enter your age"
                        required
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-300">
                        Gender
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 text-white transition-all border rounded-lg bg-gray-700/50 border-gray-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none"
                        required
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Current Symptoms */}
                <div className="p-4 border rounded-lg bg-gray-800/50 border-gray-700">
                  <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-white">
                    <AlertCircle className="w-5 h-5" />
                    Current Symptoms
                  </h3>
                  <p className="mb-3 text-sm text-gray-400">
                    Select all symptoms you're currently experiencing
                  </p>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                    {Object.keys(formData.symptoms).map((symptom) => (
                      <label
                        key={symptom}
                        className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                          formData.symptoms[symptom]
                            ? "bg-gradient-to-br bg-blue-500/20 border-blue-400"
                            : "bg-slate-700/30 border-gray-700 hover:border-slate-500"
                        } border`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.symptoms[symptom]}
                          onChange={() => handleSymptomChange(symptom)}
                          className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="text-sm text-white capitalize">
                          {symptom.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Pre-existing Conditions */}
                <div className="p-4 border rounded-lg bg-gray-800/50 border-gray-700">
                  <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-white">
                    <FileText className="w-5 h-5" />
                    Pre-existing Medical Conditions
                  </h3>
                  <p className="mb-3 text-sm text-gray-400">
                    Select any conditions that apply to you
                  </p>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {Object.keys(formData.preExistingConditions)
                      .filter((c) => c !== "other")
                      .map((condition) => (
                        <label
                          key={condition}
                          className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                            formData.preExistingConditions[condition]
                              ? "bg-gradient-to-br bg-orange-500/20 border-orange-400"
                              : "bg-slate-700/30 border-gray-700 hover:border-slate-500"
                          } border`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.preExistingConditions[condition]}
                            onChange={() => handleConditionChange(condition)}
                            className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
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
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        preExistingConditions: {
                          ...prev.preExistingConditions,
                          other: e.target.value,
                        },
                      }))
                    }
                    className="w-full px-4 py-2 mt-3 text-white transition-all border rounded-lg bg-gray-700/50 border-gray-600 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 focus:outline-none"
                  />
                </div>

                {/* Activity & Exposure */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="p-4 border rounded-lg bg-gray-800/50 border-gray-700">
                    <label className="flex items-center gap-2 mb-3 text-lg font-semibold text-white">
                      <Activity className="w-5 h-5" />
                      Activity Level
                    </label>
                    <select
                      name="activityLevel"
                      value={formData.activityLevel}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 text-white transition-all border rounded-lg bg-gray-700/50 border-gray-600 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 focus:outline-none"
                    >
                      <option value="sedentary">Sedentary</option>
                      <option value="light">Light Activity</option>
                      <option value="moderate">Moderate Activity</option>
                      <option value="active">Active</option>
                      <option value="very-active">Very Active</option>
                    </select>
                  </div>

                  <div className="p-4 border rounded-lg bg-gray-800/50 border-gray-700">
                    <label className="flex items-center gap-2 mb-3 text-lg font-semibold text-white">
                      <Calendar className="w-5 h-5" />
                      Time Outdoors (hours/day)
                    </label>
                    <select
                      name="timeOutdoors"
                      value={formData.timeOutdoors}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 text-white transition-all border rounded-lg bg-gray-700/50 border-gray-600 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 focus:outline-none"
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
                <div className="p-4 border rounded-lg bg-gray-800/50 border-gray-700">
                  <label className="flex items-center gap-2 mb-3 text-lg font-semibold text-white">
                    <MessageSquare className="w-5 h-5" />
                    Additional Concerns or Notes
                  </label>
                  <p className="mb-3 text-sm text-gray-400">
                    Describe any specific health concerns or questions
                  </p>
                  <textarea
                    name="additionalConcerns"
                    value={formData.additionalConcerns}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-2 text-white transition-all border rounded-lg resize-none bg-gray-700/50 border-gray-600 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none"
                    placeholder="Any specific symptoms, concerns, or questions you'd like to address..."
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={generating}
                  className="flex items-center justify-center w-full gap-2 px-6 py-3 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generating ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Generating Health Report...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Generate Health Report</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Health Report Display */}
          {healthReport && (
            <div className="p-6 mt-6 border shadow-lg bg-gray-900/50 backdrop-blur-sm rounded-2xl border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-green-400" />
                  <h2 className="text-2xl font-bold text-white">
                    Your Personalized Health Report
                  </h2>
                </div>
              
                </div>

                <div className="prose prose-invert max-w-none">
                  <div
                    className="space-y-4 leading-relaxed text-gray-300 health-report-content"
                    dangerouslySetInnerHTML={{
                      __html: healthReport,
                    }}
                  />
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
                  >
                    <FileText className="w-4 h-4" />
                    Print Report
                  </button>
                  <button
                    onClick={() => setHealthReport(null)}
                    className="px-4 py-2 text-white transition-colors border rounded-lg bg-gray-700 border-gray-600 hover:bg-gray-600"
                  >
                    Generate New Report
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HealthAssessment;
