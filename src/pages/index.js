import React from "react";
import ky from "ky/umd";
import { format } from "date-fns";
import Footer from "./../components/Footer";
import HeroSection2 from "../components/HeroSection2";
import Loader from "../components/Loader";
import SocialSharingButtons from "../components/SocialSharingButtons";
import InstallPrompt from "../components/InstallPrompt";
import InstallInstructionsForSafari from "../components/InstallInstructionsForSafari";
import useAddToHomeScreenPrompt from "../components/useAddToHomeScreenPrompt";
import AppHead from "../components/AppHead";

const cities = [
  {
    name: "Mecca",
    image: "images/mecca.png"
  },
  {
    name: "Indian Wells",
    image: "images/indian-wells.png"
  },
  {
    name: "Thousand Palms",
    image: "images/thousand-palms.png"
  },
  {
    name: "Bermuda Dunes",
    image: "images/bermuda-dunes.png"
  },
  {
    name: "North Shore",
    image: "images/north-shore.png"
  },
  {
    name: "Palm Springs",
    image: "images/palm-springs.png"
  },
  {
    name: "Desert Hot Springs",
    image: "images/desert-hot-springs.png"
  },
  {
    name: "Rancho Mirage",
    image: "images/rancho-mirage.png"
  },
  {
    name: "La Quinta",
    image: "images/la-quinta.png"
  },
  {
    name: "Coachella",
    image: "images/coachella.png"
  },
  {
    name: "Cathedral City",
    image: "images/cathedral-city.png"
  },
  {
    name: "Palm Desert",
    image: "images/palm-desert.png"
  },
  {
    name: "Thermal",
    image: "images/thermal.png"
  },
  {
    name: "Indio",
    image: "images/indio.png"
  },
  {
    name: "Oasis",
    image: ""
  },
  {
    name: "Sky Valley",
    image: "/images/sky-valley.jpg"
  }
];

const getCitiesQuery = () => {
  let qs = "";
  const citiesQS = cities
    .map((city) => city.name)
    .reduce((acc, curr, index) => {
      if (index !== cities.length - 1) return acc + `NAME='${curr}' OR `;
      return acc + `NAME='${curr}'`;
    }, qs);
  return citiesQS;
};

const covidCasesByCityUrl = `https://services1.arcgis.com/pWmBUdSlVpXStHU6/arcgis/rest/services/COVID_CASES_CDP_Public/FeatureServer/0/query?f=json&where=(${getCitiesQuery()})&outFields=*`;
const covidCasesMetadataByCityUrl = `https://services1.arcgis.com/pWmBUdSlVpXStHU6/arcgis/rest/services/COVID_CASES_CDP_Public/FeatureServer/0/query?f=json&where=(${getCitiesQuery()})&outFields=*&groupByFieldsForStatistics=Age_Stat`;
const covidCasesByCountyUrl =
  "https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/ncov_cases_US/FeatureServer/0/query?f=json&where=(Combined_Key LIKE '%Riverside%' AND Province_State='California')&outFields=*";

// NOTE: ES2020 will have support for this
const reflect = (p) =>
  p.then(
    (data) => ({ data, status: "fulfilled" }),
    (data) => ({ data, status: "rejected" })
  );

