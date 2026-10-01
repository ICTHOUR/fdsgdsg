const db = require('../config/db');

/**
 * @desc Get approved comments for a specific post
 * @route GET /api/v1/comments/post/:postId
 */
exports.getCommentsByPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const [rows] = await db.query(
      `SELECT c.id, c.author_name, c.comment, c.created_at, u.avatar 
       FROM comments c
       LEFT JOIN users u ON c.user_id = u.id
       WHERE c.post_id = ? AND c.status = 'approved'
       ORDER BY c.created_at DESC`,
      [postId]
    );

    res.json({
      success: true,
      count: rows.length,
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Submit a new comment on a post
 * @route POST /api/v1/comments
 */
exports.createComment = async (req, res, next) => {
  try {
    const { post_id, author_name, author_email, comment } = req.body;
    const user_id = req.user ? req.user.id : null;

    if (!post_id || !author_name || !comment) {
      return res.status(400).json({
        success: false,
        message: 'নাম, মন্তব্য ও পোস্ট আইডি আবশ্যক',
      });
    }

    const [result] = await db.query(
      'INSERT INTO comments (post_id, user_id, author_name, author_email, comment, status) VALUES (?, ?, ?, ?, ?, ?)',
      [post_id, user_id, author_name, author_email || 'anonymous@reader.com', comment, 'approved']
    );

    res.status(201).json({
      success: true,
      message: 'আপনার মন্তব্যটি সফলভাবে গৃহীত হয়েছে',
      commentId: result.insertId,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Moderate comment (approve / reject / spam)
 * @route PUT /api/v1/comments/:id/status
 * @access Admin only
 */
exports.updateCommentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'pending', 'spam', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'অবৈধ স্ট্যাটাস' });
    }

    await db.query('UPDATE comments SET status = ? WHERE id = ?', [status, id]);
    res.json({ success: true, message: 'মন্তব্যের স্ট্যাটাস পরিবর্তন করা হয়েছে' });
  } catch (error) {
    next(error);
  }
};
