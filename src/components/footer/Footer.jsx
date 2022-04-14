import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "./Footer.module.css";
import { FabButton } from "../../components/index";
import flag from "./nigeria.svg";
import { useDispatch } from "react-redux";
import { setUser } from "../../features/authSlice";

function Footer() {
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("profile"));
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setUser(user));
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);
  return (
    <footer>
      {/* should link to kelechi ogbu website. */}
      <a
        target="_blank"
        href="https://henry-ogbu.netlify.app/"
        rel="noreferrer"
        className={styles.footerText}
      >
        <span>&#169; {new Date().getFullYear()}.&nbsp;Made in</span> &nbsp;
        <img style={{ width: "30px" }} src={flag} alt="nigeria" /> &nbsp;
        <span>by {process.env.REACT_APP_NAME}</span>
      </a>

      {user?.result?._id && <FabButton />}
    </footer>
  );
}

export default Footer;
