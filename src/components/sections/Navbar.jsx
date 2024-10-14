import React from "react";
import LoginButton from "../buttons/LoginButton";
import SignupButton from "../buttons/SignupButton";
import css from "./Navbar.module.css";
import ProfileBar from "./ProfileBar";

export default function Navbar({ isLogin }) {
  return (
    <nav className={css.navbar}>
      <ul className={css.navMain}>
        <li className={css.navItem}>
          <a href="#" className={css.navLink}>
            Home
          </a>
        </li>
        <li className={css.navItem}>
          <a href="#" className={css.navLink}>
            Blogs
          </a>
        </li>
        <li className={css.navItem}>
          <a href="#" className={css.navLink}>
            Explore
          </a>
        </li>
        <li className={css.navItem}>
          <a href="#" className={css.navLink}>
            About
          </a>
        </li>
      </ul>
      <ul className={css.navRegister}>
        <li className={css.navItem}>
          <LoginButton isLogin={isLogin}></LoginButton>
        </li>
        {!isLogin && (
          <li className={css.navItem}>
            <SignupButton></SignupButton>
          </li>
        )}
        {isLogin && (
          <li className={css.navItem}>
            <ProfileBar>
              
            </ProfileBar>
          </li>
        )}
      </ul>
    </nav>
  );
}
