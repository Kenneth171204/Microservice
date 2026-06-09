const express = require('express');
const router = express.Router();

const deliveryController = require('../controllers/deliveryController');

router.post('/', deliveryController.assignDriver);
router.put('/:id', deliveryController.updateDeliveryStatus);
router.get('/:id', deliveryController.getDelivery);

module.exports = router;