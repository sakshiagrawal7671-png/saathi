import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../services/api';

export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await authApi.login(data);
    const { token, user } = res.data.data;
    localStorage.setItem('saathi_token', token);
    return user;
  } catch (err) {
    return rejectWithValue(err.message || 'Login failed');
  }
});

export const register = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await authApi.register(data);
    const { token, user } = res.data.data;
    localStorage.setItem('saathi_token', token);
    return user;
  } catch (err) {
    return rejectWithValue(err.message || 'Registration failed');
  }
});

export const fetchProfile = createAsyncThunk('auth/fetchProfile', async (_, { rejectWithValue }) => {
  try {
    const res = await authApi.getMe();
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: !!localStorage.getItem('saathi_token'),
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('saathi_token');
      state.user = null;
      state.isAuthenticated = false;
    },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    const pending = (state) => { state.loading = true; state.error = null; };
    const rejected = (state, action) => { state.loading = false; state.error = action.payload; };
    builder
      .addCase(login.pending, pending)
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false; state.user = action.payload; state.isAuthenticated = true;
      })
      .addCase(login.rejected, rejected)
      .addCase(register.pending, pending)
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false; state.user = action.payload; state.isAuthenticated = true;
      })
      .addCase(register.rejected, rejected)
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload; state.isAuthenticated = true;
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.isAuthenticated = false; localStorage.removeItem('saathi_token');
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
