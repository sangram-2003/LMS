import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import bookReducer from '../features/book/bookSlice'; // ✅ ADD THIS
import categoryReducer from '../features/book/categorySlice'
import issueReducer from '../features/issue/issueSlice';
import staffReucer from '../features/auth/staffSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    book: bookReducer, // ✅ ADD THIS LINE
    category:categoryReducer,
    issue:issueReducer,
    staff:staffReucer
  },
});

export default store;