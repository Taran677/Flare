import React from "react";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import css from "./LoginButton.module.css";
import styles from "./common.module.css";
export default function LoginButton({ isLogin, setIsLogin }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        swal("Success!", "Successfully logged out.", "success");
        setIsLogin(false);
        navigate("/");
      } else {
        const errorText = await response.text();
        console.error("Logout failed:", errorText);
        swal("Oops!", "Failed to log out. Please try again.", "error");
      }
    } catch (error) {
      console.error("Error during logout request:", error);
      swal(
        "Oops!",
        "An error occurred while logging out. Please try again.",
        "error"
      );
    }
  };

  const confirmLogout = () => {
    swal({
      title: "Are you sure?",
      text: "Do you want to logout?",
      icon: "warning",
      buttons: ["Cancel", "Yes, logout"],
      dangerMode: true,
    }).then((willLogout) => {
      if (willLogout) {
        handleLogout();
      }
    });
  };

  const handleClick = () => {
    if (isLogin) {
      confirmLogout();
    } else {
      navigate("/login");
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
