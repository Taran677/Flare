import React from "react";
import css from "./SignupButton.module.css";
import styles from "./common.module.css";
import { useNavigate } from "react-router-dom";

export default function SignupButton() {
  const navigate = useNavigate();

  return (
    <button
      className={`${css.SignupButton} ${styles.SignupButton}`}
      id="signupbtn"
      onClick={() => navigate("../signup")}
    >
      Signup <i class="fas fa-user-plus"></i>
    </button>
  );
}
