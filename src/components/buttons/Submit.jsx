import React from "react";
import css from "./Submit.module.css";
export default function Submit({ text }) {
  return <button className={css.submit}>{text || "Submit"}</button>;
}
