import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../app/api";

//getProfilesByUser
export const getProfilesByUser = createAsyncThunk(
  "profile/getProfilesByUser",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await api.getProfileByUser(userId);
      return res.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

//createprofile.
export const createProfile = createAsyncThunk(
  "profile/createProfile",
  async ({ updatedFormData, toast }, { rejectWithValue }) => {
    try {
      const res = await api.createClient(updatedFormData);
      toast.success("Profile Added Successfully");
      return res.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

//updateProfile
export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async ({ id, updatedFormData, toast }, { rejectWithValue }) => {
    try {
      const res = await api.updateClient(updatedFormData, id);
      toast.success("Profile Successfully Updated");
      return res.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    profiles: [],
    userProfiles: [],
    error: "",
    loading: false,
  },
  extraReducers: {
    // update profile
    [updateProfile.pending]: (state) => {
      state.loading = true;
    },
    [updateProfile.fulfilled]: (state, action) => {
      state.loading = false;
      const {
        arg: { id },
      } = action.meta;
      if (id) {
        state.userProfiles = state.userProfiles.map((item) =>
          item._id === id ? action.payload : item
        );
        state.profiles = state.profiles.map((item) =>
          item._id === id ? action.payload : item
        );
      }
    },
    [updateProfile.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
    [createProfile.pending]: (state) => {
      state.loading = true;
    },
    [createProfile.fulfilled]: (state, action) => {
      state.loading = false;
      state.profiles = [action.payload];
    },
    [createProfile.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
    //get profiles by user
    [getProfilesByUser.pending]: (state) => {
      state.loading = true;
    },
    [getProfilesByUser.fulfilled]: (state, action) => {
      state.loading = false;
      state.userProfiles = action.payload;
    },
    [getProfilesByUser.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
  },
});

export default profileSlice.reducer;