function IndexPage() {
  const [prompt, promptToInstall] = useAddToHomeScreenPrompt();
  const [cityLevelData, setCityLevelData] = React.useState(null);
  const [countyLevelData, setCountyLevelData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
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

  async function getData() {
    try {
      const covidCasesByCity = ky.post(covidCasesByCityUrl).json();
      // const covidCasesMetadataByCity = ky
      //   .post(covidCasesMetadataByCityUrl)
      //   .json();
      const covidCasesByCounty = ky.post(covidCasesByCountyUrl).json();

      const promises = [
        covidCasesByCity,
        //covidCasesMetadataByCity,
        covidCasesByCounty
      ].map(reflect);

      const response = await Promise.all(promises);

      const [
        covidCasesByCityResponse,
        //covidCasesMetadataByCityResponse,
        covidCasesByCountyResponse
      ] = response;

      // if both fail, show error page
      if (
        (covidCasesByCityResponse.data.error ||
          covidCasesByCityResponse.status === "rejected") &&
        (covidCasesByCountyResponse.data.error ||
          covidCasesByCountyResponse.status === "rejected")
      )
        setError(true);

      if (!covidCasesByCountyResponse.data.error)
        setCountyLevelData(
          covidCasesByCountyResponse.data.features[0].attributes
        );

      if (!covidCasesByCityResponse.data.error)
        setCityLevelData(
          covidCasesByCityResponse.data.features.map(
            (feature) => feature.attributes
          )
        );
    } catch (e) {
      console.log("OOPS", e);
      setError(true);
    }
    setIsLoading(false);
  }

  React.useEffect(() => {
    if (isLoading) {
      getData();
    }
  }, [isLoading]);

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
          <p style={{ textAlign: "justify", marginBottom: "1.5rem" }}>
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
          {error && (
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
          )}
          {!error && !isLoading && (
            <div style={{ width: "100%" }}>
              <div style={{ marginBottom: "1rem" }}>
                <span className="heading">Share ❤️</span>
                <SocialSharingButtons />
              </div>
              {countyLevelData && (
                <p className="heading has-text-weight-bold">{`Last Updated ${format(
                  new Date(countyLevelData.Last_Update),
                  "MM/dd/yyyy @ hh:mm aa"
                )}`}</p>
              )}
              {isInStandAloneMode() && (
                <button
                  title="Refresh Data"
                  onClick={() => setIsLoading(true)}
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
              {(countyLevelData && (
                <div className="box has-background-light">
                  <article className="media">
                    <figure className="media-left">
                      <p
                        className="image is-64x64"
                        style={{ overflow: "hidden" }}
                      >
                        <img
                          alt="Riverside County Logo"
                          className="is-rounded"
                          style={{ height: "100%", objectFit: "cover" }}
                          src="/images/riverside-county.png"
                        />
                      </p>
                    </figure>
                    <div
                      className="media-content"
                      style={{ overflow: "hidden" }}
                    >
                      <div className="content">
                        <p className="is-size-4 is-size-5-mobile">
                          {`${countyLevelData.Admin2} County`}
                        </p>
                      </div>
                      <div className="field is-grouped is-grouped-multiline">
                        <div className="control">
                          <div className="tags has-addons">
                            <span className="tag has-background-grey-lighter">
                              Cases
                            </span>
                            <span className="tag is-dark">
                              {countyLevelData.Confirmed}
                            </span>
                          </div>
                        </div>
                        <div className="control">
                          <div className="tags has-addons">
                            <span className="tag has-background-grey-lighter">
                              Deaths
                            </span>
                            <span className="tag is-danger">
                              {countyLevelData.Deaths}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </div>
              )) || (
                <div className="box has-background-light">
                  <p className="heading has-text-danger">Oops!</p>
                  <p>
                    For some reason, county data is unavailable at the moment.
                    Please try again later. If issues persist, please let Diego
                    know at{" "}
                    <a
                      className="has-text-primary"
                      href="mailto:hola@godiego.me"
                    >
                      hola@godiego.me
                    </a>
                  </p>
                </div>
              )}
              {(cityLevelData && (
                <div className="box has-background-light">
                  {cityLevelData
                    .sort((a, b) => a.NAME.toLowerCase() > b.NAME.toLowerCase())
                    .map((datum, index) => {
                      return (
                        <article key={index} className="media">
                          <figure className="media-left">
                            <p
                              className="image is-64x64"
                              style={{ overflow: "hidden" }}
                            >
                              <img
                                alt={`${datum.NAME} image`}
                                className="is-rounded"
                                style={{ height: "100%", objectFit: "cover" }}
                                src={
                                  cities.filter(
                                    (city) => city.name === datum.NAME
                                  )[0].image ||
                                  "https://bulma.io/images/placeholders/128x128.png"
                                }
                              />
                            </p>
                          </figure>
                          <div
                            className="media-content"
                            style={{ overflow: "hidden" }}
                          >
                            <div className="content">
                              <p className="is-size-4 is-size-5-mobile">
                                {datum.NAME}
                              </p>
                            </div>
                            <div className="field is-grouped is-grouped-multiline">
                              <div className="control">
                                <div className="tags has-addons">
                                  <span className="tag has-background-grey-lighter">
                                    Cases
                                  </span>
                                  <span className="tag is-dark">
                                    {datum.Point_Count}
                                  </span>
                                </div>
                              </div>
                              <div className="control">
                                <div className="tags has-addons">
                                  <span className="tag has-background-grey-lighter">
                                    Deaths
                                  </span>
                                  <span className="tag is-danger">
                                    {datum.Sum_Deceased}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                </div>
              )) || (
                <div className="box has-background-light">
                  <p className="heading has-text-danger">Oops!</p>
                  <p>
                    For some reason, city/community data is unavailable at the
                    moment. Please try again later. If issues persist, please
                    let Diego know at{" "}
                    <a
                      className="has-text-primary"
                      href="mailto:hola@godiego.me"
                    >
                      hola@godiego.me
                    </a>
                  </p>
                </div>
              )}
            </div>
          )}
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
