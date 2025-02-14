const express = require('express');
const router = express.Router();
const { saveOrder, getOrder } = require('../controllers/ordersController');

router.post('/orders', saveOrder);
router.get('/orders/:sessionId', getOrder);

module.exports = router;
