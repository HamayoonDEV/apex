import { configureStore } from "@reduxjs/toolkit";
import user from "./userSclice";

const store = configureStore({
  reducer: { user },
});

export default store;
