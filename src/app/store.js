import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import profileReducer from "../features/profileSlice";
import clientReducer from "../features/clientSlice";
import invoiceReducer from "../features/invoiceSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    client: clientReducer,
    invoice: invoiceReducer,
  },
});
