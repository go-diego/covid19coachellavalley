import React from "react";
import BackgroundImage from "./BackgroundImage";
import styles from "./Section.module.scss";

function Section(props) {
  const {
    color,
    size,
    backgroundImage,
    backgroundImageOpacity,
    children,
    // Passed to section element
    ...otherProps
  } = props;

  return (
    <section
      className={
        styles.SectionComponent +
        " hero section is-block is-relative" +
        (color ? ` is-${color}` : "") +
        (size ? ` is-${size}` : "")
      }
      {...otherProps}
    >
      {backgroundImage && (
        <BackgroundImage
          image={backgroundImage}
          opacity={backgroundImageOpacity}
        ></BackgroundImage>
      )}

      {props.children}
    </section>
  );
}

export default Section;
