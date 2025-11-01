const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// @route   GET /api/user/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        favorites: user.favorites || [],
        preferences: user.preferences || {},
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
});

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, email } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      user.email = email;
    }

    if (name) user.name = name;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
});

// @route   POST /api/user/favorites
// @desc    Add location to favorites
// @access  Private
router.post('/favorites', auth, async (req, res) => {
  try {
    const { location } = req.body;
    
    if (!location) {
      return res.status(400).json({ message: 'Location is required' });
    }

    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Initialize favorites array if it doesn't exist
    if (!user.favorites) {
      user.favorites = [];
    }

    // Check if location is already in favorites
    if (user.favorites.includes(location)) {
      return res.status(400).json({ message: 'Location already in favorites' });
    }

    user.favorites.push(location);
    await user.save();

    res.json({
      success: true,
      message: 'Location added to favorites',
      favorites: user.favorites
    });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ message: 'Server error while adding favorite' });
  }
});

// @route   DELETE /api/user/favorites/:location
// @desc    Remove location from favorites
// @access  Private
router.delete('/favorites/:location', auth, async (req, res) => {
  try {
    const { location } = req.params;
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.favorites) {
      return res.status(400).json({ message: 'No favorites found' });
    }

    user.favorites = user.favorites.filter(fav => fav !== location);
    await user.save();

    res.json({
      success: true,
      message: 'Location removed from favorites',
      favorites: user.favorites
    });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ message: 'Server error while removing favorite' });
  }
});

// @route   PUT /api/user/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', auth, async (req, res) => {
  try {
    const preferences = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.preferences = {
      ...user.preferences,
      ...preferences
    };

    await user.save();

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      preferences: user.preferences
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ message: 'Server error while updating preferences' });
  }
});

// @route   POST /api/user/monitored-locations
// @desc    Add location to monitoring
// @access  Private
router.post('/monitored-locations', auth, async (req, res) => {
  try {
    const { name, alertEnabled } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Location name is required' });
    }

    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if location already monitored
    const exists = user.monitoredLocations?.find(loc => loc.name === name);
    if (exists) {
      return res.status(400).json({ message: 'Location already being monitored' });
    }

    if (!user.monitoredLocations) {
      user.monitoredLocations = [];
    }

    user.monitoredLocations.push({
      name,
      alertEnabled: alertEnabled !== undefined ? alertEnabled : true,
      addedAt: new Date()
    });

    await user.save();

    res.json({
      success: true,
      message: 'Location added to monitoring',
      monitoredLocations: user.monitoredLocations
    });
  } catch (error) {
    console.error('Add monitored location error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/user/monitored-locations/:locationName
// @desc    Remove location from monitoring
// @access  Private
router.delete('/monitored-locations/:locationName', auth, async (req, res) => {
  try {
    const { locationName } = req.params;
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.monitoredLocations = user.monitoredLocations?.filter(
      loc => loc.name !== locationName
    ) || [];

    await user.save();

    res.json({
      success: true,
      message: 'Location removed from monitoring',
      monitoredLocations: user.monitoredLocations
    });
  } catch (error) {
    console.error('Remove monitored location error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/user/aqi-history
// @desc    Add AQI reading to history
// @access  Private
router.post('/aqi-history', auth, async (req, res) => {
  try {
    const { location, aqi } = req.body;
    
    if (!location || aqi === undefined) {
      return res.status(400).json({ message: 'Location and AQI are required' });
    }

    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.aqiHistory) {
      user.aqiHistory = [];
    }

    // Limit history to last 100 entries
    if (user.aqiHistory.length >= 100) {
      user.aqiHistory.shift();
    }

    user.aqiHistory.push({
      location,
      aqi,
      timestamp: new Date()
    });

    await user.save();

    res.json({
      success: true,
      message: 'AQI history updated',
      aqiHistory: user.aqiHistory
    });
  } catch (error) {
    console.error('Add AQI history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/user/aqi-history
// @desc    Get user's AQI history
// @access  Private
router.get('/aqi-history', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('aqiHistory');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      aqiHistory: user.aqiHistory || []
    });
  } catch (error) {
    console.error('Get AQI history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/user/alerts
// @desc    Get user's alerts
// @access  Private
router.get('/alerts', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('alerts');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      alerts: user.alerts || []
    });
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/user/alerts/:alertId/read
// @desc    Mark alert as read
// @access  Private
router.put('/alerts/:alertId/read', auth, async (req, res) => {
  try {
    const { alertId } = req.params;
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const alert = user.alerts?.id(alertId);
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    alert.isRead = true;
    await user.save();

    res.json({
      success: true,
      message: 'Alert marked as read'
    });
  } catch (error) {
    console.error('Mark alert as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

