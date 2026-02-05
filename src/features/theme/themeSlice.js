import { createSlice } from '@reduxjs/toolkit';

// Load theme from localStorage or default to 'light'
const loadTheme = () => {
  try {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  } catch (error) {
    return 'light';
  }
};

const initialState = {
  mode: loadTheme(),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.mode);
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
