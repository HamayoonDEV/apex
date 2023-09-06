import React from "react";
import styles from "./Signup.module.css";
import TextInPut from "../TextInput/TextInPut";
import { useFormik } from "formik";
import signupSchema from "../../Schema/signupSchema";
import { signup } from "../../api/internal";
import { setUser } from "../../store/userSclice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const { values, touched, handleBlur, handleChange, errors } = useFormik({
    initialValues: { name: "", username: "", email: "", password: "" },
    validationSchema: signupSchema,
  });
  const handleSignup = async () => {
    const data = {
      name: values.name,
      username: values.username,
      email: values.email,
      password: values.password,
    };
    const response = await signup(data);

    if (response.status === 201) {
      const user = {
        _id: response.data.user._id,
        username: response.data.user.username,
        password: response.data.user.password,
        auth: response.data.auth,
      };

      //update setUser state
      dispatch(setUser(user));
      //redirct to home page
      navigate("/");
    } else if (response.code === "ERR_BAD_REQUREST") {
      //DISPLAY ERROR
      setError(response.response.data.error);
    }
  };
  return (
    <div className={styles.main}>
      <div className={styles.heading}>
        <h1>Create Account</h1>
      </div>
      <div className={styles.text}>
        <TextInPut
          type="text"
          name="name"
          placeholder="name"
          value={values.name}
          onBlur={handleBlur}
          onChange={handleChange}
          error={errors.name && touched.name ? 1 : undefined}
          errormessage={errors.name}
        />
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
          type="email"
          name="email"
          placeholder="email"
          value={values.email}
          onBlur={handleBlur}
          onChange={handleChange}
          error={errors.email && touched.email ? 1 : undefined}
          errormessage={errors.email}
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
        <button onClick={handleSignup}>signup</button>
        <span>
          Already have an account? <button>Login</button>
        </span>
        {error != " " ? <p className={styles.errormessage}>{error}</p> : ""}
      </div>
    </div>
  );
};

export default Signup;
