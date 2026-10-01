const express = require('express');
const router = express.Router();
const adController = require('../controllers/adController');
const { verifyToken, isAdmin } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// Public ad retrieval & click tracking
router.get('/', adController.getAllAds);
router.get('/slot/:slotName', adController.getAdsBySlot);
router.post('/:id/click', adController.trackAdClick);

// Protected Admin ad management
router.post('/', verifyToken, isAdmin, upload.single('image'), adController.createAd);
router.put('/:id', verifyToken, isAdmin, upload.single('image'), adController.updateAd);
router.delete('/:id', verifyToken, isAdmin, adController.deleteAd);

module.exports = router;
