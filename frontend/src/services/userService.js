import api, { endpoints } from './api';

export const userService = {
  // Get user profile
  getProfile: async () => {
    const response = await api.get(endpoints.auth.profile);
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const config = {};
    
    // If profileData is FormData (for file upload), set appropriate headers
    if (profileData instanceof FormData) {
      config.headers = {
        'Content-Type': 'multipart/form-data'
      };
    }
    
    const response = await api.put(endpoints.auth.profile, profileData, config);
    return response.data;
  },

  // Upload profile picture
  uploadProfilePicture: async (file) => {
    const formData = new FormData();
    formData.append('profilePicture', file);
    
    const response = await api.post(endpoints.auth.uploadProfile, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Delete user profile
  deleteProfile: async () => {
    const response = await api.delete(endpoints.auth.deleteProfile);
    return response.data;
  },
};

export default userService;