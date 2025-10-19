import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  classes: [],
  loading: false,
  error: null,
};

const classesSlice = createSlice({
  name: 'classes',
  initialState,
  reducers: {
    fetchClassesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchClassesSuccess: (state, action) => {
      state.loading = false;
      state.classes = action.payload;
      state.error = null;
    },
    fetchClassesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addClass: (state, action) => {
      state.classes.push(action.payload);
    },
    updateClass: (state, action) => {
      const index = state.classes.findIndex(cls => cls.id === action.payload.id);
      if (index !== -1) {
        state.classes[index] = action.payload;
      }
    },
    deleteClass: (state, action) => {
      state.classes = state.classes.filter(cls => cls.id !== action.payload);
    },
    clearClassesError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchClassesStart,
  fetchClassesSuccess,
  fetchClassesFailure,
  addClass,
  updateClass,
  deleteClass,
  clearClassesError,
} = classesSlice.actions;

export default classesSlice.reducer;
