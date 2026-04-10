const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 5,       // Keep low on free tier to avoid exhausting Aiven limits
    queueLimit: 0,
    connectTimeout: 20000,    // 20 second connection timeout
    ssl: {
        rejectUnauthorized: false // Required for Aiven MySQL in production
    }
});

// Prevent unhandled pool errors from crashing Node process
pool.on = pool.on || (() => {}); // mysql2 pool doesn't emit events directly, guard here

const testConnection = async () => {
    try {
        await pool.query('SELECT 1');
        console.log('✅ MySQL Connected Successfully');
    } catch (error) {
        console.error('❌ MySQL Connection Failed:', error.message);
        // Don't crash the server — let it retry on next request
    }
};

testConnection();
module.exports = pool;
