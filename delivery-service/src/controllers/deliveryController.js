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

        // ADD THESE TWO LINES: Update the Redis cache with the fresh data
        const cacheKey = `delivery:${id}`;
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(delivery));

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

        // 1. Check Redis cache first
        const cachedDelivery = await redisClient.get(cacheKey);

        if (cachedDelivery) {
            // Cache Hit!
            return res.json({
                source: 'Redis Cache',
                data: JSON.parse(cachedDelivery)
            });
        }

        // 2. Cache Miss: Fetch from MySQL
        const delivery = await Delivery.findByPk(deliveryId);

        if (!delivery) {
            return res.status(404).json({ message: 'Delivery not found' });
        }

        // 3. Save to Redis for future requests (Expires in 1 hour / 3600 seconds)
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(delivery));

        res.json({
            source: 'MySQL Database',
            data: delivery
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};