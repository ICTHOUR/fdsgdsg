const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { verifyToken, isAdmin } = require('../middlewares/auth');

router.get('/', categoryController.getAllCategories);
router.get('/:slug', categoryController.getCategoryBySlug);
router.post('/', verifyToken, isAdmin, categoryController.createCategory);
router.put('/:id', verifyToken, isAdmin, categoryController.updateCategory);
router.delete('/:id', verifyToken, isAdmin, categoryController.deleteCategory);

router.post('/subcategories', verifyToken, isAdmin, categoryController.createSubcategory);
router.put('/subcategories/:id', verifyToken, isAdmin, categoryController.updateSubcategory);
router.delete('/subcategories/:id', verifyToken, isAdmin, categoryController.deleteSubcategory);

module.exports = router;
