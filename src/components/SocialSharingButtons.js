import React from "react";
import { Twitter, Facebook, Linkedin, Mail } from "react-social-sharing";
import { PAGE_TITLE } from "../pages/index";
import styles from "./SocialSharingButtons.module.scss";

export default function SocialSharingButtons() {
  return (
    <div className={styles.SocialSharingButtons}>
      <Twitter solid small message={PAGE_TITLE} link="https://covid19cv.info" />
      <Facebook solid small link={PAGE_TITLE} />
      <Linkedin
        solid
        small
        message={PAGE_TITLE}
        link="https://covid19cv.info"
      />
      <Mail solid small subject={PAGE_TITLE} link="https://covid19cv.info" />
    </div>
  );
}
