const express = require('express');
const router = express.Router();
const portalController = require('../controllers/portalController');

// Banglanews24 Specialized Portal Endpoints
router.get('/breaking', portalController.getBreakingNews);
router.get('/lead', portalController.getLeadNews);
router.get('/most-read', portalController.getMostRead);
router.get('/videos', portalController.getVideoGallery);
router.get('/trending-tags', portalController.getTrendingTags);
router.get('/home', portalController.getHomeBundle);

module.exports = router;
