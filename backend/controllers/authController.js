const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * @desc User Login with email & password
 * @route POST /api/v1/auth/login
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'ইমেইল ও পাসওয়ার্ড প্রদান করুন (Email and password required)',
      });
    }

    const [rows] = await db.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
    if (!rows.length) {
      return res.status(401).json({
        success: false,
        message: 'ভুল ইমেইল বা পাসওয়ার্ড (Invalid credentials)',
      });
    }

    const user = rows[0];

    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'আপনার অ্যাকাউন্টটি নিষ্ক্রিয় বা স্থগিত করা হয়েছে',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'ভুল ইমেইল বা পাসওয়ার্ড',
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      process.env.JWT_SECRET || 'fallback_secret_banglanews_key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      message: 'লগইন সফল হয়েছে',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        designation: user.designation,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Register a new user (Viewer or Reporter)
 * @route POST /api/v1/auth/register
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role = 'viewer', designation, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'নাম, ইমেইল এবং পাসওয়ার্ড আবশ্যক',
      });
    }

    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'এই ইমেইলটি ইতিমধ্যে ব্যবহৃত হচ্ছে',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const safeRole = ['admin', 'reporter', 'viewer'].includes(role) ? role : 'viewer';

    const [result] = await db.query(
      'INSERT INTO users (name, email, password, role, designation, phone) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, safeRole, designation || 'Subscriber', phone || null]
    );

    const token = jwt.sign(
      { id: result.insertId, email, name, role: safeRole },
      process.env.JWT_SECRET || 'fallback_secret_banglanews_key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'রেজিস্ট্রেশন সফল হয়েছে',
      token,
      user: {
        id: result.insertId,
        name,
        email,
        role: safeRole,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get current logged-in user profile
 * @route GET /api/v1/auth/me
 */
exports.getProfile = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      'SELECT id, name, email, role, avatar, designation, bio, phone, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'ব্যবহারকারী পাওয়া যায়নি' });
    }

    res.json({
      success: true,
      user: rows[0],
    });
  } catch (error) {
    next(error);
  }
};
