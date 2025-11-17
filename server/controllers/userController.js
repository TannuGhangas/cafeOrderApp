// server/controllers/userController.js

// --- IN-MEMORY MOCK DATABASE ---
const mockUsers = {
  // Uses the placeholder ID from the client app
  'tannu-client-id': {
      userId: 'tannu-client-id',
      name: 'Tannu',
      contactNo: '9876543210',
      preferences: {
          coffee: { quantity: 1, sugar: '1' },
          tea: { quantity: 0, sugar: 'None' },
      },
  },
};
// --- END MOCK DATABASE ---

// @route GET /api/user/profile/:userId
export const getUserProfile = (req, res) => {
  const { userId } = req.params;
  const user = mockUsers[userId];

  if (!user) {
      return res.status(404).json({ message: 'User not found.' });
  }

  // Only return non-sensitive profile data
  res.json({ name: user.name, contactNo: user.contactNo });
};

// @route PUT /api/user/profile/:userId
export const updateUserProfile = (req, res) => {
  const { userId } = req.params;
  const { name, contactNo } = req.body;
  
  if (mockUsers[userId]) {
      mockUsers[userId].name = name || mockUsers[userId].name;
      mockUsers[userId].contactNo = contactNo || mockUsers[userId].contactNo;
      
      // This is where a notification would be sent to the chef if the name changed
      console.log(`[User API] Profile updated for ${userId}: Name=${name}, Contact=${contactNo}`);
      
      return res.json({ 
          message: 'Profile updated successfully.', 
          profile: { name: mockUsers[userId].name, contactNo: mockUsers[userId].contactNo }
      });
  }

  res.status(404).json({ message: 'User not found.' });
};


// @route GET /api/user/preferences/:userId
export const getPreferences = (req, res) => {
  const { userId } = req.params;
  const user = mockUsers[userId];
  
  if (user) {
      return res.json({ preferences: user.preferences });
  }

  res.status(404).json({ message: 'Preferences not found.' });
};

// @route PUT /api/user/preferences/:userId
export const updatePreferences = (req, res) => {
  const { userId } = req.params;
  const { preferences } = req.body;

  if (mockUsers[userId]) {
      // Simple overwrite of the preference object
      mockUsers[userId].preferences = preferences;
      console.log(`[User API] Preferences updated for ${userId}`);
      return res.json({ message: 'Preferences updated successfully.' });
  }

  res.status(404).json({ message: 'User not found.' });
};