import React from "react";
import "./../styles/global-components.scss";
import "./../styles/global.scss";
import App from "next/app";
import "./../util/analytics.js";

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <>
        <Component {...pageProps} />
      </>
    );
  }
}

export default MyApp;
