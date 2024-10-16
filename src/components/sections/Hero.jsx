import React, { useEffect } from "react";
import css from "./Hero.module.css";
import GetStarted from "../buttons/GetStarted";
import LearnMore from "../buttons/LearnMore";
import SideNav from "./SideNav";
import CardContainer from "../Cards/CardContainer";

export default function Hero({ isLogin, userName, profile }) {

  if (!isLogin) {
    return (
      <main className={css.hero}>
        <div className={css.textMain}>
          <span className={css.smallText}>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
          </span>
          <h1 className={css.mainHead}>Write Smarter, Not Harder</h1>
          <span className={css.mediumText}>Lorem Ipsum Dolor Sit</span>
          <div className={css.buttonPlate}>
            <GetStarted />
            <LearnMore />
          </div>
        </div>
        <div className={css.illusMain}>
          <img
            src="./heroill.svg"
            alt="image not loaded properly"
            className={css.illusMainImg}
          />
        </div>
      </main>
    );
  } else {
    return (
      <main className={css.loginHero}>
        <SideNav></SideNav>

        <div className={css.mainHero}>
          <CardContainer
            content={{
              index: 0,
              heading: "Welcome Back ",
              spanElement1: userName,
              bottomLine: "Create New Post",
              picture1: profile,
            }}
          ></CardContainer>
        </div>
      </main>
    );
  }
}
