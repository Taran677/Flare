import React, { useState } from "react";
import css from "./common.module.css";
import Submit from "../buttons/Submit";
import swal from "sweetalert";

export default function Signup({ loading, setLoading }) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    nickname: "",
    birthday: "",
    email: "",
    password: "",
  });
  const [birthdayInputType, setBirthdayInputType] = useState("date");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBirthdayChange = (e) => {
    let value = e.target.value;
    if (birthdayInputType === "text") {
      const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
      if (dateRegex.test(value)) {
        const [day, month, year] = value.split("/");
        value = `${year}-${month}-${day}`; // Convert to yyyy-mm-dd for storage
      }
    }
    setFormData({ ...formData, birthday: value });
  };

  const handleRightClick = (e) => {
    e.preventDefault(); // Prevent the default right-click context menu
    setBirthdayInputType((prevType) => (prevType === "date" ? "text" : "date"));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 0) {
      setStep(1);
    } else {
      try {
        setLoading(true);
        const response = await fetch(
          "https://flare-jiql.onrender.com/auth/signup",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );
        const data = await response.json();
        if (response.ok) {
          swal("Success", "Account Created Successfully", "success");
        } else {
          swal("Oops!", `${data.message}`, "error");
        }
      } catch (error) {
        console.error("Error during signup request", error);
        swal("Oops!", "Error during signup request", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div>
      <div className={css.SignupDiv}>
        {step === 0 && (
          <form className={css.form1} onSubmit={handleSubmit}>
            <label>
              Enter Your Name
              <input
                className={css.input}
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
              />
            </label>
            <label>
              Enter Username
              <input
                className={css.input}
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="@John"
              />
            </label>
            <label>
              Enter Nickname
              <input
                className={css.input}
                type="text"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                required
                placeholder="Jo"
                maxLength={8}
              />
            </label>
            <Submit text="Ok" />
          </form>
        )}
        {step === 1 && (
          <form className={css.form2} onSubmit={handleSubmit}>
            <label>
              Enter Birthday{" "}
              <span className={css.info}>{`(Enter ${birthdayInputType})`}</span>
              <input
                className={css.input}
                type={birthdayInputType}
                name="birthday"
                value={
                  birthdayInputType === "text" && formData.birthday
                    ? formData.birthday.split("-").reverse().join("/")
                    : formData.birthday
                }
                onChange={handleBirthdayChange}
                onContextMenu={handleRightClick} // Right-click toggles input type
                max={today}
                required
                placeholder={birthdayInputType === "text" ? "dd/mm/yyyy" : ""}
              />
            </label>
            <label>
              Enter Email
              <input
                className={css.input}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Enter a strong Password
              <input
                className={css.input}
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="*********"
                minLength={6}
              />
            </label>
            <Submit text="Create Account!" />
          </form>
        )}
        <img
          className={css.ipods}
          src="./ipod.svg"
          alt="error loading illustration"
        />
      </div>
    </div>
  );
}
