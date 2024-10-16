const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');


router.post('/create', OrderController.createOrder);
router.get('/get-detail/:userId', OrderController.getDetailOrder);
router.get('/get-all', OrderController.getAllOrder);
router.put('/update-status/:id', OrderController.updateOrderStatus);




module.exports = router