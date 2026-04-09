import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://localhost/LMS/Api/books';

// ------------------ Async Thunks ------------------

// Add a book
export const addBook = createAsyncThunk(
  'book/addBook',
  async (bookData, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/addBook.php`, bookData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { message: 'Add book failed' });
    }
  }
);

// Update a book
export const updateBook = createAsyncThunk(
  'books/updateBook',
  async ({ isbn, bookData }, thunkAPI) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/updateBook.php?isbn=${isbn}`,
        bookData
      );
      return { isbn, ...bookData, ...response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: 'Update failed' }
      );
    }
  }
);

// Delete a book
export const deleteBook = createAsyncThunk(
  'books/deleteBook',
  async (isbn, thunkAPI) => {   // ✅ use isbn
    try {
      const response = await axios.delete(
        `${BASE_URL}/deleteBook.php?isbn=${isbn}`
      );
      return { isbn, ...response.data };  // ✅ return isbn
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data 
      );
    }
  }
);

// Get all books
export const getBooks = createAsyncThunk(
  'book/getBooks',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/getBooks.php`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { message: 'Fetch books failed' });
    }
  }
);

// ------------------ Initial State ------------------
const initialState = {
  books: [],
  loading: false,
  error: null,
};

// ------------------ Slice ------------------
const bookSlice = createSlice({
  name: 'book',
  initialState,
  reducers: {
    clearBookError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ---------- ADD BOOK ----------
    builder.addCase(addBook.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
  
    builder.addCase(addBook.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    });

    // ---------- UPDATE BOOK ----------
    builder.addCase(updateBook.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
   builder.addCase(updateBook.fulfilled, (state, action) => {
  const index = state.books.findIndex(
    (book) => book.isbn === action.payload.isbn
  );

  if (index !== -1) {
    state.books[index] = {
      ...state.books[index],
      ...action.payload,
    };
  }
});
    builder.addCase(updateBook.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    });

    // ---------- DELETE BOOK ----------
    builder.addCase(deleteBook.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
   builder.addCase(deleteBook.fulfilled, (state, action) => {
  state.loading = false;

  if (action.payload.status === "deleted") {
    state.books = state.books.filter(
      (book) => book.isbn !== action.payload.isbn
    );
  } else {
    state.error = action.payload.message;
  }
});
    builder.addCase(deleteBook.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    });

    // ---------- GET BOOKS ----------
    builder.addCase(getBooks.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
 builder.addCase(getBooks.fulfilled, (state, action) => {
  state.loading = false;
  state.books = action.payload; // ✅ directly assign array
});
    builder.addCase(getBooks.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    });
  },
});

export const { clearBookError } = bookSlice.actions;
export default bookSlice.reducer;