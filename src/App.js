import React, { useEffect } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { Footer, Header, NavBar, ProtectedRoute } from "./components";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Home,
  Dashboard,
  ClientList,
  Invoice,
  InvoiceDetail,
  Invoices,
  Login,
  //   Settings,
} from "./pages";
import { setUser } from "./features/authSlice";
import { useDispatch } from "react-redux";

const theme = createTheme({
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Roboto",
      "Oxygen",
      "Ubuntu",
      "Cantarell",
      "Fira Sans",
      "Droid Sans",
      "Helvetica Neue",
      "sans-serif",
    ].join(","),
  },
});

const App = () => {
  const user = JSON.parse(localStorage.getItem("profile"));
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setUser(user));
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const account = user?.result?._id;
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <ToastContainer />
        <NavBar />
        <Header />
        <Switch>
          <Route exact path="/">
            {!account ? <Home /> : <Redirect to="/dashboard" />}
          </Route>
          <Route exact path="/login">
            {/* {account || googleAccount ? (
              <Redirect to="/dashboard" />
            ) : ( */}
            <Login />
            {/* )} */}
          </Route>
          <Route exact path="/dashboard">
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          </Route>
          <Route exact path="/customers">
            <ProtectedRoute>
              <ClientList />
            </ProtectedRoute>
          </Route>
          <Route exact path="/edit/invoice/:id">
            <ProtectedRoute>
              <Invoice />
            </ProtectedRoute>
          </Route>
          <Route exact path="/invoice/:id">
            <ProtectedRoute>
              <InvoiceDetail />
            </ProtectedRoute>
          </Route>
          <Route exact path="/invoice">
            <ProtectedRoute>
              <Invoice />
            </ProtectedRoute>
          </Route>
          <Route exact path="/invoices">
            <ProtectedRoute>
              <Invoices />
            </ProtectedRoute>
          </Route>
          {/* <Route exact path="/settings">
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          </Route> */}
          <Redirect exact from="/new-invoice" to="/invoice" />
        </Switch>
        <Footer />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
