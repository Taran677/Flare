import React from "react";
import css from "./LoginButton.module.css";
import styles from "./common.module.css";
export default function LoginButton({ isLogin }) {
  return (
    <button className={`${css.loginButton} ${styles.loginButton}`}>
      {isLogin ? `Logout` : `Login`}{" "}
    </button>
  );
}
