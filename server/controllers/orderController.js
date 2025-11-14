// /server/controllers/orderController.js

const Order = require('../models/Order');

// Fixed User ID for simplified app
const FIXED_USER_ID = 'user_123'; 

// @desc    Place a new order
// @route   POST /api/orders/new
// @access  Public
const placeNewOrder = async (req, res) => {
    try {
        const { item, quantity, sugarLevel, slot } = req.body;

        // 1. Basic Validation
        if (!item || !quantity || !sugarLevel || !slot) {
            return res.status(400).json({ message: 'Please provide all required order details.' });
        }

        // 2. Create the new order
        const newOrder = await Order.create({
            userId: FIXED_USER_ID, // Assign fixed user ID
            item,
            quantity,
            sugarLevel,
            slot,
            status: 'New', // Default status upon creation
        });

        // 3. (Optional) Trigger FCM notification to the chef in a real app
        // fcmService.sendNewOrderAlert(newOrder); 
        
        res.status(201).json({ 
            message: 'Order successfully placed!', 
            order: newOrder 
        });

    } catch (error) {
        console.error('Error placing order:', error.message);
        res.status(500).json({ message: 'Server Error placing the order.' });
    }
};

// @desc    Get all orders for the current user
// @route   GET /api/orders/user
// @access  Public
const getUserOrders = async (req, res) => {
    try {
        // Fetch all orders associated with the fixed user ID, sorted newest first
        const orders = await Order.find({ userId: FIXED_USER_ID })
            .sort({ placedAt: -1 }); // -1 for descending order (newest first)

        res.json(orders);

    } catch (error) {
        console.error('Error fetching user orders:', error.message);
        res.status(500).json({ message: 'Server Error fetching user orders.' });
    }
};

// @desc    Get morning/evening list (for chef admin view)
// @route   GET /api/orders/slot/:time
// @access  Public (should be private/admin protected in production)
const getOrdersBySlot = async (req, res) => {
    const { time } = req.params; // 'Morning' or 'Evening'

    if (time !== 'Morning' && time !== 'Evening') {
        return res.status(400).json({ message: 'Invalid slot time specified. Use Morning or Evening.' });
    }

    try {
        // Fetch orders for the specified slot, sorted by placement time (oldest first for preparation)
        const orders = await Order.find({ slot: time })
            .sort({ placedAt: 1 }); // 1 for ascending order (oldest first)

        res.json(orders);

    } catch (error) {
        console.error('Error fetching slot orders:', error.message);
        res.status(500).json({ message: 'Server Error fetching slot orders.' });
    }
};

module.exports = {
    placeNewOrder,
    getUserOrders,
    getOrdersBySlot,
};