import React from "react";
import styles from "./Settings.module.css";
import Form from "./form/Form";

const Settings = () => {
  return (
    <div className={styles.pageContainer}>
      <section className={styles.hero}>
        <h1>Profile Settings</h1>
        <div className={styles.paragraph}>
          <p>Edit/ update your business profile</p>
        </div>
      </section>
      <section className={styles.stat}>
        <Form />
      </section>
    </div>
  );
};

export default Settings;
