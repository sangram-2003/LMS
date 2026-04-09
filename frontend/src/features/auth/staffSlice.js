import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ BASE URL
const BASE_URL = "http://localhost/LMS/Api/admin";

// 🔥 LOGIN API
export const loginStaff = createAsyncThunk(
  "staff/loginStaff",
  async (loginData, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/login.php`,
        loginData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Login failed");
    }
  }
);

// 🔥 GET ALL STAFF API
export const getAllStaff = createAsyncThunk(
  "staff/getAllStaff",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/getAllStaff.php`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Fetch failed");
    }
  }
);

// 🔥 SLICE
const staffSlice = createSlice({
  name: "staff",
  initialState: {
    user: null,
    staffList: [],
    loading: false,
    error: null,
  },

  reducers: {
    logout: (state) => {
      state.user = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // 🔐 LOGIN
      .addCase(loginStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginStaff.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.status === "success") {
          state.user = action.payload.user;

          // ✅ Save to localStorage
          localStorage.setItem(
            "staffUser",
            JSON.stringify(action.payload.user)
          );
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(loginStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 📋 GET ALL STAFF
      .addCase(getAllStaff.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllStaff.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.status === "success") {
          state.staffList = action.payload.data;
        }
      })
      .addCase(getAllStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = staffSlice.actions;
export default staffSlice.reducer;