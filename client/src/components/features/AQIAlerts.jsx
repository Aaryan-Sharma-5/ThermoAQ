import { AlertTriangle, Bell, Check, Settings, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { authAPI } from '../../utils/api';

export function AQIAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [preferences, setPreferences] = useState({
    enableAlerts: true,
    aqiAlertThreshold: 150,
    healthConditions: []
  });
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true);

  const healthConditionOptions = [
    'Asthma',
    'Respiratory Issues',
    'Heart Disease',
    'Allergies',
    'COPD',
    'Other'
  ];

  useEffect(() => {
    loadAlerts();
    loadPreferences();
  }, []);

  const loadAlerts = async () => {
    try {
      const response = await authAPI.getAlerts();
      setAlerts(response.alerts || []);
    } catch (error) {
      console.error('Error loading alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPreferences = async () => {
    try {
      const response = await authAPI.getUserProfile();
      if (response.user.preferences) {
        setPreferences({
          enableAlerts: response.user.preferences.enableAlerts !== false,
          aqiAlertThreshold: response.user.preferences.aqiAlertThreshold || 150,
          healthConditions: response.user.preferences.healthConditions || []
        });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const markAsRead = async (alertId) => {
    try {
      await authAPI.markAlertAsRead(alertId);
      setAlerts(prev => prev.map(alert => 
        alert._id === alertId ? { ...alert, isRead: true } : alert
      ));
    } catch (error) {
      console.error('Error marking alert as read:', error);
    }
  };

  const savePreferences = async () => {
    try {
      await authAPI.updateUserPreferences(preferences);
      setShowSettings(false);
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  const toggleHealthCondition = (condition) => {
    setPreferences(prev => ({
      ...prev,
      healthConditions: prev.healthConditions.includes(condition)
        ? prev.healthConditions.filter(c => c !== condition)
        : [...prev.healthConditions, condition]
    }));
  };

  const unreadCount = alerts.filter(a => !a.isRead).length;

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-white">AQI Alerts</h2>
            {unreadCount > 0 && (
              <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Get notified when air quality exceeds your threshold
          </p>
        </div>
        <button
          onClick={() => setShowSettings(true)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
        >
          <Settings size={18} />
          Settings
        </button>
      </div>

      {/* Alert Threshold Info */}
      <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5 text-blue-400" />
          <div>
            <p className="text-white font-medium">Alert Threshold: {preferences.aqiAlertThreshold}</p>
            <p className="text-sm text-slate-400">
              You'll be notified when AQI exceeds this value
            </p>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
        </div>
      ) : alerts.length === 0 ? (
        <div className="text-center py-12 bg-slate-700/30 rounded-lg">
          <Bell className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <p className="text-slate-400">No alerts yet</p>
          <p className="text-sm text-slate-500 mt-1">You'll be notified when AQI levels are concerning</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {alerts.map((alert) => (
            <div
              key={alert._id}
              className={`p-4 rounded-lg border ${
                alert.isRead
                  ? 'bg-slate-700/30 border-slate-600'
                  : 'bg-orange-500/10 border-orange-500/30'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <AlertTriangle className={`w-5 h-5 mt-0.5 ${alert.isRead ? 'text-slate-400' : 'text-orange-400'}`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-semibold ${alert.isRead ? 'text-slate-300' : 'text-white'}`}>
                        {alert.location}
                      </h3>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        alert.aqi > 200
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-orange-500/20 text-orange-400'
                      }`}>
                        AQI {alert.aqi}
                      </span>
                    </div>
                    <p className={`text-sm ${alert.isRead ? 'text-slate-400' : 'text-slate-300'}`}>
                      {alert.message}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(alert.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                {!alert.isRead && (
                  <button
                    onClick={() => markAsRead(alert._id)}
                    className="ml-2 p-1 text-slate-400 hover:text-white transition-colors"
                    title="Mark as read"
                  >
                    <Check size={18} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-white/10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Alert Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Enable Alerts Toggle */}
              <div>
                <label className="flex items-center justify-between">
                  <span className="text-white font-medium">Enable Alerts</span>
                  <input
                    type="checkbox"
                    checked={preferences.enableAlerts}
                    onChange={(e) => setPreferences(prev => ({
                      ...prev,
                      enableAlerts: e.target.checked
                    }))}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </label>
                <p className="text-sm text-slate-400 mt-1">
                  Receive notifications for high pollution levels
                </p>
              </div>

              {/* AQI Threshold */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Alert Threshold (AQI)
                </label>
                <input
                  type="range"
                  min="50"
                  max="300"
                  step="10"
                  value={preferences.aqiAlertThreshold}
                  onChange={(e) => setPreferences(prev => ({
                    ...prev,
                    aqiAlertThreshold: parseInt(e.target.value)
                  }))}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-slate-400 mt-1">
                  <span>50</span>
                  <span className="text-white font-bold">{preferences.aqiAlertThreshold}</span>
                  <span>300</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  You'll be alerted when AQI exceeds this value
                </p>
              </div>

              {/* Health Conditions */}
              <div>
                <label className="block text-white font-medium mb-3">
                  Health Conditions (Optional)
                </label>
                <div className="space-y-2">
                  {healthConditionOptions.map((condition) => (
                    <label key={condition} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.healthConditions.includes(condition)}
                        onChange={() => toggleHealthCondition(condition)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-slate-300">{condition}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  We'll provide personalized health recommendations based on your conditions
                </p>
              </div>

              {/* Save Button */}
              <button
                onClick={savePreferences}
                className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
