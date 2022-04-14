import React, { useState, useEffect } from "react";
import { SEO } from "../../components";
import { register, login, googleSignIn } from "../../features/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import useStyles from "./styles";
import styles from "./Login.module.css";
import { GoogleLogin } from "react-google-login";
import Field from "./Field";
import {
  Avatar,
  Button,
  Paper,
  Grid,
  Typography,
  Container,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function Login() {
  //   const user = JSON.parse(localStorage.getItem("profile"));
  const dispatch = useDispatch();
  const classes = useStyles();
  const [formData, setFormData] = useState(initialState);
  const history = useHistory();
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // eslint-disable-next-line
  //handle input
  const onInputChange = (e) => {
    let { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const { error, user } = useSelector((state) => ({ ...state.auth }));
  const handleShowPassword = () => setShowPassword(!showPassword);
  useEffect(() => {
    error && toast.error(error);
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignup) {
      dispatch(register({ formData, toast }));
    } else {
      dispatch(login({ formData, toast }));
    }
  };

  const googleSuccess = (resp) => {
    const email = resp?.profileObj.email;
    const name = resp?.profileObj.name;
    const token = resp?.tokenId;
    const googleId = resp?.googleId;
    const result = { email, token, name, googleId };
    dispatch(googleSignIn({ result, toast }));
  };

  const googleError = (error) => {
    toast.error(error);
  };

  const switchMode = () => {
    setIsSignup((prevState) => !prevState);
  };

  if (user) {
    history.push("/dashboard");
  }

  return (
    <React.Fragment>
      <SEO title="Login" />
      <Container component="main" maxWidth="xs">
        <Paper className={classes.paper} elevation={2}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {isSignup ? "Sign up" : "Sign in"}
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {isSignup && (
                <>
                  <Field
                    name="firstName"
                    label="First Name"
                    handleChange={onInputChange}
                    autoFocus
                    half
                  />
                  <Field
                    name="lastName"
                    label="Last Name"
                    handleChange={onInputChange}
                    half
                  />
                </>
              )}
              <Field
                name="email"
                label="Email Address"
                handleChange={onInputChange}
                type="email"
              />
              <Field
                name="password"
                label="Password"
                handleChange={onInputChange}
                type={showPassword ? "text" : "password"}
                handleShowPassword={handleShowPassword}
              />
              {isSignup && (
                <Field
                  name="confirmPassword"
                  label="Repeat Password"
                  handleChange={onInputChange}
                  type="password"
                />
              )}
            </Grid>
            <div className={styles.buttons}>
              <div>
                <button className={styles.submitBtn}>
                  {isSignup ? "Sign Up" : "Sign In"}
                </button>
              </div>
              <div>
                <GoogleLogin
                  clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                  render={(renderProps) => (
                    <button
                      className={styles.googleBtn}
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                    >
                      <span style={{ marginLeft: "10px" }}>Google</span>
                    </button>
                  )}
                  onSuccess={googleSuccess}
                  onFailure={googleError}
                  cookiePolicy="single_host_origin"
                />
              </div>
            </div>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Button onClick={switchMode}>
                  {isSignup
                    ? "Already have an account? Sign in"
                    : "Don't have an account? Sign Up"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </React.Fragment>
  );
}

export default Login;
