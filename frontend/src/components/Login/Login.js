import React, { useState } from "react";
import styles from "./Login.module.css";
import TextInPut from "../TextInput/TextInPut";
import { useFormik } from "formik";
import loginSchema from "../../Schema/LoginSchema";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/internal";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/userSclice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState();

  const { values, touched, handleBlur, handleChange, errors } = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: loginSchema,
  });
  const handleLogin = async () => {
    try {
      const data = {
        username: values.username,
        password: values.password,
      };
      const response = await login(data);

      if (response.status === 200) {
        const user = {
          _id: response.data.user._id,
          username: response.data.user.username,
          password: response.data.user.password,
          auth: response.data.auth,
        };
        //update setuser
        dispatch(setUser(user));
        //navigate to home page
        navigate("/");
      } else if (response.code === "ERR_BAD_REQUEST") {
        //DISPLAY ERROR
        setError(response.response.data.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className={styles.div}>
      <h1 className={styles.h1}>Login</h1>
      <div className={styles.input}>
        <TextInPut
          type="text"
          name="username"
          placeholder="username"
          value={values.username}
          onBlur={handleBlur}
          onChange={handleChange}
          error={errors.username && touched.username ? 1 : undefined}
          errormessage={errors.username}
        />
        <TextInPut
          type="password"
          name="password"
          placeholder="password"
          value={values.password}
          onBlur={handleBlur}
          onChange={handleChange}
          error={errors.password && touched.password ? 1 : undefined}
          errormessage={errors.password}
        />
      </div>
      <div className={styles.button}>
        <button onClick={handleLogin}>Login</button>
        <span>
          don't have an account?{" "}
          <button onClick={() => navigate("/signup")}>Register</button>
        </span>
        {error != " " ? <p className={styles.errormessage}>{error}</p> : ""}
      </div>
    </div>
  );
};

export default Login;
