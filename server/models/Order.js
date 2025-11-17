const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // Links the order to the user who placed it
  },
  userName: { // For quick display on Chef side
    type: String,
    required: true,
  },
  slot: { // Morning or Evening Slot Selection
    type: String,
    enum: ['Morning', 'Evening'],
    required: true,
  },
  item: { // The Drink
    type: String,
    required: true,
  },
  sugarLevel: { // Sugar Level Selection
    type: String,
    enum: ['Less Sugar', 'Normal', 'More Sugar'],
    required: true,
  },
  quantity: { // Quantity Selector
    type: Number,
    required: true,
    default: 1,
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Ready', 'Completed'],
    default: 'Pending',
  },
  isChefViewed: { // For optional Chef notifications/dashboard tracking
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;