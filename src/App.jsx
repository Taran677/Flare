import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";

import "./App.css";
import css from "./App.module.css";
import Hero from "./components/sections/Hero";
import Navbar from "./components/sections/Navbar";
import Login from "./components/LoginComponents/Login";
import Signup from "./components/LoginComponents/Signup";
import Loading from "./components/Auxilliary/Loading";

const useAuthCheck = (setIsLogin) => {
  const navigate = useNavigate(); // This hook must be inside a Router
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:3000/protected", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to authenticate");
        }

        const data = await response.json();

        if (data.message === "You have access to this protected route!") {
          setIsLogin(true);
     
        } else {
          setIsLogin(false);
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        setIsLogin(false);
      }
    };

    checkAuth(); // Trigger auth check
  }, [location, navigate, setIsLogin]);
};

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [userName, setUsername] = useState("Taran");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    console.log(isLogin);
  }, []);
  return (
    <Router>
      <AuthWrapper setIsLogin={setIsLogin} />
      <div className={css.app}>
        <Navbar isLogin={isLogin} setIsLogin={setIsLogin} userName={userName} />
        <Routes>
          <Route path="/" element={<Hero isLogin={isLogin} />} />
          <Route
            path="/login"
            element={<Login loading={loading} setLoading={setLoading} setIsLogin={setIsLogin} />}
          />
          <Route
            path="/signup"
            element={<Signup loading={loading} setLoading={setLoading} />}
          />
        </Routes>
      </div>
      {loading && <Loading />}
    </Router>
  );
}

function AuthWrapper({ setIsLogin }) {
  useAuthCheck(setIsLogin); 
  return null;
}

export default App;
