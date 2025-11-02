const User = require('../models/User');
const axios = require('axios');

/**
 * Alert Generation Service
 * Checks monitored locations and creates alerts when thresholds are exceeded
 */

class AlertService {
  constructor() {
    this.WAQI_API_KEY = process.env.WAQI_API_KEY;
    this.WAQI_BASE_URL = 'https://api.waqi.info/feed';
  }

  /**
   * Fetch current AQI for a location
   */
  async fetchAQI(location) {
    try {
      const response = await axios.get(`${this.WAQI_BASE_URL}/${location}/?token=${this.WAQI_API_KEY}`);
      
      if (response.data.status === 'ok') {
        return {
          aqi: response.data.data.aqi,
          location: response.data.data.city.name,
          dominentpol: response.data.data.dominentpol,
          time: response.data.data.time.s
        };
      }
      return null;
    } catch (error) {
      console.error(`Error fetching AQI for ${location}:`, error.message);
      return null;
    }
  }

  /**
   * Get AQI category and health message
   */
  getAQICategory(aqi) {
    if (aqi <= 50) {
      return {
        category: 'Good',
        message: 'Air quality is satisfactory, and air pollution poses little or no risk.',
        severity: 'info'
      };
    } else if (aqi <= 100) {
      return {
        category: 'Moderate',
        message: 'Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.',
        severity: 'info'
      };
    } else if (aqi <= 150) {
      return {
        category: 'Unhealthy for Sensitive Groups',
        message: 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.',
        severity: 'warning'
      };
    } else if (aqi <= 200) {
      return {
        category: 'Unhealthy',
        message: 'Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.',
        severity: 'warning'
      };
    } else if (aqi <= 300) {
      return {
        category: 'Very Unhealthy',
        message: 'Health alert: The risk of health effects is increased for everyone.',
        severity: 'critical'
      };
    } else {
      return {
        category: 'Hazardous',
        message: 'Health warning of emergency conditions: everyone is more likely to be affected.',
        severity: 'critical'
      };
    }
  }

  /**
   * Create an alert for a user
   */
  async createAlert(userId, alertData) {
    try {
      await User.findByIdAndUpdate(userId, {
        $push: {
          alerts: {
            type: alertData.type || 'aqi_threshold',
            title: alertData.title,
            message: alertData.message,
            severity: alertData.severity,
            location: alertData.location,
            aqi: alertData.aqi,
            isRead: false,
            createdAt: new Date()
          }
        }
      });
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`✓ Alert created for user ${userId}: ${alertData.location} AQI ${alertData.aqi}`);
      }
    } catch (error) {
      console.error(`Error creating alert for user ${userId}:`, error.message);
    }
  }

  /**
   * Check if user already has a recent alert for this location
   */
  async hasRecentAlert(userId, location, hours = 6) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.alerts) return false;

      const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);
      
      return user.alerts.some(alert => 
        alert.location === location &&
        alert.createdAt > cutoffTime
      );
    } catch (error) {
      console.error('Error checking recent alerts:', error.message);
      return false;
    }
  }

  /**
   * Check all users' monitored locations and create alerts
   */
  async checkAllUsers() {
    try {
      // Find all users with alerts enabled and monitored locations
      const users = await User.find({
        'preferences.enableAlerts': { $ne: false },
        'monitoredLocations.0': { $exists: true }
      });

      if (process.env.NODE_ENV === 'development') {
        console.log(`\n🔍 Checking alerts for ${users.length} users...`);
      }

      let alertsCreated = 0;

      for (const user of users) {
        const threshold = user.preferences?.aqiAlertThreshold || 150;
        
        for (const locationObj of user.monitoredLocations) {
          const locationName = locationObj.name || locationObj.location || locationObj;
          
          // Skip if user already has a recent alert for this location
          const hasRecent = await this.hasRecentAlert(user._id, locationName, 6);
          if (hasRecent) continue;

          // Fetch current AQI
          const aqiData = await this.fetchAQI(locationName);
          
          if (aqiData && aqiData.aqi >= threshold) {
            const category = this.getAQICategory(aqiData.aqi);
            
            // Create personalized message based on health conditions
            let message = `Current AQI: ${aqiData.aqi} (${category.category}). ${category.message}`;
            
            if (user.preferences?.healthConditions?.length > 0) {
              message += ` Given your health conditions (${user.preferences.healthConditions.join(', ')}), please take extra precautions.`;
            }

            // Create alert
            await this.createAlert(user._id, {
              type: 'aqi_threshold',
              title: `High AQI Alert - ${locationName}`,
              message: message,
              severity: category.severity,
              location: locationName,
              aqi: aqiData.aqi
            });

            alertsCreated++;
          }

          // Add delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      if (process.env.NODE_ENV === 'development') {
        console.log(`✓ Alert check complete. Created ${alertsCreated} new alerts.\n`);
      }

      return {
        usersChecked: users.length,
        alertsCreated: alertsCreated
      };
    } catch (error) {
      console.error('Error in checkAllUsers:', error);
      return {
        usersChecked: 0,
        alertsCreated: 0,
        error: error.message
      };
    }
  }

  /**
   * Check specific location for a user
   */
  async checkUserLocation(userId, location) {
    try {
      const user = await User.findById(userId);
      if (!user) throw new Error('User not found');

      const threshold = user.preferences?.aqiAlertThreshold || 150;
      const aqiData = await this.fetchAQI(location);

      if (!aqiData) {
        return { success: false, message: 'Could not fetch AQI data' };
      }

      if (aqiData.aqi >= threshold) {
        const category = this.getAQICategory(aqiData.aqi);
        
        let message = `Current AQI: ${aqiData.aqi} (${category.category}). ${category.message}`;
        
        if (user.preferences?.healthConditions?.length > 0) {
          message += ` Given your health conditions, please take extra precautions.`;
        }

        await this.createAlert(userId, {
          type: 'aqi_threshold',
          title: `High AQI Alert - ${location}`,
          message: message,
          severity: category.severity,
          location: location,
          aqi: aqiData.aqi
        });

        return {
          success: true,
          alertCreated: true,
          aqi: aqiData.aqi,
          category: category.category
        };
      }

      return {
        success: true,
        alertCreated: false,
        aqi: aqiData.aqi,
        message: 'AQI is below threshold'
      };
    } catch (error) {
      console.error('Error checking user location:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new AlertService();
