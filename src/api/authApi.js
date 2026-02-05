import axiosClient from './axiosClient';

export const authApi = {
  // Login user
  login: async (credentials) => {
    const response = await axiosClient.post('/auth/login', credentials);
    return response.data;
  },

  // Register user
  register: async (userData) => {
    const response = await axiosClient.post('/auth/register', userData);
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await axiosClient.get('/auth/me');
    return response.data;
  },
};
