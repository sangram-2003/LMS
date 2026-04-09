import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://localhost/LMS/Api/categories';

// ------------------ Async Thunks ------------------

// ✅ Add Category
export const addCategory = createAsyncThunk(
  'category/addCategory',
  async (categoryData, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/add.php`, categoryData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: 'Add category failed' }
      );
    }
  }
);

// ✅ Get Categories
export const getCategories = createAsyncThunk(
  'category/getCategories',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/get.php`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: 'Fetch categories failed' }
      );
    }
  }
);

// ------------------ Initial State ------------------
const initialState = {
  categories: [],   // ✅ NOT books
  loading: false,
  error: null,
};

// ------------------ Slice ------------------
const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    clearCategoryError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {

    // ---------- ADD CATEGORY ----------
    builder.addCase(addCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(addCategory.fulfilled, (state, action) => {
      state.loading = false;

      if (action.payload.status === 'success') {
        state.categories.push(action.payload.category); // backend must send category
      } else {
        state.error = action.payload.message;
      }
    });

    builder.addCase(addCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    });

    // ---------- GET CATEGORIES ----------
    builder.addCase(getCategories.pending, (state) => {
      state.loading = true;
      state.error = null;
    });



 builder.addCase(getCategories.fulfilled, (state, action) => {
  state.loading = false;
  state.categories = action.payload; // ✅ direct array
});

    builder.addCase(getCategories.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    });
  },
});

// ------------------ Export ------------------
export const { clearCategoryError } = categorySlice.actions;
export default categorySlice.reducer;