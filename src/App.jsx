import "./App.css";
import css from "./App.module.css";
import LoginButton from "./components/buttons/LoginButton";
import SignupButton from "./components/buttons/SignupButton";

function App() {
  return (
    <>
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
            <LoginButton></LoginButton>
          </li>
          <li className={css.navItem}>
           <SignupButton></SignupButton>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default App;
