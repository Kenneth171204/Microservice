const express = require("express");
const axios = require("axios");
require("dotenv").config();

const { pool, initializeDatabase } = require("./db");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4002;

app.get("/", (req, res) => {
  res.json({
    service: "Order Service",
    status: "running"
  });
});

app.post("/orders", async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { user_id, restaurant_id, items } = req.body;

    if (!user_id || !restaurant_id || !items || items.length === 0) {
      return res.status(400).json({
        message: "user_id, restaurant_id, and items are required"
      });
    }

    for (const item of items) {
      if (!item.menu_id || !item.quantity || item.quantity <= 0) {
        return res.status(400).json({
          message: "Each item must have menu_id and valid quantity"
        });
      }
    }

    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const menuResponse = await axios.get(
        `${process.env.RESTAURANT_SERVICE_URL}/menus/${item.menu_id}`
      );

      const menu = menuResponse.data.data;

      if (Number(menu.restaurant_id) !== Number(restaurant_id)) {
        return res.status(400).json({
          message: `Menu with id ${item.menu_id} does not belong to restaurant ${restaurant_id}`
        });
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
      `INSERT INTO orders (user_id, restaurant_id, total_price, status)
       VALUES (?, ?, ?, 'pending')`,
      [user_id, restaurant_id, totalPrice]
    );

    const orderId = orderResult.insertId;

    for (const item of orderItems) {
      await connection.query(
        `INSERT INTO order_items 
         (order_id, menu_id, menu_name, quantity, price, subtotal)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          item.menu_id,
          item.menu_name,
          item.quantity,
          item.price,
          item.subtotal
        ]
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

    if (error.response) {
      return res.status(error.response.status).json({
        message: "Failed to validate menu from Restaurant Service",
        detail: error.response.data
      });
    }

    res.status(500).json({
      message: "Failed to create order",
      error: error.message
    });
  } finally {
    connection.release();
  }
});

app.get("/orders", async (req, res) => {
  try {
    const [orders] = await pool.query(
      "SELECT * FROM orders ORDER BY created_at DESC"
    );

    res.json({
      message: "Orders retrieved successfully",
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve orders",
      error: error.message
    });
  }
});

app.get("/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [orders] = await pool.query(
      "SELECT * FROM orders WHERE id = ?",
      [id]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    const [items] = await pool.query(
      "SELECT * FROM order_items WHERE order_id = ?",
      [id]
    );

    res.json({
      message: "Order detail retrieved successfully",
      data: {
        order: orders[0],
        items
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve order detail",
      error: error.message
    });
  }
});

app.patch("/orders/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = ["pending", "cooking", "delivered", "cancelled"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status"
      });
    }

    const [result] = await pool.query(
      "UPDATE orders SET status = ? WHERE id = ?",
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    res.json({
      message: "Order status updated successfully",
      order_id: id,
      status
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update order status",
      error: error.message
    });
  }
});

app.patch("/orders/:id/cancel", async (req, res) => {
  try {
    const { id } = req.params;

    const [orders] = await pool.query(
      "SELECT status FROM orders WHERE id = ?",
      [id]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    if (orders[0].status === "delivered") {
      return res.status(400).json({
        message: "Delivered order cannot be cancelled"
      });
    }

    await pool.query(
      "UPDATE orders SET status = 'cancelled' WHERE id = ?",
      [id]
    );

    res.json({
      message: "Order cancelled successfully",
      order_id: id,
      status: "cancelled"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to cancel order",
      error: error.message
    });
  }
});

app.get("/users/:userId/orders", async (req, res) => {
  try {
    const { userId } = req.params;

    const [orders] = await pool.query(
      `SELECT * FROM orders
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json({
      message: "Order history retrieved successfully",
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve order history",
      error: error.message
    });
  }
});

initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Order Service running on port ${PORT}`);
  });
});