const express = require("express");
const axios = require("axios");
const CircuitBreaker = require("opossum");
require("dotenv").config();

const { pool, initializeDatabase } = require("./db");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4002;

const fetchMenuFromRestaurant = async (menuId) => {
  const baseUrl = process.env.RESTAURANT_SERVICE_URL || 'http://restaurant-service:4001';
  const response = await axios.get(`${baseUrl}/menus/${menuId}`);
  return response.data.data;
};

const breakerOptions = { timeout: 5000, errorThresholdPercentage: 50, resetTimeout: 15000 };
const menuBreaker = new CircuitBreaker(fetchMenuFromRestaurant, breakerOptions);

menuBreaker.fallback((menuId, err) => {
  console.error("Circuit Breaker aktif! Gagal ambil menu:", menuId, err.message);
  throw new Error("RESTAURANT_SERVICE_DOWN");
});

app.get("/", (req, res) => res.json({ service: "Order Service", status: "running" }));

app.post("/orders", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { user_id, items } = req.body;

    if (!user_id || !items || items.length === 0) {
      return res.status(400).json({ message: "user_id and items are required" });
    }

    let totalPrice = 0;
    const orderItems = [];
    let detectedRestaurantId = null;

    for (const item of items) {
      const menu = await menuBreaker.fire(item.menu_id);

      if (!detectedRestaurantId) {
        detectedRestaurantId = menu.restaurant_id;
      } else if (Number(menu.restaurant_id) !== Number(detectedRestaurantId)) {
        return res.status(400).json({ message: "Semua menu harus dari restoran yang sama" });
      }

      const price = Number(menu.price);
      const quantity = Number(item.quantity);
      const subtotal = price * quantity;

      totalPrice += subtotal;
      orderItems.push({
        menu_id: menu.id,
        menu_name: menu.name,
        quantity,
        price,
        subtotal
      });
    }

    await connection.beginTransaction();

    const [orderResult] = await connection.query(
      `INSERT INTO orders (user_id, restaurant_id, total_price, status) VALUES (?, ?, ?, 'pending')`,
      [user_id, detectedRestaurantId, totalPrice]
    );

    const orderId = orderResult.insertId;

    for (const item of orderItems) {
      await connection.query(
        `INSERT INTO order_items (order_id, menu_id, menu_name, quantity, price, subtotal) VALUES (?, ?, ?, ?, ?, ?)`,
        [orderId, item.menu_id, item.menu_name, item.quantity, item.price, item.subtotal]
      );
    }

    await connection.commit();

    res.status(201).json({
      message: "Order created successfully",
      order_id: orderId,
      total_price: totalPrice,
      status: "pending",
      items: orderItems
    });
  } catch (error) {
    await connection.rollback();
    if (error.message === "RESTAURANT_SERVICE_DOWN") {
      return res.status(503).json({ message: "Restaurant Service down. Circuit Breaker AKTIF." });
    }
    res.status(500).json({ message: "Failed to create order", error: error.message });
  } finally {
    connection.release();
  }
});

app.get("/orders", async (req, res) => {
  try {
    const [orders] = await pool.query("SELECT * FROM orders ORDER BY created_at DESC");
    res.json({ message: "Orders retrieved successfully", data: orders });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve orders", error: error.message });
  }
});

app.get("/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [orders] = await pool.query("SELECT * FROM orders WHERE id = ?", [id]);
    if (orders.length === 0) return res.status(404).json({ message: "Order not found" });
    const [items] = await pool.query("SELECT * FROM order_items WHERE order_id = ?", [id]);
    res.json({ message: "Order detail retrieved successfully", data: { order: orders[0], items } });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve order detail", error: error.message });
  }
});

app.patch("/orders/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const [result] = await pool.query("UPDATE orders SET status = ? WHERE id = ?", [status, id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order status updated successfully", order_id: id, status });
  } catch (error) {
    res.status(500).json({ message: "Failed to update order status", error: error.message });
  }
});

app.patch("/orders/:id/cancel", async (req, res) => {
  try {
    const { id } = req.params;
    const [orders] = await pool.query("SELECT status FROM orders WHERE id = ?", [id]);
    if (orders.length === 0) return res.status(404).json({ message: "Order not found" });
    if (orders[0].status === "delivered") return res.status(400).json({ message: "Delivered order cannot be cancelled" });
    await pool.query("UPDATE orders SET status = 'cancelled' WHERE id = ?", [id]);
    res.json({ message: "Order cancelled successfully", order_id: id, status: "cancelled" });
  } catch (error) {
    res.status(500).json({ message: "Failed to cancel order", error: error.message });
  }
});

app.get("/users/:userId/orders", async (req, res) => {
  try {
    const { userId } = req.params;
    const [orders] = await pool.query("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC", [userId]);
    res.json({ message: "Order history retrieved successfully", data: orders });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve order history", error: error.message });
  }
});

initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Order Service running on port ${PORT}`);
  });
});