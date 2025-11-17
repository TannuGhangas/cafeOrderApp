// client/constants/api.js

/**
 * @fileoverview API constants for the client application.
 */

// Your specified base API URL
export const BASE_API_URL = 'https://cafeorderapp-1.onrender.com';

// Define key endpoints (using a placeholder ID since Auth is skipped)
export const USER_ID_PLACEHOLDER = 'tannu-client-id';

export const ENDPOINTS = {
  // Client Endpoints - Data is fetched for this placeholder ID
  USER_PROFILE: `/api/user/profile/${USER_ID_PLACEHOLDER}`, 
  USER_PREFERENCES: `/api/user/preferences/${USER_ID_PLACEHOLDER}`,
  ORDERS: `/api/orders/client/${USER_ID_PLACEHOLDER}`, 
  
  // Chef Endpoints (for reference in the Server/Chef app)
  CHEF_ORDERS: '/api/orders/chef', 
};