import React, { useState } from "react";
import css from "./SideNav.module.css";
export default function SideNav() {
  const [card1Visible, setCard1Visible] = useState(false);

  return (
    <nav className={css.sideNav}>
      <div className={`${css.navItem} ${card1Visible?css.cardColor:""}`}>
        <h2 className={css.navHead}>Account</h2>
        <span
          className={css.dropBtn}
          onClick={() => setCard1Visible(!card1Visible)}
        >
          <i
            className="fas fa-chevron-down"
            style={
              card1Visible
                ? { transform: "rotate(0deg)" }
                : { transform: "rotate(180deg)" }
            }
          ></i>
        </span>
        {card1Visible && (
          <ul className={css.dropList}>
            <li className={css.navLi}>Log Out</li>
            <li className={css.navLi}>Profile Picture</li>
            <li className={css.navLi}>Username</li>
            <li className={css.navLi}>Reset Password</li>
            <li className={css.navLi}>Delete Account</li>
          </ul>
        )}
      </div>
    </nav>
  );
}
