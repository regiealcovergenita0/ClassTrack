import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isDarkMode: false,
  primaryColor: '#667eea',
  secondaryColor: '#764ba2',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
    setDarkMode: (state, action) => {
      state.isDarkMode = action.payload;
    },
    setPrimaryColor: (state, action) => {
      state.primaryColor = action.payload;
    },
    setSecondaryColor: (state, action) => {
      state.secondaryColor = action.payload;
    },
  },
});

export const {
  toggleDarkMode,
  setDarkMode,
  setPrimaryColor,
  setSecondaryColor,
} = themeSlice.actions;

export default themeSlice.reducer;
