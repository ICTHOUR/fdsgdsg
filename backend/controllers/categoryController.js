const db = require('../config/db');

/**
 * @desc Get all categories with their subcategories and post counts
 * @route GET /api/v1/categories
 */
exports.getAllCategories = async (req, res, next) => {
  try {
    const [categories] = await db.query(
      `SELECT c.*, COUNT(p.id) AS total_posts
       FROM categories c
       LEFT JOIN posts p ON c.id = p.category_id AND p.status = 'published'
       GROUP BY c.id
       ORDER BY c.order_index ASC, c.id ASC`
    );

    const [subcategories] = await db.query(
      `SELECT * FROM subcategories WHERE status = 'active' ORDER BY order_index ASC`
    );

    // Group subcategories under parent category
    const categoryMap = categories.map((cat) => ({
      ...cat,
      subcategories: subcategories.filter((sub) => sub.category_id === cat.id),
    }));

    res.json({
      success: true,
      data: categoryMap,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get single category by slug with its subcategories
 * @route GET /api/v1/categories/:slug
 */
exports.getCategoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const [rows] = await db.query('SELECT * FROM categories WHERE slug = ? LIMIT 1', [slug]);

    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'ক্যাটাগরি পাওয়া যায়নি' });
    }

    const category = rows[0];
    const [subcategories] = await db.query(
      'SELECT * FROM subcategories WHERE category_id = ? ORDER BY order_index ASC',
      [category.id]
    );

    category.subcategories = subcategories;

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Create new category
 * @route POST /api/v1/categories
 * @access Admin only
 */
exports.createCategory = async (req, res, next) => {
  try {
    const { name_bn, name_en, slug, description, color_code, order_index = 0, is_in_menu = 1 } = req.body;

    if (!name_bn || !name_en || !slug) {
      return res.status(400).json({
        success: false,
        message: 'বাংলা নাম, ইংরেজি নাম ও স্ল্যাগ আবশ্যক',
      });
    }

    const [result] = await db.query(
      `INSERT INTO categories (name_bn, name_en, slug, description, color_code, order_index, is_in_menu) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name_bn, name_en, slug, description || null, color_code || '#DC2626', order_index, is_in_menu]
    );

    res.status(201).json({
      success: true,
      message: 'ক্যাটাগরি তৈরি সফল হয়েছে',
      categoryId: result.insertId,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Create subcategory
 * @route POST /api/v1/categories/subcategories
 * @access Admin only
 */
exports.createSubcategory = async (req, res, next) => {
  try {
    const { category_id, name_bn, name_en, slug, order_index = 0 } = req.body;

    if (!category_id || !name_bn || !name_en || !slug) {
      return res.status(400).json({ success: false, message: 'সকল আবশ্যক ঘর পূরণ করুন' });
    }

    const [result] = await db.query(
      'INSERT INTO subcategories (category_id, name_bn, name_en, slug, order_index) VALUES (?, ?, ?, ?, ?)',
      [category_id, name_bn, name_en, slug, order_index]
    );

    res.status(201).json({
      success: true,
      message: 'সাবক্যাটাগরি তৈরি হয়েছে',
      subcategoryId: result.insertId,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Update category
 * @route PUT /api/v1/categories/:id
 * @access Admin only
 */
exports.updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name_bn, name_en, slug, description, color_code, order_index, is_in_menu } = req.body;

    const [result] = await db.query(
      `UPDATE categories SET 
        name_bn = COALESCE(?, name_bn),
        name_en = COALESCE(?, name_en),
        slug = COALESCE(?, slug),
        description = COALESCE(?, description),
        color_code = COALESCE(?, color_code),
        order_index = COALESCE(?, order_index),
        is_in_menu = COALESCE(?, is_in_menu)
      WHERE id = ?`,
      [name_bn, name_en, slug, description, color_code, order_index, is_in_menu, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'ক্যাটাগরি পাওয়া যায়নি' });
    }

    res.json({ success: true, message: 'ক্যাটাগরি আপডেট সফল হয়েছে' });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Delete category
 * @route DELETE /api/v1/categories/:id
 * @access Admin only
 */
exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM categories WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'ক্যাটাগরি পাওয়া যায়নি' });
    }
    res.json({ success: true, message: 'ক্যাটাগরি মুছে ফেলা হয়েছে' });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Update subcategory
 * @route PUT /api/v1/categories/subcategories/:id
 * @access Admin only
 */
exports.updateSubcategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { category_id, name_bn, name_en, slug, order_index, status } = req.body;

    const [result] = await db.query(
      `UPDATE subcategories SET 
        category_id = COALESCE(?, category_id),
        name_bn = COALESCE(?, name_bn),
        name_en = COALESCE(?, name_en),
        slug = COALESCE(?, slug),
        order_index = COALESCE(?, order_index),
        status = COALESCE(?, status)
      WHERE id = ?`,
      [category_id, name_bn, name_en, slug, order_index, status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'সাবক্যাটাগরি পাওয়া যায়নি' });
    }

    res.json({ success: true, message: 'সাবক্যাটাগরি আপডেট সফল হয়েছে' });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Delete subcategory
 * @route DELETE /api/v1/categories/subcategories/:id
 * @access Admin only
 */
exports.deleteSubcategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM subcategories WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'সাবক্যাটাগরি পাওয়া যায়নি' });
    }
    res.json({ success: true, message: 'সাবক্যাটাগরি মুছে ফেলা হয়েছে' });
  } catch (error) {
    next(error);
  }
};

