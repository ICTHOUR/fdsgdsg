const jwt = require('jsonwebtoken');

/**
 * Authentication Middleware: Validates Bearer Token in Authorization header
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'অননুমোদিত অ্যাক্সেস! অনুগ্রহ করে লগইন করুন (Authorization token missing)',
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_banglanews_key');
    req.user = decoded; // { id, email, role, name }
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'টোকেন মেয়াদোত্তীর্ণ বা অকার্যকর (Invalid or expired token)',
      error: error.message,
    });
  }
};

/**
 * Role-Based Access Control (RBAC) Middleware
 * Accepts array of allowed roles (e.g. ['admin'], ['admin', 'reporter'])
 */
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'ব্যবহারকারীর তথ্য অনুপস্থিত (User not authenticated)',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `এই কাজের জন্য আপনার পর্যাপ্ত অনুমতি নেই। প্রয়োজনীয় রোল: [${allowedRoles.join(', ')}]`,
      });
    }

    next();
  };
};

module.exports = {
  verifyToken,
  requireRole,
  isAdmin: requireRole('admin'),
  isReporterOrAdmin: requireRole('admin', 'reporter'),
};
