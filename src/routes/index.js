const express = require('express');
const userRoutes = require('./userRoutes');

const router = express.Router();

// Health check route
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Backend server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// User routes
router.use('/users', userRoutes);

module.exports = router; 