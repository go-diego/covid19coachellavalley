import React from "react";
import styles from "./BackgroundImage.module.scss";

function BackgroundImage(props) {
  return (
    <div
      className={styles.BackgroundImage}
      style={{
        "--image": `url(${props.image})`,
        "--opacity": props.opacity
      }}
    ></div>
  );
}

export default BackgroundImage;
