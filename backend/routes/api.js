const express = require('express');
const router = express.Router();

const postRoutes = require('./postRoutes');
const portalRoutes = require('./portalRoutes');
const categoryRoutes = require('./categoryRoutes');
const adRoutes = require('./adRoutes');
const commentRoutes = require('./commentRoutes');
const authRoutes = require('./authRoutes');
const settingsRoutes = require('./settingsRoutes');

// API Health Check & Status
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Banglanews24 Portal Backend API Engine',
    version: '1.0.0',
    uptime: process.uptime(),
  });
});

// Mount Sub-routes
router.use('/posts', postRoutes);
router.use('/portal', portalRoutes);
router.use('/categories', categoryRoutes);
router.use('/ads', adRoutes);
router.use('/comments', commentRoutes);
router.use('/auth', authRoutes);
router.use('/settings', settingsRoutes);

module.exports = router;
