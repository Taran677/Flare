import React, { useEffect } from "react";
import css from "./Hero.module.css";
import GetStarted from "../buttons/GetStarted";
import LearnMore from "../buttons/LearnMore";
import SideNav from "./SideNav";
import CardContainer from "../Cards/CardContainer";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";
export default function Hero({ isLogin, username, setIsLogin, profile, nickname, setNickname }) {
const navigate = useNavigate();


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
        <SideNav isLogin={isLogin} setIsLogin={setIsLogin}></SideNav>

        <div className={css.mainHero}>
          <CardContainer
            content={{
              index: 0,
              heading: "Welcome Back ",
              spanElement1: nickname,
              spanElement2: username,
              bottomLine: "Create New Post",
              profile,
              navigate,
              greet: true,
            }}
          ></CardContainer>
        </div>
      </main>
    );
  }
}
