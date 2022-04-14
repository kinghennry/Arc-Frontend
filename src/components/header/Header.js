import React from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import decode from "jwt-decode";
import styles from "./Header.module.css";
import { useLocation } from "react-router-dom";
import {
  Button,
  ClickAwayListener,
  Grow,
  Paper,
  Popper,
  MenuItem,
  MenuList,
  Avatar,
} from "@material-ui/core";
import { setLogout } from "../../features/authSlice";
import { makeStyles } from "@material-ui/core/styles";
import { setUser } from "../../features/authSlice";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  paper: {
    marginRight: theme.spacing(2),
  },
}));

const Header = () => {
  const user = JSON.parse(localStorage.getItem("profile"));
  const location = useLocation();
  //   const { user } = useSelector((state) => ({ ...state.auth }));
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(setUser(user));
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const token = user?.token;
  if (token) {
    const decodedToken = decode(token);

    if (decodedToken.exp * 1000 < new Date().getTime()) {
      dispatch(setLogout());
    }
  }
  const handleLogout = () => {
    dispatch(setLogout());
    window.location.reload();
  };

  const history = useHistory();
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const openLink = (link) => {
    history.push(`/${link}`);
    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  if (!user)
    return (
      <div className={styles.header2}>
        <img
          style={{ width: "160px", cursor: "pointer" }}
          onClick={() => history.push("/")}
          src="https://i.postimg.cc/C5fxh51H/Arc-Invoice-Logo2.png"
          alt="arc-invoice"
        />
        <button onClick={() => history.push("/login")} className={styles.login}>
          Get started
        </button>
      </div>
    );
  return (
    <React.Fragment>
      {user?.result?._id ? (
        <>
          <div className={styles.header}>
            <div className={classes.root}>
              <div>
                <Button
                  ref={anchorRef}
                  aria-controls={open ? "menu-list-grow" : undefined}
                  aria-haspopup="true"
                  onClick={handleToggle}
                >
                  <Avatar style={{ backgroundColor: "#1976D2" }}>
                    {user?.result?.name?.charAt(0)}
                  </Avatar>
                </Button>
                <Popper
                  open={open}
                  anchorEl={anchorRef.current}
                  role={undefined}
                  transition
                  disablePortal
                >
                  {({ TransitionProps, placement }) => (
                    <Grow
                      {...TransitionProps}
                      style={{
                        transformOrigin:
                          placement === "bottom"
                            ? "center top"
                            : "center bottom",
                      }}
                    >
                      <Paper elevation={3}>
                        <ClickAwayListener onClickAway={handleClose}>
                          <MenuList
                            autoFocusItem={open}
                            id="menu-list-grow"
                            onKeyDown={handleListKeyDown}
                          >
                            <MenuItem onClick={() => openLink("settings")}>
                              {user?.result?.name.split(" ")[0]}
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className={styles.header2}>
            <img
              style={{ width: "160px", cursor: "pointer" }}
              onClick={() => history.push("/")}
              src="https://i.postimg.cc/C5fxh51H/Arc-Invoice-Logo2.png"
              alt="arc-invoice"
            />
            <button
              onClick={() => history.push("/login")}
              className={styles.login}
            >
              Get started
            </button>
          </div>
        </>
      )}
    </React.Fragment>
  );
};

export default Header;
