// /server/controllers/userController.js

const User = require('../models/User');

// @desc    Get user info and preferences
// @route   GET /api/user/preference
// @access  Public (simplified for this app - in production, this would be private)
const getUserPreference = async (req, res) => {
    // Use a fixed ID since we skipped auth (e.g., 'user_123')
    const fixedUserId = 'user_123'; 
    
    try {
        let user = await User.findOne({ userId: fixedUserId });

        if (!user) {
            // If the fixed user doesn't exist, create a default profile
            user = new User({ userId: fixedUserId });
            await user.save();
        }

        res.json(user);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error fetching user data' });
    }
};

// @desc    Update profile/preference
// @route   PUT /api/user/preference
// @access  Public (simplified)
const updateUserPreference = async (req, res) => {
    const fixedUserId = 'user_123';
    const { name, email, defaultDrink, defaultSugar } = req.body;

    // Basic validation
    if (!name || !email || !defaultDrink || !defaultSugar) {
        return res.status(400).json({ message: 'Please provide all preference fields.' });
    }
    
    try {
        const user = await User.findOneAndUpdate(
            { userId: fixedUserId },
            { 
                name, 
                email, 
                defaultDrink, 
                defaultSugar 
            },
            { new: true, runValidators: true } // Return the updated document
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found. Cannot update.' });
        }

        res.json({ 
            message: 'User preferences updated successfully', 
            user
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error updating user preference' });
    }
};

module.exports = {
    getUserPreference,
    updateUserPreference,
};