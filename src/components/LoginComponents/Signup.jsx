import React, { useState } from "react";
import css from "./common.module.css";
import Submit from "../buttons/Submit";

export default function Signup() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <div className={css.SignupDiv}>
        {count === 0 && (
          <form
            className={css.form1}
            onSubmit={() => {
              setCount(count + (1 % 2));
            }}
          >
            <label>
              Enter Your Name
              <input
                className={css.input}
                type="text"
                required
                placeholder="John Doe"
              />
            </label>
            <label>
              Enter Username
              <input
                className={css.input}
                type="text"
                required
                placeholder="@John"
              />
            </label>
            <label>
              Enter Nickname
              <input
                className={css.input}
                type="text"
                required
                placeholder="Jo"
                maxLength={8}
              />
            </label>
            <Submit text={"Ok"}></Submit>
          </form>
        )}
        {count === 1 && (
          <form className={css.form2}>
            <label>
              Enter Birthday
              <input className={css.input} type="date" required />
            </label>
            <label>
              Enter a strong Password
              <input
                className={css.input}
                type="password"
                required
                placeholder="*********"
                minLength={6}
              />
            </label>
            <Submit text="Create Account!"></Submit>
          </form>
        )}
        <img className={css.ipods} src="./ipod.svg" alt="error loafing illustration" />
      </div>
    </div>
  );
}
