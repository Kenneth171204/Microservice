const Delivery = require('../models/Delivery');
const redisClient = require('../config/redis');

exports.assignDriver = async (req, res) => {
    try {
        const { order_id, driver_name } = req.body;

        if (!order_id || !driver_name) {
            return res.status(400).json({
                message: 'order_id and driver_name are required'
            });
        }

        const delivery = await Delivery.create({
            order_id,
            driver_name,
            status: 'ON_DELIVERY'
        });

        res.status(201).json({
            message: 'Driver assigned',
            data: delivery
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

exports.updateDeliveryStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, current_location } = req.body;

        const delivery = await Delivery.findByPk(id);

        if (!delivery) {
            return res.status(404).json({ message: 'Delivery not found' });
        }

        delivery.status = status;
        delivery.current_location = current_location;
        await delivery.save();

        try {
            const cacheKey = `delivery:${id}`;
            await redisClient.setEx(cacheKey, 3600, JSON.stringify(delivery));
        } catch (redisErr) {
            console.error("Bypass Redis karena error:", redisErr.message);
        }

        res.json({
            message: 'Delivery updated',
            data: delivery
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getDelivery = async (req, res) => {
    try {
        const deliveryId = req.params.id;
        const cacheKey = `delivery:${deliveryId}`;

        try {
            const cachedDelivery = await redisClient.get(cacheKey);
            if (cachedDelivery) {
                return res.json({
                    source: 'Redis Cache',
                    data: JSON.parse(cachedDelivery)
                });
            }
        } catch (redisErr) {
            console.error("Bypass Redis karena error:", redisErr.message);
        }

        const delivery = await Delivery.findByPk(deliveryId);

        if (!delivery) {
            return res.status(404).json({ message: 'Delivery not found' });
        }

        try {
            await redisClient.setEx(cacheKey, 3600, JSON.stringify(delivery));
        } catch (redisErr) {
            console.error("Bypass Redis karena error:", redisErr.message);
        }

        res.json({
            source: 'MySQL Database',
            data: delivery
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};