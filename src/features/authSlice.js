import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../app/api";

//register action.
export const register = createAsyncThunk(
  "user/register",
  async ({ formData, toast }, { rejectWithValue }) => {
    try {
      const res = await api.signUp(formData);
      toast.success("Register Successfully");
      return res.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);
//login action.
export const login = createAsyncThunk(
  "user/login",
  async ({ formData, toast }, { rejectWithValue }) => {
    try {
      const res = await api.signIn(formData);
      toast.success("Login Successfully");
      return res.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

//google action.
export const googleSignIn = createAsyncThunk(
  "auth/googleSignIn",
  async ({ result, toast }, { rejectWithValue }) => {
    try {
      const res = await api.googleSignIn(result);
      toast.success("Google Sign-in Successfully");
      return res.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    error: "",
    loading: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setLogout: (state) => {
      localStorage.clear();
      state.user = null;
    },
  },
  extraReducers: {
    [register.pending]: (state) => {
      state.loading = true;
    },
    [register.fulfilled]: (state, action) => {
      state.loading = false;
      localStorage.setItem("profile", JSON.stringify({ ...action.payload }));
      state.user = action.payload;
    },
    [register.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
    [login.pending]: (state) => {
      state.loading = true;
    },
    [login.fulfilled]: (state, action) => {
      state.loading = false;
      localStorage.setItem("profile", JSON.stringify({ ...action.payload }));
      state.user = action.payload;
    },
    [login.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
    [googleSignIn.pending]: (state) => {
      state.loading = true;
    },
    [googleSignIn.fulfilled]: (state, action) => {
      state.loading = false;
      localStorage.setItem("profile", JSON.stringify({ ...action.payload }));
      state.user = action.payload;
    },
    [googleSignIn.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
  },
});
export const { setUser, setLogout } = authSlice.actions;
export default authSlice.reducer;
