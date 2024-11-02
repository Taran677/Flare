import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useLocation,
  useParams,
} from "react-router-dom";
import "sweetalert2/dist/sweetalert2.min.css";
import "./App.css";
import css from "./App.module.css";
import Hero from "./components/sections/Hero";
import Navbar from "./components/sections/Navbar";
import Login from "./components/LoginComponents/Login";
import Signup from "./components/LoginComponents/Signup";
import Loading from "./components/Auxilliary/Loading";
import BlogBase from "./components/BlogComponents/BlogBase";
import UserBlogs from "./components/BlogComponents/UserBlogs";
import BlogPost from "./components/Auxilliary/BlogPost";
import BlogPostPreview from "./components/BlogComponents/BlogPost";
const useAuthCheck = (setIsLogin, setNickname, setProfile, setUsername) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(
          "https://flare-jiql.onrender.com/auth/protected",
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("");
        }

        const data = await response.json();

        if (data.message === "User data retrieved successfully!") {
          setIsLogin(true);
          setNickname(data.nickname);
          setUsername(data.username);
          setProfile(data.profilePicture);
        } else {
          setIsLogin(false);
        }
      } catch (error) {
        console.error("Error verifying token:", error);

        setIsLogin(false);
      }
    };

    checkAuth();
  }, [location, navigate, setIsLogin, setUsername]);
};

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [nickname, setNickname] = useState("Taran");
  const [username, setUsername] = useState("Taran");
  const [profile, setProfile] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <Router>
      <AuthWrapper
        setIsLogin={setIsLogin}
        setNickname={setNickname}
        setProfile={setProfile}
        setUsername={setUsername}
      />

      <div className={css.app}>
        <Navbar isLogin={isLogin} setIsLogin={setIsLogin} nickname={nickname} />
        <Routes>
          <Route
            path="/"
            element={
              <Hero
                setIsLogin={setIsLogin}
                isLogin={isLogin}
                nickname={nickname}
                username={username}
                setUsername={setUsername}
                profile={profile}
              />
            }
          />
          <Route
            path="/login"
            element={
              <Login
                loading={loading}
                setLoading={setLoading}
                setIsLogin={setIsLogin}
              />
            }
          />
          <Route
            path="/signup"
            element={<Signup loading={loading} setLoading={setLoading} />}
          />
          <Route
            path="/blog/new"
            element={<BlogBase loading={loading} setLoading={setLoading} />}
          />

          <Route path="/:username/blog/:slug" element={<BlogPost />} />

          <Route
            path="/blog/edit/:slug"
            element={<BlogBase loading={loading} setLoading={setLoading} />}
          />
          <Route
            path="/user/blogs"
            element={<UserBlogs loading={loading} setLoading={setLoading} />}
          />
          <Route
            path="/blog/:slug"
            element={
              <BlogPostPreview loading={loading} setLoading={setLoading} />
            }
          />
        </Routes>
      </div>
      {loading && <Loading />}
    </Router>
  );
}

function AuthWrapper({ setIsLogin, setNickname, setProfile, setUsername }) {
  useAuthCheck(setIsLogin, setNickname, setProfile, setUsername);
  return null;
}

export default App;
