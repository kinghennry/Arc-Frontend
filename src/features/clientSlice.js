import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../app/api";

//getClientbyuser
export const getClientsByUser = createAsyncThunk(
  "client/getClientsByUser",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await api.getClientsByUser(userId);
      return res.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

//createClient.
export const createClient = createAsyncThunk(
  "client/createClient",
  async ({ clientData, toast }, { rejectWithValue }) => {
    try {
      const res = await api.createClient(clientData);
      toast.success("Client Added Successfully");
      return res.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

//deleteclient
export const deleteClient = createAsyncThunk(
  "client/deleteClient",
  async ({ id, toast }, { rejectWithValue }) => {
    try {
      const res = await api.deleteClient(id);
      toast.success("Client Successfully deleted");
      return res.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

//updateClient
export const updatedClient = createAsyncThunk(
  "client/updatedClient",
  async ({ id, clientData, toast }, { rejectWithValue }) => {
    try {
      const res = await api.updateClient(clientData, id);
      toast.success("Client Successfully Updated");
      return res.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

const clientSlice = createSlice({
  name: "client",
  initialState: {
    clients: [],
    userClients: [],
    error: "",
    loading: false,
  },
  extraReducers: {
    [createClient.pending]: (state) => {
      state.loading = true;
    },
    [createClient.fulfilled]: (state, action) => {
      state.loading = false;
      state.clients = [action.payload];
    },
    [createClient.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
    //get clients by user
    [getClientsByUser.pending]: (state) => {
      state.loading = true;
    },
    [getClientsByUser.fulfilled]: (state, action) => {
      state.loading = false;
      state.userClients = action.payload;
    },
    [getClientsByUser.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
    // delete client
    [deleteClient.pending]: (state) => {
      state.loading = true;
    },
    [deleteClient.fulfilled]: (state, action) => {
      state.loading = false;
      const {
        arg: { id },
      } = action.meta;
      if (id) {
        state.userClients = state.userClients.filter((item) => item._id !== id);
        state.clients = state.clients.filter((item) => item._id !== id);
      }
    },
    [deleteClient.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
    // update client
    [updatedClient.pending]: (state) => {
      state.loading = true;
    },
    [updatedClient.fulfilled]: (state, action) => {
      state.loading = false;
      const {
        arg: { id },
      } = action.meta;
      if (id) {
        state.userClients = state.userClients.map((item) =>
          item._id === id ? action.payload : item
        );
        state.clients = state.clients.map((item) =>
          item._id === id ? action.payload : item
        );
      }
    },
    [updatedClient.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
  },
});
export default clientSlice.reducer;
