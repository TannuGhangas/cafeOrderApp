import express from 'express';
import { 
    placeNewOrder,
    getAggregatedOrders,
    getOrderDetail,
    updateOrderStatus
} from '../controllers/orderController.js';

const router = express.Router();

/**
 * CLIENT ROUTES
 */

// POST → Client places a new order
// /api/orders/client/:userId
router.post('/client/:userId', placeNewOrder);


/**
 * CHEF ROUTES
 */

// GET → Aggregated orders for Chef Dashboard
// /api/orders/chef/aggregated
router.get('/chef/aggregated', getAggregatedOrders);

// GET → Detailed orders for selected item
// Example → /api/orders/chef/detail?item=Tea&timeSlot=morning
router.get('/chef/detail', getOrderDetail);

// PUT → Update order status (Processing / Completed)
// /api/orders/chef/update-status
router.put('/chef/update-status', updateOrderStatus);

export default router;
