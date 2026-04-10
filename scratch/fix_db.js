require('dotenv').config({ path: 'backend/.env' });
const pool = require('../backend/src/config/db');

async function fixDatabase() {
  try {
    console.log('Connecting to database...');
    
    // Add is_admin column
    try {
      await pool.query('ALTER TABLE users ADD COLUMN is_admin TINYINT(1) DEFAULT 0');
      console.log('✅ Added is_admin column');
    } catch (err) {
      if (err.code !== 'ER_DUP_COLUMN_NAME' && err.code !== 'ER_DUP_FIELDNAME') throw err;
      console.log('ℹ️ is_admin column already exists');
    }

    // Add role column
    try {
      await pool.query("ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user'");
      console.log('✅ Added role column');
    } catch (err) {
      if (err.code !== 'ER_DUP_COLUMN_NAME' && err.code !== 'ER_DUP_FIELDNAME') throw err;
      console.log('ℹ️ role column already exists');
    }

    // Create wishlist table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS wishlist (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        property_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
        UNIQUE KEY user_property (user_id, property_id)
      )
    `);
    console.log('✅ Wishlist table ready');

    // Create saved_predictions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS saved_predictions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        location VARCHAR(100),
        bedrooms INT,
        bathrooms INT,
        square_feet INT,
        predicted_price DECIMAL(10,2),
        status VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Saved Predictions table ready');

    // Create contacts table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Contacts table ready');

    // Set 'admin' user as administrator
    const [result] = await pool.query("UPDATE users SET is_admin = 1, role = 'admin' WHERE username = 'admin'");
    console.log(`✅ Updated ${result.affectedRows} user(s) to administrator status`);
    
    console.log('🎉 Database fix completed!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to fix database:', err);
    process.exit(1);
  }
}

fixDatabase();
