const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function initializeDatabase() {
  let retries = 5;
  while (retries) {
    try {
      const connection = await pool.getConnection();
      
      await connection.query(`
        CREATE TABLE IF NOT EXISTS orders (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          restaurant_id INT NOT NULL,
          total_price DECIMAL(10, 2) NOT NULL,
          status ENUM('pending', 'cooking', 'delivered', 'cancelled') DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await connection.query(`
        CREATE TABLE IF NOT EXISTS order_items (
          id INT AUTO_INCREMENT PRIMARY KEY,
          order_id INT NOT NULL,
          menu_id INT NOT NULL,
          menu_name VARCHAR(255) NOT NULL,
          quantity INT NOT NULL,
          price DECIMAL(10, 2) NOT NULL,
          subtotal DECIMAL(10, 2) NOT NULL,
          FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
        )
      `);

      console.log("Order database initialized successfully");
      connection.release();
      break; // Keluar dari loop jika sukses
    } catch (error) {
      console.error(`Failed to connect to order DB. Retrying in 5 seconds... (${retries} retries left)`);
      retries -= 1;
      await new Promise(res => setTimeout(res, 5000)); // Tunggu 5 detik
      if (retries === 0) {
        console.error("Could not connect to database:", error.message);
      }
    }
  }
}

module.exports = {
  pool,
  initializeDatabase
};