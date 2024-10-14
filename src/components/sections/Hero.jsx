import React from "react";
import css from "./Hero.module.css";
import GetStarted from "../buttons/GetStarted";
import LearnMore from "../buttons/LearnMore";


export default function Hero({isLogin}) {
  return (
    !isLogin && <main className={css.hero}>
      <div className={css.textMain}>
        <span className={css.smallText}>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit.
        </span>
        <h1 className={css.mainHead}> Write Smarter, Not Harder </h1>
        <span className={css.mediumText}>Lorem Ipsum Dolor Sit</span>
        <div className={css.buttonPlate}>
          <GetStarted></GetStarted>
          <LearnMore></LearnMore>
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
}
