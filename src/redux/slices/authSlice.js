import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "https://taskmanagerapplicationsam.onrender.com"; // Fixed: Removed extra `/`

// Signup function
export const signup = createAsyncThunk("auth/signup", async (formData, thunkAPI) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/register`, formData, { withCredentials: true });
    localStorage.setItem("token", response.data.token); // Store token in localStorage
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Signup failed.");
  }
});

// Login function
export const login = createAsyncThunk("auth/login", async (credentials, thunkAPI) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/login`, credentials, { withCredentials: true });
    localStorage.setItem("token", response.data.token); // Store token in localStorage
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Login failed.");
  }
});

// Fetch User Profile function
export const fetchUserProfile = createAsyncThunk("auth/fetchUserProfile", async (_, thunkAPI) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found.");

    const response = await axios.get(`${API_BASE_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch user profile.");
  }
});

// Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, loading: false, error: null, token: localStorage.getItem("token") || null },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token"); // Remove token on logout
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup cases
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login cases
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch user profile cases
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Store user profile data
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
