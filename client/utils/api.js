// client/utils/api.js

import { BASE_API_URL } from '../constants/api';

/**
 * @fileoverview Utility functions for making API calls.
 */

/**
 * Generic function to fetch data from the backend.
 * @param {string} endpoint The specific endpoint path (e.g., /api/orders)
 * @param {string} method The HTTP method (GET, POST, PUT, DELETE)
 * @param {Object} data The body data for POST/PUT requests
 * @returns {Promise<Object>} The JSON response data
 */
export const apiFetch = async (endpoint, method = 'GET', data = null) => {
  const url = `${BASE_API_URL}${endpoint}`;
  
  // Prepare headers
  const headers = {
    'Content-Type': 'application/json',
  };

  const config = {
    method,
    headers,
    body: data ? JSON.stringify(data) : null,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      // Throw an error with the response status
      throw new Error(`API Error: ${response.status} ${response.statusText} for ${url}`);
    }

    if (response.status === 204) {
      return {}; 
    }

    return response.json();
  } catch (error) {
    console.error(`Error in apiFetch (${method} ${url}):`, error);
    throw error;
  }
};