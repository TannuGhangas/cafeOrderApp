// /server/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { 
    getUserPreference, 
    updateUserPreference 
} = require('../controllers/userController');

// Route: /api/user/preference
router.route('/preference')
    .get(getUserPreference)
    .put(updateUserPreference);

module.exports = router;