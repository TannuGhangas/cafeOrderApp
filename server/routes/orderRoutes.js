// /server/routes/orderRoutes.js

const express = require('express');
const router = express.Router();
const { 
    placeNewOrder, 
    getUserOrders, 
    getOrdersBySlot 
} = require('../controllers/orderController');

// POST /api/orders/new - Place new order
router.post('/new', placeNewOrder);

// GET /api/orders/user - Get all orders for the fixed user
router.get('/user', getUserOrders);

// GET /api/orders/slot/:time - Get all orders for the specific time slot (Chef view)
router.get('/slot/:time', getOrdersBySlot);

module.exports = router;