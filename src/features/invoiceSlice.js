import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../app/api";

//create invoice.
export const createInvoice = createAsyncThunk(
  "invoice/createInvoice",
  async ({ updatedInvoiceData, toast, history }, { rejectWithValue }) => {
    try {
      const res = await api.addInvoice(updatedInvoiceData);
      toast.success("Invoice Added Successfully");
      history.push(`/invoice/${res.data._id}`);
      return res.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

//updateInvoice
export const updateInvoice = createAsyncThunk(
  "invoice/updatedInvoice",
  async ({ id, updatedInvoiceData, history, toast }, { rejectWithValue }) => {
    try {
      const res = await api.updateInvoice(updatedInvoiceData, id);
      toast.success("Invoice Successfully Updated");
      //   history.push(`/invoice/${res.data._id}`);
      return res.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

// getInvoicebyuser
export const getInvoicesbyuser = createAsyncThunk(
  "invoice/getInvoicesbyuser",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await api.getUserInvoices(userId);
      return res.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

//get single invoice
export const getInvoice = createAsyncThunk(
  "invoice/getInvoice",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.getInvoice(id);
      return res.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

//deleteinvoice
export const deleteInvoice = createAsyncThunk(
  "invoice/deleteInvoice",
  async ({ id, toast }, { rejectWithValue }) => {
    try {
      const res = await api.deleteInvoice(id);
      toast.success("Invoice Successfully deleted");
      return res.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

const invoiceSlice = createSlice({
  name: "invoice",
  initialState: {
    invoice: {},
    invoices: [],
    userInvoices: [],
    error: "",
    loading: false,
  },
  extraReducers: {
    [createInvoice.pending]: (state) => {
      state.loading = true;
    },
    [createInvoice.fulfilled]: (state, action) => {
      state.loading = false;
      state.invoices = [action.payload];
    },
    [createInvoice.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
    //get invoices by user
    [getInvoicesbyuser.pending]: (state) => {
      state.loading = true;
    },
    [getInvoicesbyuser.fulfilled]: (state, action) => {
      state.loading = false;
      state.userInvoices = action.payload;
    },
    [getInvoicesbyuser.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
    //get single invoice
    [getInvoice.pending]: (state) => {
      state.loading = true;
    },
    [getInvoice.fulfilled]: (state, action) => {
      state.loading = false;
      state.invoice = action.payload;
    },
    [getInvoice.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
    //delete invoice
    [deleteInvoice.pending]: (state) => {
      state.loading = true;
    },
    [deleteInvoice.fulfilled]: (state, action) => {
      state.loading = false;
      const {
        arg: { id },
      } = action.meta;
      if (id) {
        state.userInvoices = state.userInvoices.filter(
          (item) => item._id !== id
        );
        state.invoices = state.invoices.filter((item) => item._id !== id);
      }
    },
    [deleteInvoice.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
    //update invoice
    [updateInvoice.pending]: (state) => {
      state.loading = true;
    },
    [updateInvoice.fulfilled]: (state, action) => {
      state.loading = false;
      const {
        arg: { id },
      } = action.meta;
      if (id) {
        state.userInvoices = state.userInvoices.map((item) =>
          item._id === id ? action.payload : item
        );
        state.invoices = state.invoices.map((item) =>
          item._id === id ? action.payload : item
        );
      }
    },
    [updateInvoice.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
  },
});
export default invoiceSlice.reducer;
