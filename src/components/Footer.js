import React from "react";
import Section from "./Section";
import styles from "./Footer.module.scss";

function Footer(props) {
  return (
    <Section
      color={props.color}
      size={props.size}
      backgroundImage={props.backgroundImage}
      backgroundImageOpacity={props.backgroundImageOpacity}
    >
      <div className={`${styles.FooterComponent__container} container content`}>
        <small style={{ marginBottom: "2rem", textAlign: "justify" }}>
          Data for cities and unincorporated communities of the Coachella Valley
          is compiled and maintained by{" "}
          <a
            className="has-text-link"
            href="https://rivcoph.org/"
            target="_target"
            rel="noopener noreferrer"
          >
            Riverside County Department of Public Health.
          </a>
        </small>

        <p className="has-text-centered">
          Made with <span>💗</span> in the Coachella Valley by{" "}
          <a
            className="has-text-primary has-text-weight-bold"
            href="https://godiego.me"
            target="_blank"
            rel="noopener noreferrer"
          >
            Diego Bernal
          </a>
        </p>
      </div>
    </Section>
  );
}

export default Footer;
