import { useState } from "react";
import "./App.css";
import css from "./App.module.css";

import Hero from "./components/sections/Hero";
import Navbar from "./components/sections/Navbar";

function App() {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <>
      <Navbar isLogin={isLogin}></Navbar>
      <Hero isLogin={isLogin}></Hero>
    </>
  );
}

export default App;
