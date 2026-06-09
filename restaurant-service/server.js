const express = require("express");
require("dotenv").config();

const { pool, initializeDatabase } = require("./db");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4001;

app.get("/", (req, res) => {
    res.json({
        service: "Restaurant Service",
        status: "running"
    });
});

app.post("/restaurants", async (req, res) => {
    try {
        const { name, category, address } = req.body;

        if (!name || !category || !address) {
            return res.status(400).json({
                message: "Name, category, and address are required"
            });
        }

        const [result] = await pool.query(
            `INSERT INTO restaurants (name, category, address)
       VALUES (?, ?, ?)`,
            [name, category, address]
        );

        res.status(201).json({
            message: "Restaurant created successfully",
            restaurant_id: result.insertId
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create restaurant",
            error: error.message
        });
    }
});

app.get("/restaurants", async (req, res) => {
    try {
        const { category } = req.query;

        let query = "SELECT * FROM restaurants WHERE is_active = TRUE";
        const params = [];

        if (category) {
            query += " AND category = ?";
            params.push(category);
        }

        const [restaurants] = await pool.query(query, params);

        res.json({
            message: "Restaurants retrieved successfully",
            data: restaurants
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve restaurants",
            error: error.message
        });
    }
});

app.put("/restaurants/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category, address, is_active } = req.body;

        const [result] = await pool.query(
            `UPDATE restaurants
       SET name = ?, category = ?, address = ?, is_active = ?
       WHERE id = ?`,
            [name, category, address, is_active, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Restaurant not found"
            });
        }

        res.json({
            message: "Restaurant updated successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update restaurant",
            error: error.message
        });
    }
});

app.delete("/restaurants/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query(
            "DELETE FROM restaurants WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Restaurant not found"
            });
        }

        res.json({
            message: "Restaurant deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete restaurant",
            error: error.message
        });
    }
});

app.post("/restaurants/:restaurantId/menus", async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const { name, description, price } = req.body;

        if (!name || !price) {
            return res.status(400).json({
                message: "Menu name and price are required"
            });
        }

        const [restaurant] = await pool.query(
            "SELECT id FROM restaurants WHERE id = ?",
            [restaurantId]
        );

        if (restaurant.length === 0) {
            return res.status(404).json({
                message: "Restaurant not found"
            });
        }

        const [result] = await pool.query(
            `INSERT INTO menus (restaurant_id, name, description, price)
       VALUES (?, ?, ?, ?)`,
            [restaurantId, name, description || null, price]
        );

        res.status(201).json({
            message: "Menu created successfully",
            menu_id: result.insertId
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create menu",
            error: error.message
        });
    }
});

app.get("/restaurants/:restaurantId/menus", async (req, res) => {
    try {
        const { restaurantId } = req.params;

        const [menus] = await pool.query(
            `SELECT * FROM menus
       WHERE restaurant_id = ? AND is_available = TRUE`,
            [restaurantId]
        );

        res.json({
            message: "Menus retrieved successfully",
            data: menus
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve menus",
            error: error.message
        });
    }
});

app.get("/menus/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [menus] = await pool.query(
            `SELECT 
        menus.id,
        menus.restaurant_id,
        menus.name,
        menus.description,
        menus.price,
        menus.is_available,
        restaurants.name AS restaurant_name
       FROM menus
       JOIN restaurants ON menus.restaurant_id = restaurants.id
       WHERE menus.id = ?`,
            [id]
        );

        if (menus.length === 0) {
            return res.status(404).json({
                message: "Menu not found"
            });
        }

        if (!menus[0].is_available) {
            return res.status(400).json({
                message: "Menu is not available"
            });
        }

        res.json({
            message: "Menu retrieved successfully",
            data: menus[0]
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve menu",
            error: error.message
        });
    }
});

app.put("/menus/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, is_available } = req.body;

        const [result] = await pool.query(
            `UPDATE menus
       SET name = ?, description = ?, price = ?, is_available = ?
       WHERE id = ?`,
            [name, description, price, is_available, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Menu not found"
            });
        }

        res.json({
            message: "Menu updated successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update menu",
            error: error.message
        });
    }
});

app.delete("/menus/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query(
            "DELETE FROM menus WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Menu not found"
            });
        }

        res.json({
            message: "Menu deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete menu",
            error: error.message
        });
    }
});

initializeDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Restaurant Service running on port ${PORT}`);
    });
});