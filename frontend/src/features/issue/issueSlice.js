import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost/LMS/Api/issue";

// ------------------ Thunks ------------------

// ✅ Get all issued books
export const getIssuedBooks = createAsyncThunk(
  "issue/getIssuedBooks",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${BASE_URL}/getIssuedBooks.php`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Fetch failed" }
      );
    }
  }
);


// ✅ Get books by student
export const getByStudent = createAsyncThunk(
  "issue/getByStudent",
  async (roll_number, thunkAPI) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/getByStudent.php?roll_number=${roll_number}`
      );
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Fetch failed" }
      );
    }
  }
);

// ✅ Issue book
export const issueBook = createAsyncThunk(
  "issue/issueBook",
  async (data, thunkAPI) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/issueBook.php`,
        data
      );
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Issue failed" }
      );
    }
  }
);

// ✅ Return book
export const returnBook = createAsyncThunk(
  "issue/returnBook",
  async (issue_id, thunkAPI) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/returnBook.php?issue_id=${issue_id}`
      );
      return { issue_id, ...res.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Return failed" }
      );
    }
  }
);
// ✅ Get Requests (student / admin)
export const getRequests = createAsyncThunk(
  "issue/getRequests",
  async ({ role, roll_number }, thunkAPI) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/getRequests.php`,
        {
          params: { role, roll_number },
        }
      );
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Fetch requests failed" }
      );
    }
  }
);

// ✅ Approve / Reject Request
export const updateRequest = createAsyncThunk(
  "issue/updateRequest",
  async ({ issue_id, action }, thunkAPI) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/updateRequest.php`,
        { issue_id, action } // approved / rejected
      );

      return { issue_id, action, ...res.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Update failed" }
      );
    }
  }
);

export const approveReturn = createAsyncThunk(
  "issue/approveReturn",
  async (issue_id, thunkAPI) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/approveReturn.php`,
        { issue_id }
      );

      return { issue_id, ...res.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Approve return failed" }
      );
    }
  }
);
// ------------------ Initial State ------------------

const initialState = {
  issueBooks: [],
  studentIssues: [],
  requests: [],
  loading: false,
  error: null,
};

// ------------------ Slice ------------------

const issueSlice = createSlice({
  name: "issue",
  initialState,
  reducers: {
    clearIssueError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    
    // ---------- GET ALL ----------
    builder.addCase(getIssuedBooks.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getIssuedBooks.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload.status === "success") {
        state.issueBooks = action.payload;
      } else {
        state.error = action.payload.message;
      }
    });

    builder.addCase(getIssuedBooks.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    });

    // ---------- GET BY STUDENT ----------
    builder.addCase(getByStudent.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getByStudent.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload.status === "success") {
        state.studentIssues = action.payload.data;
      } else {
        state.error = action.payload.message;
      }
    });

    builder.addCase(getByStudent.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    });

    // ---------- ISSUE BOOK ----------
    builder.addCase(issueBook.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(issueBook.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload.status === "success") {
        state.issueBooks.push(action.payload.data);
      } else {
        state.error = action.payload.message;
      }
    });

    builder.addCase(issueBook.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    });

    // ---------- RETURN BOOK ----------
    builder.addCase(returnBook.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(returnBook.fulfilled, (state, action) => {
      state.loading = false;

      if (action.payload.status === "success") {
        const index = state.issueBooks.findIndex(
          (item) => item.issue_id === action.payload.issue_id
        );

        if (index !== -1) {
          state.issueBooks[index].return_status = "returned";
        }
      } else {
        state.error = action.payload.message;
      }
    });

    builder.addCase(returnBook.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    });
    // ---------- GET REQUESTS ----------
builder.addCase(getRequests.pending, (state) => {
  state.loading = true;
});

builder.addCase(getRequests.fulfilled, (state, action) => {
  state.loading = false;

  // ⚠️ Your PHP returns plain array (NOT {status, data})
  if (Array.isArray(action.payload)) {
    state.requests = action.payload;
  } else if (action.payload.status === "error") {
    state.error = action.payload.message;
  }
});

builder.addCase(getRequests.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload?.message;
});

// ---------- UPDATE REQUEST (APPROVE / REJECT) ----------
builder.addCase(updateRequest.pending, (state) => {
  state.loading = true;
});

builder.addCase(updateRequest.fulfilled, (state, action) => {
  state.loading = false;

  if (action.payload.status === "success") {
    const { issue_id, action: newStatus } = action.payload;

    // 🔥 Update request list UI instantly
    const index = state.requests.findIndex(
      (item) => item.issue_id === issue_id
    );

    if (index !== -1) {
      state.requests[index].status = newStatus;
    }

  } else {
    state.error = action.payload.message;
  }
});

builder.addCase(updateRequest.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload?.message;
});
// ---------- APPROVE RETURN ----------
builder.addCase(approveReturn.pending, (state) => {
  state.loading = true;
});

builder.addCase(approveReturn.fulfilled, (state, action) => {
  state.loading = false;

  if (action.payload.status === "success") {
    const { issue_id } = action.payload;

    // 🔥 Update UI instantly
    const index = state.issueBooks.findIndex(
      (item) => item.issue_id === issue_id
    );

    if (index !== -1) {
      state.issueBooks[index].return_status = "return";
    }

    // 🔥 Also update requests if present
    const reqIndex = state.requests.findIndex(
      (item) => item.issue_id === issue_id
    );

    if (reqIndex !== -1) {
      state.requests[reqIndex].return_status = "return";
    }

  } else {
    state.error = action.payload.message;
  }
});

builder.addCase(approveReturn.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload?.message;
});
  },
});

// ------------------ Export ------------------

export const { clearIssueError } = issueSlice.actions;
export default issueSlice.reducer;