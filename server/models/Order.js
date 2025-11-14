// /server/models/Order.js

const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
    // Fixed User ID reference (simulates who placed the order)
    userId: {
        type: String,
        required: true,
    },
    item: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    sugarLevel: {
        type: String,
        enum: ['Less', 'Normal', 'More'],
        required: true,
    },
    slot: {
        type: String,
        enum: ['Morning', 'Evening'],
        required: true,
    },
    status: {
        type: String,
        enum: ['New', 'Preparing', 'Ready', 'Completed'],
        default: 'New',
    },
    placedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;