const db = require('../config/db');

/**
 * @desc Get all site settings
 * @route GET /api/v1/settings
 */
exports.getSettings = async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT key_name, key_value, group_name FROM settings');
    const settingsObject = {};
    rows.forEach((item) => {
      settingsObject[item.key_name] = item.key_value;
    });

    res.json({
      success: true,
      data: settingsObject,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Update site settings
 * @route PUT /api/v1/settings
 * @access Admin only
 */
exports.updateSettings = async (req, res, next) => {
  try {
    const updates = req.body; // { key_name: value }
    await db.executeTransaction(async (conn) => {
      for (const [key, value] of Object.entries(updates)) {
        await conn.query(
          'INSERT INTO settings (key_name, key_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE key_value = ?',
          [key, value, value]
        );
      }
    });

    res.json({
      success: true,
      message: 'সাইট সেটিংস সংরক্ষিত হয়েছে',
    });
  } catch (error) {
    next(error);
  }
};
