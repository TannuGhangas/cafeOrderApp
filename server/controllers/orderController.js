// server/controllers/orderController.js

// --- IN-MEMORY MOCK DATABASE ---
let ordersDB = [];
let nextOrderId = 2000;

// Helper function to simulate data aggregation for the chef dashboard
const aggregateOrders = (timeSlot) => {
    // 1. Filter orders by time slot (Morning/Afternoon)
    const filteredOrders = ordersDB.filter(order => order.timeSlot === timeSlot);

    // 2. Group by drink item and sum quantities
    const aggregated = filteredOrders.reduce((acc, order) => {
        // Group by item name
        const key = order.item;
        if (!acc[key]) {
            acc[key] = { 
                item: order.item, 
                quantity: 0, 
                status: 'New', 
                timeSlot: timeSlot 
            };
        }
        acc[key].quantity += order.quantity;

        // Determine overall status (if any item is 'New', the group is 'New')
        if (order.status === 'New') {
            acc[key].status = 'New';
        } else if (order.status === 'Processing' && acc[key].status !== 'New') {
            acc[key].status = 'Processing';
        } 
        
        return acc;
    }, {});

    return Object.values(aggregated);
};
// --- END MOCK DATABASE ---


// @route POST /api/orders/client/:userId
// @desc Place a new order from a user (Client Frontend)
export const placeNewOrder = async (req, res) => {
    const { userId } = req.params;
    const { name, timeSlot, items } = req.body; // items is an array of { item, quantity, sugar }

    if (!items || items.length === 0) {
        return res.status(400).json({ message: 'Order must contain items.' });
    }

    const newOrders = items
        .filter(i => i.quantity > 0) // Only save items with quantity > 0
        .map(item => ({
            id: nextOrderId++,
            userId,
            userName: name || `Employee ${userId}`, // Use name from profile
            contact: '999-000-1111', // Mock contact
            timeSlot,
            item: item.item,
            quantity: item.quantity,
            sugar: item.sugar,
            status: 'New',
            createdAt: new Date().toISOString(),
        }));

    ordersDB.push(...newOrders);
    console.log(`[Order API] New orders placed by ${name} (${newOrders.length} items)`);
    
    // Simulate Notification to Chef (In a real app, this would trigger a WebSocket event)
    
    res.status(201).json({ 
        message: 'Order placed successfully. Awaiting confirmation.', 
        orderCount: newOrders.length 
    });
};


// @route GET /api/orders/chef/aggregated
// @desc Get aggregated orders for Chef Dashboard
export const getAggregatedOrders = (req, res) => {
    // In a real app, you might check if the user is authorized as a chef
    const morningOrders = aggregateOrders('morning');
    const afternoonOrders = aggregateOrders('afternoon');

    res.json({
        aggregated: [...morningOrders, ...afternoonOrders]
    });
};


// @route GET /api/orders/chef/detail
// @desc Get individual orders for a specific item (Chef Detail Screen)
export const getOrderDetail = (req, res) => {
    const { item, timeSlot } = req.query; // Query params: ?item=Espresso Blend&timeSlot=morning

    if (!item || !timeSlot) {
        return res.status(400).json({ message: 'Missing item or timeSlot query parameter.' });
    }

    const details = ordersDB
        .filter(order => order.item === item && order.timeSlot === timeSlot)
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); // Oldest first

    res.json(details);
};


// @route PUT /api/orders/chef/update-status
// @desc Update the status of a specific order item (Chef Frontend)
export const updateOrderStatus = (req, res) => {
    const { orderId, newStatus } = req.body;

    const orderIndex = ordersDB.findIndex(order => order.id === orderId);

    if (orderIndex === -1) {
        return res.status(404).json({ message: 'Order not found.' });
    }

    ordersDB[orderIndex].status = newStatus;
    console.log(`[Order API] Order ${orderId} updated to ${newStatus}`);

    res.json({ message: `Order ${orderId} status updated to ${newStatus}.` });
};