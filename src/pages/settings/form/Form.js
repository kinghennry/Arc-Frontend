/* eslint-disable */
import React, { useState, useEffect } from "react";
import { SEO } from "../../../components";
import { useDispatch, useSelector } from "react-redux";
import {
  getProfilesByUser,
  createProfile,
  updateProfile,
} from "../../../features/profileSlice";
import { toast } from "react-toastify";
import { Grid, Container, Paper, Avatar, Button } from "@material-ui/core";
import useStyles from "./styles";
import Input from "./Input";
import FileBase from "react-file-base64";
import { useLocation } from "react-router-dom";

const initialState = {
  name: "",
  phoneNumber: "",
  businessName: "",
  contactAddress: "",
  logo: "",
  website: "",
};

const Form = () => {
  const [form, setForm] = useState(initialState);
  const user = JSON.parse(localStorage.getItem("profile"));
  const location = useLocation();
  const userId = user?.result?._id;
  const dispatch = useDispatch();
  const classes = useStyles();
  const { userProfiles } = useSelector((state) => state.profile);
  const [switchEdit, setSwitchEdit] = useState(0);

  useEffect(() => {
    if (switchEdit === 1) {
      setForm(userProfiles);
    }
  }, [switchEdit]);
  useEffect(() => {
    dispatch(getProfilesByUser(userId));
    // eslint-disable-next-line
  }, [userId, location, switchEdit]);
  console.log(userProfiles);

  const profiles = userProfiles;

  const id = profiles?._id;
  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedFormData = {
      ...form,
      name: user?.result?.name,
    };
    if (id) {
      dispatch(updateProfile({ updatedFormData, toast, id }));
    } else {
      dispatch(createProfile({ updatedFormData, toast }));
    }
    setSwitchEdit(0);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  console.log(form);
  return (
    <React.Fragment>
      <SEO title="Settings" />
      {switchEdit === 0 && (
        <Container component="main" maxWidth="sm">
          <Paper className={classes.paper} elevation={2}>
            <Avatar
              style={{ width: "100px", height: "100px", margin: "30px" }}
              src={profiles?.logo}
              alt=""
              className={classes.avatar}
            ></Avatar>
            <p>{profiles?.businessName}</p>
            <p>{profiles?.contactAddress}</p>
            <p>{profiles?.phoneNumber}</p>
            <p>{profiles?.email}</p>
            <Button
              variant="outlined"
              style={{ margin: "30px", padding: "15px 30px" }}
              onClick={() => setSwitchEdit(1)}
            >
              Edit Profile
            </Button>
          </Paper>
        </Container>
      )}

      {/* {switchEdit === 1 && (
        <>
          {profiles?._id ? (
            <Container>
              <h1>Update Profile</h1>
            </Container>
          ) : (
            <Container component="main" maxWidth="sm">
              <Paper className={classes.paper} elevation={1}>
                <Avatar
                  style={{ width: "100px", height: "100px" }}
                  src={profiles?.logo}
                  alt=""
                  className={classes.avatar}
                ></Avatar>
                <form className={classes.form} onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <div
                      style={{
                        marginBottom: "20px",
                        height: "30px",
                      }}
                    >
                      <FileBase
                        type="file"
                        id="file"
                        required
                        multiple={false}
                        // onDone={({ base64 }) => setForm({ ...form, logo: base64 })}
                        onDone={({ base64 }) =>
                          setForm({ ...form, logo: base64 })
                        }
                      />
                    </div>
                    <Input
                      name="phoneNumber"
                      label="Phone Number"
                      handleChange={handleChange}
                      type="text"
                      half
                      value={form?.phoneNumber}
                    />
                    <Input
                      name="website"
                      label="Website"
                      handleChange={handleChange}
                      type="text"
                      half
                      value={form?.website}
                    />

                    <Input
                      name="businessName"
                      label="Business Name"
                      handleChange={handleChange}
                      type="text"
                      value={form?.businessName}
                    />
                    <Input
                      name="contactAddress"
                      label="Contact Address"
                      handleChange={handleChange}
                      type="text"
                      value={form?.contactAddress}
                    />
                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                  >
                    Update Settings
                  </Button>
                  <Grid container justifyContent="flex-end"></Grid>
                </form>
              </Paper>
            </Container>
          )} 
        </>
      )}

      */}
      {/* {switchEdit === 1 && (
        <Container component="main" maxWidth="sm">
          <Paper className={classes.paper} elevation={1}>
            <Avatar
              style={{ width: "100px", height: "100px" }}
              src={profiles?.logo}
              alt=""
              className={classes.avatar}
            ></Avatar>
            <form className={classes.form} onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <FileBase
                  type="file"
                  id="file"
                  required
                  multiple={false}
                  // onDone={({ base64 }) => setForm({ ...form, logo: base64 })}
                  onDone={({ base64 }) => setForm({ ...form, logo: base64 })}
                />
                <Input
                  name="email"
                  label="Email Address"
                  handleChange={handleChange}
                  type="email"
                  half
                  value={form?.email}
                />
                <Input
                  name="phoneNumber"
                  label="Phone Number"
                  handleChange={handleChange}
                  type="text"
                  half
                  value={form?.phoneNumber}
                />
                <Input
                  name="businessName"
                  label="Business Name"
                  handleChange={handleChange}
                  type="text"
                  value={form?.businessName}
                />
                <Input
                  name="contactAddress"
                  label="Contact Address"
                  handleChange={handleChange}
                  type="text"
                  value={form?.contactAddress}
                />
                <Input
                  name="website"
                  label="Website"
                  handleChange={handleChange}
                  type="text"
                  value={form?.website}
                />
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Update Settings
              </Button>
              <Grid container justifyContent="flex-end"></Grid>
            </form>
          </Paper>
        </Container>
      )} */}
    </React.Fragment>
  );
};

export default Form;
