import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://localhost/LMS/Api/auth';

// Register
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/registration.php`, userData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

// Login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/login.php`, credentials);

      if (response.data.status === 'success') {
        // ✅ store user
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('isAuth', 'true');   // 🔥 ADD THIS
      }

      return response.data;

    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

// Get Users
export const getUsers = createAsyncThunk(
  'auth/getUsers',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/getUsers.php`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: 'Fetch users failed' }
      );
    }
  }
);

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  isLoggedIn: localStorage.getItem('isAuth') === 'true', // 🔥 FIXED
  loading: false,
  error: null,
  users: [],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      // ✅ reset redux state
      state.user = null;
      state.isLoggedIn = false;
      state.users = [];
      state.error = null;

      // 🔥 clear storage completely
      localStorage.removeItem('user');
      localStorage.removeItem('isAuth');
    },
  },
  extraReducers: (builder) => {

    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Registration failed';
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.status === 'success') {
          state.user = action.payload.user;
          state.isLoggedIn = true;
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
      })

      // Get Users
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.status === 'success') {
          state.users = action.payload.data;
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Fetch users failed';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;