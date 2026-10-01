const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
===================================================================
🚀 BANGLANEWS24 BACKEND SERVER RUNNING
📡 Port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
🕒 Server Time: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' })} BST
📖 API Endpoints Root: http://localhost:${PORT}/api/v1
===================================================================
  `);
});

// Graceful Shutdown Handler
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received. Shutting down HTTP server gracefully...');
  server.close(() => {
    console.log('💤 Process terminated cleanly.');
  });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('⚠️ Unhandled Promise Rejection at:', promise, 'reason:', reason);
});
