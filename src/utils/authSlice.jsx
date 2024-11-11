import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,  // Load user from localStorage
  token: localStorage.getItem('token') || null,  // Load token from localStorage
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('user'); // Remove user data from localStorage
      localStorage.removeItem('token'); // Remove token from localStorage
    },
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
