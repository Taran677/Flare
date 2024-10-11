import React from "react";
import css from "./LoginButton.module.css"
import styles from "./common.module.css"
export default function LoginButton() {
  return (
 
      <button className={`${css.loginButton} ${styles.loginButton}`}>Login</button>
  );
}
