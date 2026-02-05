import { createSlice } from '@reduxjs/toolkit';

// Load initial state from localStorage
const loadAuthState = () => {
  try {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      return {
        user: JSON.parse(user),
        token,
      };
    }
  } catch (error) {
    console.error('Failed to load auth state:', error);
  }
  return {
    user: null,
    token: null,
  };
};

const initialState = loadAuthState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
