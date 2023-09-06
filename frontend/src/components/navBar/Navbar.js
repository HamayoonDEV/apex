import React from "react";
import styles from "./Navbar.module.css";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { signout } from "../../api/internal";
import { resetUser } from "../../store/userSclice";
import { useDispatch } from "react-redux";
const Navbar = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.user.auth);

  const handleSignOut = async () => {
    await signout();
    //resetUser state
    dispatch(resetUser());
  };
  return (
    <div className={styles.mainContainer}>
      <h1>
        <NavLink to="/">Apex</NavLink>
      </h1>
      <div>
        <NavLink to="/">Home</NavLink>
        <NavLink to="crypto">Crypto</NavLink>
        <NavLink to="blog">Blog</NavLink>
        <NavLink to="submit">SubmitBlog</NavLink>
      </div>
      <div>
        {!isAuth ? (
          <div>
            <NavLink to="login">
              <button>Login</button>
            </NavLink>
            <NavLink to="signup">
              <button>SignUp</button>
            </NavLink>
          </div>
        ) : (
          <div>
            <NavLink>
              <button onClick={handleSignOut}>SignOut</button>
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
