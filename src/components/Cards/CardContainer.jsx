import React, { useState, useEffect } from "react";
import styles from "./common.module.css";
import css from "./CardContainer.module.css";

// Example usage

export default function CardContainer({ content }) {
  const [greet, setGreet] = useState("Hello!");
  const viewImage = () => {
    swal({
      title: "Image Preview",
      text: "profile",
      icon: content.profile ? content.profile : `./profileDefault.svg`,
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: "Preview Image",
    });
  };
  // Function to get the appropriate greeting based on time
  function getGreeting() {
    const currentHour = new Date().getHours();
    let greeting;

    if (currentHour < 6) {
      greeting = "Why are you up so early? Good Morning!";
    } else if (currentHour < 12) {
      greeting = "Rise and shine! Good Morning!";
    } else if (currentHour < 15) {
      greeting = "Hope you're having a great day! Good Afternoon!";
    } else if (currentHour < 18) {
      greeting = "Good Afternoon! Keep up the good work!";
    } else if (currentHour < 21) {
      greeting = "Good Evening! How was your day?";
    } else {
      greeting = "It's getting late! Good Night!";
    }

    setGreet(greeting); // Update the state with the greeting
  }

  // Call getGreeting when the component mounts
  useEffect(() => {
    getGreeting();
  }, []); // Empty dependency array means it runs only once on mount

  if (content.index === 0) {
    return (
      <div className={`${styles.card} ${css.card1}`}>
        {" "}
        <div className={css.illusParent}>
          <img
            className={`${styles.illus} ${css.illus}`}
            src="./cat.svg"
            alt="cat illustration"
          />
        </div>
        <div className={`${styles.column} ${css.column}`}>
          <div className={`${styles.row} ${css.rowHeading}`}>
            <div className={css.header}>
              <h1 className={`${styles.mainHead} ${css.mainHead}`}>
                {content.heading}
                <span className={css.username}>{content.spanElement1}</span>!
              </h1>
              <span className={css.usernameOriginal}>
                {content.spanElement2}
              </span>
            </div>
            {content.profile && (
              <img
                className={styles.profilePic}
                onClick={viewImage}
                src={`${content.profile}`}
                alt="Profile Picture"
              />
            )}
            {!content.profile && (
              <img
                className={styles.profilePic}
                onClick={() => viewImage}
                src={`./profileDefault.svg`}
                alt="Profile Picture"
              />
            )}
          </div>

          <div id="row3" className={`${styles.row} ${css.greetingRow}`}>
            {content.greet && (
              <>
                <p className={`${styles.greet} ${css.greet}`}>{greet}</p>
              </>
            )}
          </div>
          <div id="row2" className={styles.row}>
            {content.bottomLine && (
              <>
                <p className={`${styles.bottomLine} ${css.bottomLine}`}>
                  {content.bottomLine}
                </p>
                <span className={styles.icon} onClick={()=>content.navigate("/blog/new")}>
                  <i className="fa fa-plus"></i>
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  } else if (content.index === 1) {
    // Return other content if needed
    return null;
  }

  return null;
}
