import * as yup from "yup";
const passwordPattren =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ -/:-@\[-`{-~]).{5,25}$/;
const error = "use uppercase,lowercase and digits";
const loginSchema = yup.object().shape({
  username: yup.string().min(5).max(30).required("username is required!"),
  password: yup
    .string()
    .min(5)
    .max(25)
    .matches(passwordPattren, { message: error })
    .required("password is required!"),
});

export default loginSchema;
