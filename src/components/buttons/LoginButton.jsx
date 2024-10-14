import React from "react";
import css from "./LoginButton.module.css";
import styles from "./common.module.css";
export default function LoginButton({ isLogin, setIsLogin }) {
  return (
    <button
      className={`${css.loginButton} ${styles.loginButton}`}
      onClick={() => setIsLogin(!isLogin)}
    >
      {isLogin ? (
        <>
          Logout <i className="fas fa-sign-out-alt"></i>
        </>
      ) : (
        <>
          Login <i className="fas fa-sign-in-alt"></i>
        </>
      )}
    </button>
  );
}
