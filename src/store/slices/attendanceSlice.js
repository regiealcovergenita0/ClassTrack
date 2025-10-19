import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  attendanceRecords: [],
  loading: false,
  error: null,
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    fetchAttendanceStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchAttendanceSuccess: (state, action) => {
      state.loading = false;
      state.attendanceRecords = action.payload;
      state.error = null;
    },
    fetchAttendanceFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addAttendanceRecord: (state, action) => {
      state.attendanceRecords.push(action.payload);
    },
    updateAttendanceRecord: (state, action) => {
      const index = state.attendanceRecords.findIndex(record => record.id === action.payload.id);
      if (index !== -1) {
        state.attendanceRecords[index] = action.payload;
      }
    },
    deleteAttendanceRecord: (state, action) => {
      state.attendanceRecords = state.attendanceRecords.filter(record => record.id !== action.payload);
    },
    clearAttendanceError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchAttendanceStart,
  fetchAttendanceSuccess,
  fetchAttendanceFailure,
  addAttendanceRecord,
  updateAttendanceRecord,
  deleteAttendanceRecord,
  clearAttendanceError,
} = attendanceSlice.actions;

export default attendanceSlice.reducer;
