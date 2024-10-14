import React from "react";
import css from "./ProfileBar.module.css";
export default function ProfileBar() {
  return (
    <span className={css.profileIcon}>
     Profile <i class="fas fa-user"></i>
    </span>
  );
}
