const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { sequelize, testConnection } = require('./config/database');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

app.get('/', (req, res) => {
  res.json({
    message: '🚀 Welcome to Node.js Backend with PostgreSQL!',
    status: 'Server is running successfully',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: 'GET /api/health',
      users: {
        getAll: 'GET /api/users',
        getById: 'GET /api/users/:id',
        create: 'POST /api/users',
        update: 'PUT /api/users/:id',
        delete: 'DELETE /api/users/:id'
      }
    }
  });
});

// API routes
app.use('/api', routes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    requestedUrl: req.originalUrl
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    
    // Sync database models (force: true will drop and recreate tables)
    await sequelize.sync({ force: true });
    
    // Start the server
    app.listen(PORT, () => {
      console.log('Server is run');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 