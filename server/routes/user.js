// server/routes/user.js (Correct Code)
import express from 'express';
import { 
    getUserProfile, 
    updateUserProfile, 
    getPreferences, 
    updatePreferences 
} from '../controllers/userController.js'; // <-- Note: ONLY userController

const router = express.Router();

// GET /api/user/profile/:userId
router.route('/profile/:userId').get(getUserProfile).put(updateUserProfile);

// GET/PUT /api/user/preferences/:userId
router.route('/preferences/:userId').get(getPreferences).put(updatePreferences);

export default router;