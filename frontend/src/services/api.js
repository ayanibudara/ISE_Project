import axios from 'axios';

// API Base URL - centralized configuration
const API_BASE_URL = 'http://localhost:5000';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor for logging and auth
api.interceptors.request.use(
  (config) => {
    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common error cases
    if (error.response?.status === 401) {
      console.warn('Unauthorized access - user may need to log in again');
    } else if (error.response?.status === 403) {
      console.warn('Access denied - insufficient permissions');
    } else if (error.response?.status >= 500) {
      console.error('Server error:', error.response?.data?.message || 'Internal server error');
    }
    
    return Promise.reject(error);
  }
);

// API endpoints object for centralized endpoint management
export const endpoints = {
  // Auth endpoints
  auth: {
    register: '/api/auth/register',
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    profile: '/api/auth/profile',
    uploadProfile: '/api/auth/upload-profile-picture',
    deleteProfile: '/api/auth/profile'
  },
  
  // Admin endpoints
  admin: {
    stats: '/api/admin/stats',
    users: '/api/admin/users',
    userById: (id) => `/api/admin/users/${id}`,
    toggleUserStatus: (id) => `/api/admin/users/${id}/toggle-status`,
    deleteUser: (id) => `/api/admin/users/${id}`,
    generateReport: '/api/admin/users/report'
  },
  
  // File uploads
  uploads: '/uploads'
};

// Utility functions for common API operations
export const apiUtils = {
  // Build query string from parameters
  buildQueryString: (params) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value);
      }
    });
    return searchParams.toString();
  },

  // Build full URL for uploads
  getUploadUrl: (filename) => {
    return `${API_BASE_URL}${endpoints.uploads}/${filename}`;
  },

  // Get base URL
  getBaseUrl: () => API_BASE_URL
};

export default api;
