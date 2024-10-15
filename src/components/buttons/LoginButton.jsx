import React from "react";
import css from "./LoginButton.module.css";
import styles from "./common.module.css";
import { useNavigate } from "react-router-dom";

export default function LoginButton({ isLogin, setIsLogin }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (isLogin) {
      setIsLogin(false);
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  return (
    <button
      className={`${css.loginButton} ${styles.loginButton}`}
      onClick={handleClick}
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