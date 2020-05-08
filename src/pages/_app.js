import React from "react";
import App from "next/app";
import { DataProvider } from "../components/DataProvider";
import "./../util/analytics.js";
import "./../styles/global-components.scss";
import "./../styles/global.scss";

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <>
        <DataProvider>
          <Component {...pageProps} />
        </DataProvider>
      </>
    );
  }
}

export default MyApp;
