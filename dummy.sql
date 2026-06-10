USE restaurant_db;

CREATE TABLE IF NOT EXISTS restaurants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS menus (
  id INT AUTO_INCREMENT PRIMARY KEY,
  restaurant_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  restaurant_id INT NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'cooking', 'delivered', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  menu_id INT NOT NULL,
  menu_name VARCHAR(255) NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS Deliveries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  driver_name VARCHAR(255),
  status VARCHAR(50) DEFAULT 'PENDING',
  current_location VARCHAR(255),
  createdAt DATETIME,
  updatedAt DATETIME
);

INSERT IGNORE INTO restaurants (id, name, category, address) VALUES
(1, 'Warung Nusantara', 'Indonesian', 'Jl. Raya Darmo No. 10, Surabaya'),
(2, 'Burger Bro', 'Western', 'Jl. Diponegoro No. 22, Surabaya'),
(3, 'Sushi Sora', 'Japanese', 'Jl. Mayjend Sungkono No. 88, Surabaya');

INSERT IGNORE INTO menus (id, restaurant_id, name, description, price) VALUES
(1, 1, 'Nasi Goreng Spesial', 'Nasi goreng dengan telur, ayam, dan kerupuk', 25000),
(2, 1, 'Ayam Geprek Sambal Bawang', 'Ayam crispy dengan sambal bawang pedas', 28000),
(3, 2, 'Classic Beef Burger', 'Burger sapi dengan keju, selada, dan saus spesial', 45000),
(4, 2, 'French Fries', 'Kentang goreng crispy', 18000),
(5, 3, 'Salmon Sushi Set', 'Sushi salmon 8 pcs', 65000);

INSERT IGNORE INTO orders (id, user_id, restaurant_id, total_price, status) VALUES
(1, 1, 1, 78000, 'pending'),
(2, 1, 2, 81000, 'pending');

INSERT IGNORE INTO order_items (id, order_id, menu_id, menu_name, quantity, price, subtotal) VALUES
(1, 1, 1, 'Nasi Goreng Spesial', 2, 25000, 50000),
(2, 1, 2, 'Ayam Geprek Sambal Bawang', 1, 28000, 28000),
(3, 2, 3, 'Classic Beef Burger', 1, 45000, 45000),
(4, 2, 4, 'French Fries', 2, 18000, 36000);

INSERT IGNORE INTO Deliveries (id, order_id, driver_name, status, current_location, createdAt, updatedAt) VALUES
(1, 1, 'Budi Santoso', 'ON_DELIVERY', 'Jl. Basuki Rahmat', NOW(), NOW()),
(2, 2, 'Andi Wijaya', 'PENDING', NULL, NOW(), NOW());