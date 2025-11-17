// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String },
  email: { type: String },
  // default preferences saved here
  preferences: {
    defaultType: { type: String, default: 'Hot' },
    defaultSugar: { type: String, default: 'Normal' },
    defaultQuantity: { type: Number, default: 1 },
  },
  // store device tokens (for notifications later)
  expoPushTokens: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);