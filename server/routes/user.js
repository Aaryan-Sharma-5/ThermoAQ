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

module.exports = router;
