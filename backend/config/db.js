const mysql = require('mysql2/promise');
require('dotenv').config();

/**
 * High-performance MySQL Connection Pool with mysql2/promise
 * Configured with connection limits, keep-alive, and UTF-8 Unicode charset for Bangla script
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'banglanews_db',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  waitForConnections: process.env.DB_WAIT_FOR_CONNECTIONS !== 'false',
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '20', 10),
  queueLimit: parseInt(process.env.DB_QUEUE_LIMIT || '0', 10),
  charset: 'utf8mb4',
  timezone: '+06:00', // Bangladesh Standard Time (BST)
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
  namedPlaceholders: true,
  dateStrings: true,
});

// Test initial connectivity on server boot
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ [MySQL Database] Connection pool established successfully (Host: ' + (process.env.DB_HOST || 'localhost') + ')');
    connection.release();
  } catch (error) {
    console.error('❌ [MySQL Database] Initial connection failure:', error.message);
    console.error('👉 Please verify DB credentials in .env or run database/schema.sql');
  }
})();

/**
 * Safe transaction helper wrapper
 * Automatically handles BEGIN, COMMIT, and ROLLBACK
 */
async function executeTransaction(callback) {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  try {
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

module.exports = {
  pool,
  query: (sql, params) => pool.query(sql, params),
  execute: (sql, params) => pool.execute(sql, params),
  executeTransaction,
};
