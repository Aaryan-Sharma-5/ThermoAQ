import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  // Register user
  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Get current user
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await api.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return response.data;
  },
  
  // Get user profile
  getUserProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },
  
  // Update user profile
  updateUserProfile: async (userData) => {
    const response = await api.put('/user/profile', userData);
    return response.data;
  },
  
  // Get user location
  getUserLocation: async () => {
    const response = await api.get('/user/location');
    return response.data;
  },
  
  // Update user location
  updateUserLocation: async (locationData) => {
    const response = await api.post('/user/location', locationData);
    return response.data;
  },
  
  // Update user preferences
  updateUserPreferences: async (preferences) => {
    const response = await api.put('/user/preferences', preferences);
    return response.data;
  },
  
  // Monitored Locations
  addMonitoredLocation: async (locationData) => {
    const response = await api.post('/user/monitored-locations', locationData);
    return response.data;
  },
  
  removeMonitoredLocation: async (locationName) => {
    const response = await api.delete(`/user/monitored-locations/${encodeURIComponent(locationName)}`);
    return response.data;
  },
  
  // AQI History
  addAQIHistory: async (data) => {
    const response = await api.post('/user/aqi-history', data);
    return response.data;
  },
  
  getAQIHistory: async () => {
    const response = await api.get('/user/aqi-history');
    return response.data;
  },
  
  // Alerts
  getAlerts: async () => {
    const response = await api.get('/user/alerts');
    return response.data;
  },
  
  markAlertAsRead: async (alertId) => {
    const response = await api.put(`/user/alerts/${alertId}/read`);
    return response.data;
  },
  
  // Check alerts now (manual trigger)
  checkAlertsNow: async () => {
    const response = await api.post('/user/check-alerts');
    return response.data;
  },
  
  // Health Assessment
  generateHealthReport: async (assessmentData) => {
    const response = await api.post('/user/health-assessment', assessmentData);
    return response.data;
  },
  
  getHealthReports: async () => {
    const response = await api.get('/user/health-reports');
    return response.data;
  },
};

export default api;