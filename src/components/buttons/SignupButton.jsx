import React from "react";
import css from "./SignupButton.module.css";
import styles from "./common.module.css";
export default function SignupButton() {
  return (
    <button className={`${css.SignupButton} ${styles.SignupButton}`} id="signupbtn">
      Signup
    </button>
  );
}
