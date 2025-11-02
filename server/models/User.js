const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  location: {
    city: {
      type: String,
      default: 'Mumbai'
    },
    state: {
      type: String,
      default: 'Maharashtra'
    },
    latitude: {
      type: Number,
      default: null
    },
    longitude: {
      type: Number,
      default: null
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  preferences: {
    autoDetectLocation: {
      type: Boolean,
      default: true
    },
    defaultLocation: {
      type: String,
      default: 'Mumbai, Maharashtra'
    },
    aqiAlertThreshold: {
      type: Number,
      default: 150 // Alert when AQI exceeds this value
    },
    enableAlerts: {
      type: Boolean,
      default: true
    },
    healthConditions: {
      type: [String], // asthma, respiratory, heart, etc.
      default: []
    }
  },
  monitoredLocations: [{
    name: String,
    addedAt: { type: Date, default: Date.now },
    alertEnabled: { type: Boolean, default: true }
  }],
  aqiHistory: [{
    location: String,
    aqi: Number,
    timestamp: { type: Date, default: Date.now }
  }],
  alerts: [{
    location: String,
    aqi: Number,
    message: String,
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }],
  healthReports: [{
    assessmentData: {
      age: Number,
      gender: String,
      symptoms: Object,
      preExistingConditions: Object,
      activityLevel: String,
      timeOutdoors: String,
      additionalConcerns: String
    },
    environmentalData: {
      aqi: Number,
      aqiLevel: String,
      temperature: Number,
      humidity: Number,
      uvIndex: Number,
      pollutants: Object
    },
    location: String,
    aiReport: String,
    generatedAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const hashedPassword = await bcrypt.hash(this.password, 12);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);