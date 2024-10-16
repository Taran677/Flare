import React, { useState } from "react";
import css from "./common.module.css";
import LoginButton from "../buttons/LoginButton";
import SignupButton from "../buttons/SignupButton";
import swal from "sweetalert";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      console.error("Please fill in all fields");
    } else {
      try {
        const response = await fetch("http://localhost:3000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          // console.log("Login successful:", data);
          swal("Success", "Login successful", "success");
        } else {
          // console.error("Login failed:", data.message);
          swal("Oops!", `${data.message}`, "error");
        }
      } catch (error) {
        console.error("Error during login request:", error);
        swal("Oops", "Something went wrong!", "error");
      }

      setEmail("");
      setPassword("");
    }
  };

  return (
    <>
      <div className={css.loginDiv}>
        <span className={css.welcomeBackTo}>WELCOME BACK TO</span>{" "}
        <img
          className={css.campingIllus}
          src="./camping.svg"
          alt="error loading image"
        />
        <span className={css.welcombackto2}>WELCOME BACK TO</span>
        <h1 className={css.mainHead}>
          Flare <img src="./logo.png" alt="Flare_Logo" className={css.logo} />
        </h1>
        <form className={css.form} onSubmit={handleSubmit}>
          {" "}
          <h2 className={css.loginHead}>LOGIN</h2>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={css.input}
            placeholder="john@example.com"
            required
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            placeholder="************"
            onChange={(e) => setPassword(e.target.value)}
            className={css.input}
            required
          />
          <LoginButton></LoginButton>
        </form>
        <div className={css.SignUp}>
          <h2>New to Flare?</h2>
          <p>Sign up and discover a great amount of new opportunities!</p>
          <SignupButton></SignupButton>
        </div>
      </div>
    </>
  );
}
