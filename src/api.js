/**
 * API Configuration
 * Centralized API endpoints and base URL
 */

const API_BASE_URL = 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
  },
  PRODUCTS: {
    LIST: '/products',
    DETAIL: '/products',
  },
  CART: {
    ITEMS: '/cart',
  },
  ORDERS: {
    LIST: '/orders',
    CREATE: '/orders',
  },
};

export default API_BASE_URL;