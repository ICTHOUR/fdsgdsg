const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const apiRouter = require('./routes/api');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');

const app = express();

// Security HTTP Headers
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// Enable Cross-Origin Resource Sharing for frontend client
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Request Logger (Morgan)
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// Body Parsing Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve Uploaded Media (Images, Banner Ads)
const uploadsDirectory = process.env.UPLOAD_DIR || path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsDirectory));

// Root Welcome Endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'বাংলানিউজ২৪ রেপ্লিকা ব্যাকএন্ড এপিআই সার্ভারে স্বাগতম (Banglanews24 API Engine)',
    docs: '/api/v1/health',
    version: '1.0.0',
    endpoints: {
      breaking: '/api/v1/portal/breaking',
      lead: '/api/v1/portal/lead',
      most_read: '/api/v1/portal/most-read',
      videos: '/api/v1/portal/videos',
      posts: '/api/v1/posts',
      categories: '/api/v1/categories',
      ads: '/api/v1/ads',
    },
  });
});

// Mount Versioned API Routes
app.use('/api/v1', apiRouter);

// 404 and Global Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
