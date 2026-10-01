const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { verifyToken, isAdmin } = require('../middlewares/auth');

router.get('/post/:postId', commentController.getCommentsByPost);
router.post('/', commentController.createComment);
router.put('/:id/status', verifyToken, isAdmin, commentController.updateCommentStatus);

module.exports = router;
