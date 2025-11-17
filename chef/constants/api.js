// chef-app/constants/api.js

export const BASE_API_URL = 'https://cafeorderapp-1.onrender.com';

export const ENDPOINTS = {
  // Chef Endpoints
  CHEF_ORDERS_AGGREGATED: '/api/orders/chef/aggregated', 
  CHEF_ORDERS_DETAIL: '/api/orders/chef/detail', // Expects a time slot or item ID
  ORDER_UPDATE_STATUS: '/api/orders/chef/update-status', // POST/PUT
};