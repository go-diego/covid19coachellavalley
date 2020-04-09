import React from "react";
import "./../styles/global-components.scss";
import "./../styles/global.scss";
import Footer from "./../components/Footer";
import App from "next/app";
import "./../util/analytics.js";

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <>
        <Component {...pageProps} />
        <Footer
          color="white"
          size="medium"
          backgroundImage=""
          backgroundImageOpacity={1}
        ></Footer>
      </>
    );
  }
}

export default MyApp;
