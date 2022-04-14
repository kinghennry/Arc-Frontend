/* eslint-disable */
import React, { useEffect, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { createClient } from "../../features/clientSlice";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    backgroundColor: "#1976D2",
    marginLeft: 0,
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: "white",
  },
});

const MyDialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <DialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
});

const MyDialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
  },
}))(DialogContent);

const MyDialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(DialogActions);

const AddClient = ({ setOpen, open }) => {
  const [clientData, setClientData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const { name, phone, address, email } = clientData;
  const dispatch = useDispatch();

  const { error } = useSelector((state) => ({
    ...state.clients,
  }));

  useEffect(() => {
    error && toast.error(error);
  }, [error]);

  const handleClose = () => {
    setOpen(false);
  };

  const onInputChange = (e) => {
    let { name, value } = e.target;
    setClientData({ ...clientData, [name]: value });
  };

  const handleSubmitClient = (e) => {
    e.preventDefault();
    dispatch(createClient({ clientData, toast })).then(() => {
      handleClose();
      window.location.reload();
    });
    clear();
  };
  const clear = () => {
    setClientData({ name: "", email: "", phone: "", address: "" });
  };

  const inputStyle = {
    display: "block",
    padding: "1.4rem 0.75rem",
    width: "100%",
    fontSize: "0.8rem",
    lineHeight: 1.25,
    color: "#55595c",
    backgroundColor: "#fff",
    backgroundImage: "none",
    backgroundClip: "padding-box",
    borderTop: "0",
    borderRight: "0",
    borderBottom: "1px solid #eee",
    borderLeft: "0",
    borderRadius: "3px",
    transition: "all 0.25s cubic-bezier(0.4, 0, 1, 1)",
  };

  const focus = {
    "input:focus, textarea:focus": {
      outline: "0",
      borderBottomColor: "#ffab00",
    },
  };

  return (
    <div>
      <div>
        <Dialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
          fullWidth
        >
          <MyDialogTitle
            id="customized-dialog-title"
            onClose={handleClose}
            style={{ paddingLeft: "20px", color: "white" }}
          >
            New Customer
          </MyDialogTitle>
          <MyDialogContent dividers>
            <div className="customInputs">
              <input
                placeholder="Name"
                style={inputStyle}
                name="name"
                type="text"
                onChange={onInputChange}
                value={name}
              />

              <input
                placeholder="Email"
                style={inputStyle}
                name="email"
                type="text"
                value={email}
                onChange={onInputChange}
              />
              <input
                placeholder="Phone"
                style={inputStyle}
                name="phone"
                type="text"
                value={phone}
                onChange={onInputChange}
              />
              <input
                placeholder="Address"
                style={inputStyle}
                name="address"
                type="text"
                value={address}
                onChange={onInputChange}
              />
            </div>
          </MyDialogContent>
          <MyDialogActions>
            <Button
              autoFocus
              onClick={handleSubmitClient}
              variant="contained"
              style={{ marginRight: "25px" }}
            >
              Save Customer
            </Button>
          </MyDialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default AddClient;
