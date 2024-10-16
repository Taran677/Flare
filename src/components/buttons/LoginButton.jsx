import React from "react";
import css from "./LoginButton.module.css";
import styles from "./common.module.css";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
export default function LoginButton({ isLogin, setIsLogin }) {
  const navigate = useNavigate();

  const handleClick = async () => {
    if (isLogin) {
      try {
        const response = await fetch("http://localhost:3000/logout", {
          method: "POST",
          credentials: "include", 
        });

        if (response.ok) {
          swal("Success!", "Successsfuly logged out.", "success")
          setIsLogin(false);
          navigate('/'); 
        } else {
          console.error("Logout failed:", await response.text());
          swal("Oops!", "Failed to log out. Please try again.", "error"); 
        }
      } catch (error) {
        console.error("Error during logout request:", error);
        swal("Oops!", "An error occurred while logging out. Please try again.", "error");
      }
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
