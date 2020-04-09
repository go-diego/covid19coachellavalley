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
        <small style={{ marginBottom: "0.5rem", textAlign: "justify" }}>
          Data for the Riverside County is sourced from WHO, CDC, ECDC, NHC,
          DXY, 1point3acres, Worldometers.info, BNO, state and national
          government health departments, and local media reports and is compiled
          and maintained by{" "}
          <a
            href="https://systems.jhu.edu/"
            target="_target"
            rel="noopener noreferrer"
          >
            the Center for Systems Science and Engineering (CSSE)
          </a>{" "}
          at the John Hopkins University.
        </small>
        <small style={{ marginBottom: "2rem", textAlign: "justify" }}>
          Data for cities and unincorporated communities of the Coachella Valley
          is compiled and maintained by{" "}
          <a
            href="https://rivcoph.org/"
            target="_target"
            rel="noopener noreferrer"
          >
            Riverside University Health System-Public Health.
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
