import React from "react";
import { Twitter, Facebook, Linkedin, Mail } from "react-social-sharing";
import { PAGE_TITLE } from "../pages/index";
import styles from "./SocialSharingButtons.module.scss";

export default function SocialSharingButtons() {
  return (
    <div className={styles.SocialSharingButtons}>
      <Twitter
        solid
        small
        message={PAGE_TITLE}
        link="https://www.covid19cv.info"
      />
      <Facebook solid small link="https://www.covid19cv.info" />
      <Linkedin
        solid
        small
        message={PAGE_TITLE}
        link="https://www.covid19cv.info"
      />
      <Mail
        solid
        small
        subject={PAGE_TITLE}
        link="https://www.covid19cv.info"
      />
    </div>
  );
}
