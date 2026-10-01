const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { verifyToken, isReporterOrAdmin, isAdmin } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// Public News Fetching
router.get('/', postController.getAllPosts);
router.get('/:slugOrId', postController.getPostBySlugOrId);

// Protected Management Endpoints
router.post(
  '/',
  verifyToken,
  isReporterOrAdmin,
  upload.single('image'),
  postController.createPost
);

router.put(
  '/:id',
  verifyToken,
  isReporterOrAdmin,
  upload.single('image'),
  postController.updatePost
);

router.delete('/:id', verifyToken, isAdmin, postController.deletePost);

module.exports = router;
