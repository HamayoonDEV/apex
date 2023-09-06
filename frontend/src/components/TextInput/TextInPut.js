import React from "react";
import styles from "./TextInPut.module.css";
const TextInPut = (props) => {
  return (
    <div className={styles.main}>
      <input {...props} />
      {props.error && <p>{props.errormessage}</p>}
    </div>
  );
};

export default TextInPut;
