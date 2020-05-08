import React from "react";
import Footer from "./../components/Footer";
import HeroSection2 from "../components/HeroSection2";
import SocialSharingButtons from "../components/SocialSharingButtons";
import InstallPrompt from "../components/InstallPrompt";
import InstallInstructionsForSafari from "../components/InstallInstructionsForSafari";
import useAddToHomeScreenPrompt from "../components/useAddToHomeScreenPrompt";
import AppHead from "../components/AppHead";
import CityListContainer from "../components/CityListContainer";
import CountyCardContainer from "../components/CountyCardContainer";

function IndexPage() {
  const [prompt, promptToInstall] = useAddToHomeScreenPrompt();
  const [showInstallPrompt, setShowInstallPrompt] = React.useState(false);
  const [showInstallInstructions, setShowInstallInstructions] = React.useState(
    true
  );

  const isSafari = () => {
    if (!process.browser) return false;
    return !!window.ApplePaySession;
  };

  const isSafariStandAlone = () =>
    process.browser ? Boolean(navigator.standalone) : false;

  const isInStandAloneMode = () => {
    if (!process.browser) return false;
    return (
      isSafariStandAlone() || matchMedia("(display-mode: standalone)").matches
    );
  };

  React.useEffect(() => {
    if (prompt) {
      setShowInstallPrompt(true);
    }
  }, [prompt]);

  React.useEffect(() => {
    const onAppInstalled = () => {
      console.log("appinstalled");
      setShowInstallPrompt(false);
      setShowInstallInstructions(false);
    };
    window.addEventListener("appinstalled", onAppInstalled);

    return () => window.removeEventListener("appinstalled", onAppInstalled);
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <main
      className={`${
        showInstallPrompt ||
        (showInstallInstructions && !isSafariStandAlone() && isSafari())
          ? "has-navbar-fixed-bottom"
          : ""
      }`}
    >
      <AppHead />
      <HeroSection2
        color="warning"
        backgroundImage=""
        backgroundImageOpacity={1}
        title="COVID-19 Updates 🦠"
        subtitle="For the Coachella Valley"
      />
      <section className="has-background-dark">
        <div
          className="is-flex has-text-light"
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <span className="heading is-marginless">Stay Home</span>
          <span style={{ margin: "0 0.25rem" }}>&bull;</span>
          <span className="heading is-marginless">Save Lives</span>
          <span style={{ margin: "0 0.25rem" }}>&bull;</span>
          <span className="heading is-marginless">Help Flatten the Curve</span>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <p style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            Look through the list of cities below to quickly find the current
            COVID-19 data for your city in or near the Coachella Valley.
          </p>
        </div>
        <div
          className="container"
          style={{
            minHeight: "calc(100vh - 525px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {/* {error && (
            <>
              <p className="heading has-text-danger has-text-weight-bold has-text-centered is-size-6">
                Error<span>☠️</span>
              </p>
              <p className="has-text-centered">
                Oops! Something went wrong. Please refresh the app. If all else
                fails, please let Diego know at{" "}
                <a className="has-text-primary" href="mailto:hola@godiego.me">
                  hola@godiego.me
                </a>
              </p>
            </>
          )}
          {isLoading && (
            <>
              <p className="heading">Loading</p>
              <Loader />
            </>
          )} */}
          <div style={{ width: "100%" }}>
            <div style={{ marginBottom: "1rem" }}>
              <span className="heading">Share ❤️</span>
              <SocialSharingButtons />
            </div>
            {isInStandAloneMode() && (
              <button
                title="Refresh Data"
                onClick={handleRefresh}
                className="button is-small is-dark is-outlined"
                style={{
                  borderRadius: "50%",
                  position: "absolute",
                  right: "3px",
                  top: "3px"
                }}
              >
                <span className="icon is-small">
                  <i className="fas fa-sync-alt"></i>
                </span>
              </button>
            )}
            <CountyCardContainer />
            <CityListContainer />
          </div>
        </div>
      </section>
      {showInstallPrompt && (
        <InstallPrompt
          handleHide={() => setShowInstallPrompt(false)}
          handleInstallApp={promptToInstall}
        />
      )}
      {showInstallInstructions && !isSafariStandAlone() && isSafari() && (
        <InstallInstructionsForSafari
          handleHide={() => setShowInstallInstructions(false)}
        />
      )}
      <Footer
        color="white"
        size="medium"
        backgroundImage=""
        backgroundImageOpacity={1}
      ></Footer>
    </main>
  );
}

export default IndexPage;
