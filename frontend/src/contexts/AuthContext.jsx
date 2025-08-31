import { createContext, useContext, useCallback, useState } from 'react';
import api, { endpoints } from '../utils/api';

// Initial auth state
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

// Create the auth context
const AuthContext = createContext({
  authState: initialState,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  checkAuth: async () => {},
  clearError: () => {}
});

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(initialState);

  // Check if user is already authenticated
  const checkAuth = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      const response = await api.get(endpoints.auth.profile);
      
      if (response.data && response.data.user) {
        setAuthState({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        return response.data.user;
      } else {
        setAuthState({
          ...initialState,
          isLoading: false
        });
        return null;
      }
    } catch (error) {
      // 401 is expected when user is not authenticated, don't treat it as an error
      if (error.response?.status === 401) {
        setAuthState({
          ...initialState,
          isLoading: false
        });
        return null;
      }
      
      // Other errors should be handled
      setAuthState({
        ...initialState,
        isLoading: false,
        error: error.response?.data?.message || 'Authentication check failed'
      });
      throw error;
    }
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await api.post(endpoints.auth.login, credentials);
      
      setAuthState({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error.response?.data?.message || 'Login failed'
      }));
      throw error;
    }
  };

  // Register function
  const register = async (data) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Determine content type based on data type
      const config = {};
      
      // If data is FormData (for file upload), explicitly remove content-type header
      // The browser will set it automatically with the proper boundary
      if (data instanceof FormData) {
        config.headers = {};
        // Remove any default content-type headers for FormData
        delete config.headers['Content-Type'];
      } else {
        config.headers = {
          'Content-Type': 'application/json'
        };
      }
      
      const response = await api.post(endpoints.auth.register, data, config);
      
      setAuthState({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error.response?.data?.message || 'Registration failed'
      }));
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await api.post(endpoints.auth.logout, {});
      
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails on server, clear local state
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
    }
  };

  // Clear error function
  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  // Context value
  const value = {
    authState,
    login,
    register,
    logout,
    checkAuth,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
