import { Circles } from "react-loader-spinner";
import styles from "./Loader.module.css";
import React from "react";

const Loader = ({ text }) => {
  return (
    <div className={styles.loader}>
      <h1>{text}</h1>
      <Circles
        height="80"
        width="80"
        color="#4fa94d"
        ariaLabel="circles-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </div>
  );
};

export default Loader;
