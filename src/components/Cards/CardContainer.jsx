import React from "react";
import styles from "./common.module.css";
import css from "./CardContainer.module.css";

export default function CardContainer({ content }) {
  if (content.index === 0) {
    return (
      <div className={`${styles.card} ${css.card1}`}>
        <div className={css.illusParent}>
          <img
            className={`${styles.illus} ${css.illus}`}
            src="./cat.svg"
            alt=""
          />
        </div>
        <div className={styles.row}>
          {" "}
          <h1 className={`${styles.mainHead} ${css.mainHead}`}>
            {content.heading}
            <span className={css.username}>{content.spanElement1}</span>!
          </h1>
          {content.picture1 && (
            <img
              className={styles.profilePic}
              src={content.picture1}
              alt="error loading profile picture"
            />
          )}
        </div>
        <div id="row2" className={styles.row}>
          {content.bottomLine && (
            <>
              <p className={styles.bottomLine}>{content.bottomLine}</p>
              <span className={styles.icon}>
                <i className="fa fa-plus"></i>
              </span>
            </>
          )}
        </div>
      </div>
    );
  } else if (content.index === 1) {
    // return (null)
  }
}
