import { createContext, useContext, useEffect, useReducer } from 'react';
import { authAPI } from '../utils/api';

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: true,
  error: null,
  userLocation: null,
};

// Action types
const AUTH_TYPES = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAIL: 'LOGIN_FAIL',
  SIGNUP_START: 'SIGNUP_START',
  SIGNUP_SUCCESS: 'SIGNUP_SUCCESS',
  SIGNUP_FAIL: 'SIGNUP_FAIL',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_LOADING: 'SET_LOADING',
  UPDATE_LOCATION: 'UPDATE_LOCATION',
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_TYPES.LOGIN_START:
    case AUTH_TYPES.SIGNUP_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case AUTH_TYPES.LOGIN_SUCCESS:
    case AUTH_TYPES.SIGNUP_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };
    case AUTH_TYPES.LOGIN_FAIL:
    case AUTH_TYPES.SIGNUP_FAIL:
      return {
        ...state,
        loading: false,
        user: null,
        token: null,
        error: action.payload,
      };
    case AUTH_TYPES.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
        error: null,
      };
    case AUTH_TYPES.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    case AUTH_TYPES.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case AUTH_TYPES.UPDATE_LOCATION:
      return {
        ...state,
        userLocation: action.payload,
      };
    default:
      return state;
  }
};

// Context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Detect user's location using browser geolocation
  const detectLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Reverse geocoding to get city name
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            
            const location = {
              city: data.address.city || data.address.town || data.address.village || 'Mumbai',
              state: data.address.state || 'Maharashtra',
              latitude,
              longitude
            };
            
            resolve(location);
          } catch (err) {
            console.error('Reverse geocoding failed:', err);
            resolve({ city: 'Mumbai', state: 'Maharashtra', latitude, longitude });
          }
        },
        (err) => {
          console.error('Geolocation error:', err);
          reject(err);
        }
      );
    });
  };

  // Fetch user location from backend
  const fetchUserLocation = async () => {
    try {
      const response = await authAPI.getUserLocation();
      dispatch({
        type: AUTH_TYPES.UPDATE_LOCATION,
        payload: response.location
      });
      return response.location;
    } catch (err) {
      console.error('Failed to fetch user location:', err);
      return null;
    }
  };

  // Update user location in backend
  const updateUserLocation = async (locationData) => {
    try {
      const response = await authAPI.updateUserLocation(locationData);
      dispatch({
        type: AUTH_TYPES.UPDATE_LOCATION,
        payload: response.location
      });
      return response.location;
    } catch (err) {
      console.error('Failed to update user location:', err);
      throw err;
    }
  };

  // Auto-detect and save location
  const autoDetectAndSaveLocation = async () => {
    try {
      const location = await detectLocation();
      await updateUserLocation(location);
      return location;
    } catch (err) {
      console.error('Auto-detect location failed:', err);
      return null;
    }
  };

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await authAPI.getMe();
          dispatch({
            type: AUTH_TYPES.LOGIN_SUCCESS,
            payload: {
              user: response.user,
              token: token,
            },
          });
          
          // Fetch user location after successful auth
          await fetchUserLocation();
        } catch (err) {
          console.error('Auth check failed:', err);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          dispatch({ type: AUTH_TYPES.LOGOUT });
        }
      }
      dispatch({ type: AUTH_TYPES.SET_LOADING, payload: false });
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_TYPES.LOGIN_START });
      const response = await authAPI.login(credentials);
      
      // Store token and user in localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      dispatch({
        type: AUTH_TYPES.LOGIN_SUCCESS,
        payload: response,
      });
      
      // Auto-detect and save location after login
      setTimeout(async () => {
        try {
          await autoDetectAndSaveLocation();
        } catch (err) {
          console.error('Location detection failed:', err);
        }
      }, 500);
      
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({
        type: AUTH_TYPES.LOGIN_FAIL,
        payload: errorMessage,
      });
      throw new Error(errorMessage);
    }
  };

  // Signup function
  const signup = async (userData) => {
    try {
      dispatch({ type: AUTH_TYPES.SIGNUP_START });
      const response = await authAPI.signup(userData);
      
      // Store token and user in localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      dispatch({
        type: AUTH_TYPES.SIGNUP_SUCCESS,
        payload: response,
      });
      
      // Auto-detect and save location after signup
      setTimeout(async () => {
        try {
          await autoDetectAndSaveLocation();
        } catch (err) {
          console.error('Location detection failed:', err);
        }
      }, 500);
      
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Signup failed';
      dispatch({
        type: AUTH_TYPES.SIGNUP_FAIL,
        payload: errorMessage,
      });
      throw new Error(errorMessage);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear localStorage and update state
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      dispatch({ type: AUTH_TYPES.LOGOUT });
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: AUTH_TYPES.CLEAR_ERROR });
  };

  const value = {
    ...state,
    login,
    signup,
    logout,
    clearError,
    detectLocation,
    fetchUserLocation,
    updateUserLocation,
    autoDetectAndSaveLocation,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};