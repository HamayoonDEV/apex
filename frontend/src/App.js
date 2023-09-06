import styles from "./App.module.css";
import Navbar from "./components/navBar/Navbar";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Crypto from "./components/Crypto/Crypto";
import Blog from "./components/Blog/Blog";
import SubmitBlog from "./components/SubmitBlog/SubmitBlog";
import Protected from "./components/Protected/Protected";
import Login from "./components/Login/Login";
import Error from "./components/Error/Error";
import { useSelector } from "react-redux";
import Signup from "./components/Signup/Signup";

function App() {
  const isAuth = useSelector((state) => state.user.auth);
  return (
    <div className={styles.app}>
      {" "}
      <div className={styles.navbar}>
        <Navbar />
      </div>
      <div className={styles.content}>
        <Routes>
          <Route path="login" exact element={<Login />} />
          <Route path="signup" exact element={<Signup />} />
          <Route path="/" exact element={<Home />} />
          <Route path="crypto" exact element={<Crypto />} />
          <Route
            path="blog"
            exact
            element={
              <Protected isAuth={isAuth}>
                <Blog />
              </Protected>
            }
          />
          <Route
            path="submit"
            exact
            element={
              <Protected isAuth={isAuth}>
                <SubmitBlog />
              </Protected>
            }
          />
          <Route path="*" element={<Error />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
