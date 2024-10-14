import React, { useEffect, useState } from "react";
import LoginButton from "../buttons/LoginButton";
import SignupButton from "../buttons/SignupButton";
import css from "./Navbar.module.css";
import ProfileBar from "./ProfileBar";

export default function Navbar({ isLogin, setIsLogin }) {
  const [menuDisplay, setMenuDisplay] = useState(true);
  useEffect(() => {
    Window.onresize = () => {
      setMenuDisplay(true);
    };
  }, []);
  return (
    <nav className={css.navbar}>
      <ul className={css.menu}>
        <li
          className={css.menuItem}
          onClick={() => setMenuDisplay(!menuDisplay)}
        >
          <i class="fas fa-bars"></i>
        </li>{" "}
        {menuDisplay && (
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
        )}
      </ul>

      <ul className={css.navRegister}>
        <li className={css.navItem}>
          <LoginButton isLogin={isLogin} setIsLogin={setIsLogin}></LoginButton>
        </li>
        {!isLogin && (
          <li className={css.navItem}>
            <SignupButton></SignupButton>
          </li>
        )}
        {isLogin && (
          <li className={css.navItem}>
            <ProfileBar></ProfileBar>
          </li>
        )}
      </ul>
    </nav>
  );
}
