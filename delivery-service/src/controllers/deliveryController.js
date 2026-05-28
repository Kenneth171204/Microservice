const Delivery = require('../models/Delivery');

exports.assignDriver = async (req, res) => {
    try {
        const { order_id, driver_name } = req.body;

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
            return res.status(404).json({
                message: 'Delivery not found'
            });
        }

        delivery.status = status;
        delivery.current_location = current_location;

        await delivery.save();

        res.json({
            message: 'Delivery updated',
            data: delivery
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

exports.getDelivery = async (req, res) => {
    try {
        const delivery = await Delivery.findByPk(req.params.id);

        res.json(delivery);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};