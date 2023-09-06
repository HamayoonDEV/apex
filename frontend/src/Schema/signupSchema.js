import * as yup from "yup";
const passwordPattren =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ -/:-@\[-`{-~]).{5,25}$/;
const error = "use uppercase,lowercase and digits";
const signupSchema = yup.object().shape({
  name: yup.string().max(30).required("name is requried!"),
  username: yup.string().min(5).max(30).required("username is required!"),
  email: yup
    .string()
    .email("enter a valid email")
    .required("email is required!"),
  password: yup
    .string()
    .min(5)
    .max(25)
    .matches(passwordPattren, { message: error })
    .required("password is required!"),
});

export default signupSchema;
