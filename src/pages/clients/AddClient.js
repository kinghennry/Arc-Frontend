/* eslint-disable */
import React, { useState, useEffect } from "react";
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
import { toast } from "react-toastify";
import CloseIcon from "@material-ui/icons/Close";
import { useDispatch, useSelector } from "react-redux";
import { createClient, updatedClient } from "../../features/clientSlice";

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

function AddClient({ setOpen, open, currentId, setCurrentId }) {
  const [clientData, setClientData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const dispatch = useDispatch();
  const { name, phone, address, email } = clientData;
  const userClient = useSelector((state) =>
    currentId ? state.client.userClients.find((c) => c._id === currentId) : null
  );

  useEffect(() => {
    if (userClient) {
      setClientData(userClient);
    }
  }, [userClient]);

  const clear = () => {
    setCurrentId(null);
    setClientData({ name: "", email: "", phone: "", address: "" });
  };

  const id = currentId;
  const handleSubmitClient = (e) => {
    e.preventDefault();
    if (id) {
      //   dispatch(updatedClient({ id, clientData, toast }));
      dispatch(updatedClient({ id, clientData, toast })).then(() => {
        handleClose();
        window.location.reload();
      });
    } else {
      //   dispatch(createClient({ clientData, toast }));
      dispatch(createClient({ clientData, toast })).then(() => {
        handleClose();
        window.location.reload();
      });
    }

    clear();
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

  const onInputChange = (e) => {
    let { name, value } = e.target;
    setClientData({ ...clientData, [name]: value });
  };

  const handleClose = () => {
    setOpen(false);
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
            {currentId ? "Edit Customer" : "Add new Client"}
          </MyDialogTitle>
          <DialogContent dividers>
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
                onChange={onInputChange}
                value={email}
              />

              <input
                placeholder="Phone"
                style={inputStyle}
                name="phone"
                type="text"
                onChange={onInputChange}
                value={phone}
              />

              <input
                placeholder="Address"
                style={inputStyle}
                name="address"
                type="text"
                onChange={onInputChange}
                value={address}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleSubmitClient}
              variant="contained"
              style={{ marginRight: "25px" }}
            >
              {currentId ? "Edit Customer" : "Save Customer"}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default AddClient;
