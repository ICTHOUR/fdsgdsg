/**
 * Centralized Global Error Handler Middleware
 */
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `অনুরোধকৃত রাউট পাওয়া যায়নি (Route ${req.originalUrl} not found)`,
  });
};

const errorHandler = (err, req, res, next) => {
  console.error('🔥 [Server Error]', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // Handle MySQL Duplicate Entry Errors (e.g. unique slug or email)
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      success: false,
      message: 'এই তথ্যটি ইতিমধ্যে ডাটাবেসে বিদ্যমান (Duplicate entry detected)',
      error: err.sqlMessage || err.message,
    });
  }

  // Handle MySQL Foreign Key constraint failures
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({
      success: false,
      message: 'নির্দিষ্ট ক্যাটাগরি বা ব্যবহারকারী আইডি পাওয়া যায়নি (Invalid foreign reference)',
      error: err.sqlMessage,
    });
  }

  // Multer File Upload Errors
  if (err.name === 'MulterError') {
    return res.status(400).json({
      success: false,
      message: `ফাইল আপলোড ত্রুটি: ${err.message}`,
    });
  }

  const statusCode = err.statusCode || res.statusCode >= 400 ? res.statusCode : 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'অভ্যন্তরীণ সার্ভার ত্রুটি (Internal Server Error)',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
