const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Delivery = sequelize.define('Delivery', {
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    driver_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'PREPARING'
    },
    estimated_time: {
        type: DataTypes.INTEGER,
        defaultValue: 30
    },
    current_location: {
        type: DataTypes.STRING,
        defaultValue: 'Restaurant'
    }
});

module.exports = Delivery;