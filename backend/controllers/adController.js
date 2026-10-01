const db = require('../config/db');

/**
 * @desc Get all ads with optional slot and status filtering
 * @route GET /api/v1/ads
 */
exports.getAllAds = async (req, res, next) => {
  try {
    const { slot, status } = req.query;
    let whereClauses = ['1=1'];
    let params = [];

    if (slot) {
      whereClauses.push('slot = ?');
      params.push(slot);
    }

    if (status) {
      whereClauses.push('status = ?');
      params.push(status);
    }

    const [rows] = await db.query(
      `SELECT * FROM ads WHERE ${whereClauses.join(' AND ')} ORDER BY id DESC`,
      params
    );

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get active ads for a specific placement slot (e.g. header_banner, sidebar_top)
 * @route GET /api/v1/ads/slot/:slotName
 */
exports.getAdsBySlot = async (req, res, next) => {
  try {
    const { slotName } = req.params;
    const [rows] = await db.query(
      `SELECT id, title, slot, type, image_url, redirect_url, ad_code 
       FROM ads 
       WHERE slot = ? AND status = 'active'
       ORDER BY RAND() 
       LIMIT 1`,
      [slotName]
    );

    if (rows.length > 0) {
      // Increment impression asynchronously
      db.query('UPDATE ads SET impressions = impressions + 1 WHERE id = ?', [rows[0].id]).catch(console.error);
    }

    res.json({
      success: true,
      data: rows.length > 0 ? rows[0] : null,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Track ad click
 * @route POST /api/v1/ads/:id/click
 */
exports.trackAdClick = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.query('UPDATE ads SET clicks = clicks + 1 WHERE id = ?', [id]);
    res.json({ success: true, message: 'Click tracked' });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Create new Advertisement unit (Image or Google AdSense)
 * @route POST /api/v1/ads
 * @access Admin only
 */
exports.createAd = async (req, res, next) => {
  try {
    const {
      title,
      slot,
      type = 'image',
      redirect_url,
      ad_code,
      start_date,
      end_date,
      status = 'active',
    } = req.body;

    if (!title || !slot) {
      return res.status(400).json({
        success: false,
        message: 'বিজ্ঞাপনের নাম ও স্লট আবশ্যক (Title and Slot are required)',
      });
    }

    const image_url = req.file ? `/uploads/${req.file.filename}` : req.body.image_url || null;

    const [result] = await db.query(
      `INSERT INTO ads (
        title, slot, type, image_url, redirect_url, ad_code, start_date, end_date, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        slot,
        type,
        image_url,
        redirect_url || null,
        ad_code || null,
        start_date || null,
        end_date || null,
        status,
      ]
    );

    res.status(201).json({
      success: true,
      message: 'বিজ্ঞাপন সফলভাবে তৈরি হয়েছে (Ad created successfully)',
      adId: result.insertId,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Update ad unit
 * @route PUT /api/v1/ads/:id
 * @access Admin only
 */
exports.updateAd = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, slot, type, redirect_url, ad_code, start_date, end_date, status } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : req.body.image_url;

    const [result] = await db.query(
      `UPDATE ads SET 
        title = COALESCE(?, title),
        slot = COALESCE(?, slot),
        type = COALESCE(?, type),
        image_url = COALESCE(?, image_url),
        redirect_url = COALESCE(?, redirect_url),
        ad_code = COALESCE(?, ad_code),
        start_date = COALESCE(?, start_date),
        end_date = COALESCE(?, end_date),
        status = COALESCE(?, status)
      WHERE id = ?`,
      [title, slot, type, image_url, redirect_url, ad_code, start_date, end_date, status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'বিজ্ঞাপন পাওয়া যায়নি' });
    }

    res.json({ success: true, message: 'বিজ্ঞাপন সফলভাবে আপডেট হয়েছে' });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Delete ad
 * @route DELETE /api/v1/ads/:id
 * @access Admin only
 */
exports.deleteAd = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM ads WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'বিজ্ঞাপন পাওয়া যায়নি' });
    }
    res.json({ success: true, message: 'বিজ্ঞাপন মুছে ফেলা হয়েছে' });
  } catch (error) {
    next(error);
  }
};
