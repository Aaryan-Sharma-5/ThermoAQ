const express = require('express');
const axios = require('axios');
const router = express.Router();

// Proxy for WeatherAPI to hide API key and avoid CORS
router.get('/weather/current', async (req, res) => {
  try {
    const { city } = req.query;
    
    if (!city) {
      return res.status(400).json({ error: 'City parameter is required' });
    }

    const WEATHER_API_KEY = process.env.WEATHERAPI_KEY;
    const response = await axios.get(
      `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${city}&aqi=yes`
    );

    res.json(response.data);
  } catch (error) {
    console.error('Weather API proxy error:', error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to fetch weather data',
      message: error.response?.data?.error?.message || error.message
    });
  }
});

// Proxy for WAQI (World Air Quality Index)
router.get('/aqi/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const WAQI_API_KEY = process.env.WAQI_API_KEY;
    
    const response = await axios.get(
      `https://api.waqi.info/feed/${city}/?token=${WAQI_API_KEY}`
    );

    res.json(response.data);
  } catch (error) {
    console.error('WAQI API proxy error:', error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to fetch AQI data',
      message: error.message
    });
  }
});

module.exports = router;
