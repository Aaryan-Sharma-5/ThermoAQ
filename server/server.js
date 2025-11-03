const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const cron = require('node-cron');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Allowed origins for CORS
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'https://thermo-aq.vercel.app'
].filter(Boolean).map(url => url.replace(/\/$/, '')); // Remove trailing slashes

const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// CORS configuration - MUST be before rate limiting and routes
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or server-to-server)
    if (!origin) return callback(null, true);
    
    // Remove trailing slash from the incoming origin
    const normalizedOrigin = origin.replace(/\/$/, '');
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('CORS Check - Origin:', origin);
      console.log('CORS Check - Normalized:', normalizedOrigin);
      console.log('CORS Check - Allowed:', allowedOrigins);
    }
    
    if (allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
    } else {
      console.error('CORS REJECTED:', normalizedOrigin);
      callback(null, true); // Allow anyway but log the rejection
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400, // 24 hours
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Enable CORS for all routes
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting - AFTER CORS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100 
});
app.use('/api/', limiter);

// Database connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  if (process.env.NODE_ENV === 'development') {
    console.log('✓ Connected to MongoDB');
  }
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const proxyRoutes = require('./routes/proxy');
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/proxy', proxyRoutes);

// Alert Service
const alertService = require('./services/alertService');

// Schedule alert checks - runs every 2 hours
cron.schedule('0 */2 * * *', async () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('⏰ Running scheduled AQI alert check...');
  }
  await alertService.checkAllUsers();
});

// Optional: Run alert check on server startup (after 1 minute delay)
setTimeout(async () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('🚀 Running initial AQI alert check...');
  }
  await alertService.checkAllUsers();
}, 60000);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`✓ ThermoAQ Server running on port ${PORT}`);
  }
});

module.exports = app;