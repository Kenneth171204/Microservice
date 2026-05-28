require('dotenv').config();

const express = require('express');
const cors = require('cors');

const sequelize = require('./config/database');
const deliveryRoutes = require('./routes/deliveryRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/delivery', deliveryRoutes);

app.get('/', (req, res) => {
    res.send('Delivery Service Running');
});

app.get('/health', (req, res) => {
    res.status(200).json({
        service: 'delivery-service',
        status: 'UP'
    });
});

const PORT = process.env.PORT || 5002;

async function startServer() {

    while (true) {

        try {

            await sequelize.sync();

            console.log('Database connected');

            break;

        } catch (err) {

            console.error('Database connection failed:', err.message);

            console.log('Retrying in 5 seconds...');

            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }

    app.listen(PORT, '0.0.0.0', () => {

        console.log(`Delivery Service running on port ${PORT}`);

    });
}

startServer();