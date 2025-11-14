// /server/models/User.js

const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    // Since we removed login, we'll use a simple, pre-defined ID for the fixed user
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        default: 'Café App User',
    },
    email: {
        type: String,
        required: true,
        default: 'user@company.com',
    },
    defaultDrink: {
        type: String,
        default: 'Latte',
    },
    defaultSugar: {
        type: String,
        enum: ['Less', 'Normal', 'More'],
        default: 'Normal',
    },
}, {
    timestamps: true,
});

const User = mongoose.model('User', UserSchema);

module.exports = User;