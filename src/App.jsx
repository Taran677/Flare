import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import css from "./App.module.css";
import profile from "./assets/profileDefault.svg";
import Hero from "./components/sections/Hero";
import Navbar from "./components/sections/Navbar";
import Login from "./components/LoginComponents/Login";
import Signup from "./components/LoginComponents/Signup";

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [userName, setUsername] = useState("Taran");

  return (
    <Router>
      <div className={css.app}>
        <Navbar isLogin={isLogin} setIsLogin={setIsLogin} userName={userName} />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;