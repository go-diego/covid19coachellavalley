import React from "react";
import Head from "next/head";
import ky from "ky/umd";
import { format } from "date-fns";
import Footer from "./../components/Footer";
import HeroSection2 from "../components/HeroSection2";
import Loader from "../components/Loader";
import SocialSharingButtons from "../components/SocialSharingButtons";
import InstallPrompt from "../components/InstallPrompt";
import InstallInstructionsForSafari from "../components/InstallInstructionsForSafari";
import useAddToHomeScreenPrompt from "../components/useAddToHomeScreenPrompt";

export const PAGE_DESCRIPTION =
  "Get the latest Coronavirus (COVID-19) updates for the Coachella Valley";
export const PAGE_TITLE = "COVID-19 Coachella Valley Update";
const PAGE_IMAGE = "https://covid19cv.info/og-image.png";

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

const covidCasesByCityUrl = `https://services1.arcgis.com/pWmBUdSlVpXStHU6/arcgis/rest/services/COVID_CASES_CDP_PublicView/FeatureServer/1/query?f=json&where=(${getCitiesQuery()})&outFields=*`;
const covidCasesMetadataByCityUrl = `https://services1.arcgis.com/pWmBUdSlVpXStHU6/arcgis/rest/services/COVID_CASES_CDP_PublicView/FeatureServer/0/query?f=json&where=(${getCitiesQuery()})&outFields=*&groupByFieldsForStatistics=Age_Stat`;
const covidCasesByCountyUrl =
  "https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/ncov_cases_US/FeatureServer/0/query?f=json&where=(Combined_Key LIKE '%Riverside%' AND Province_State='California')&outFields=*";

function IndexPage() {
  const [prompt, promptToInstall] = useAddToHomeScreenPrompt();
  const [data, setData] = React.useState(null);
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

      const [
        covidCasesByCityResponse,
        //covidCasesMetadataByCityResponse,
        covidCasesByCountyResponse
      ] = await Promise.all([
        covidCasesByCity,
        //covidCasesMetadataByCity,
        covidCasesByCounty
      ]);

      //console.log("covidCasesByCityResponse", covidCasesByCityResponse);
      // console.log(
      //   "covidCasesMetadataByCityResponse",
      //   covidCasesMetadataByCityResponse
      // );
      //console.log("covidCasesByCountyResponse", covidCasesByCountyResponse);

      if (covidCasesByCityResponse.error && covidCasesByCountyResponse)
        setError(true);

      if (
        !covidCasesByCityResponse.error &&
        !covidCasesByCountyResponse.error
      ) {
        setData({
          cdpData: covidCasesByCityResponse.features.map(
            (feature) => feature.attributes
          ),
          countyData: covidCasesByCountyResponse.features[0].attributes
        });
      }
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
      <Head>
        <title>{PAGE_TITLE}</title>
        <meta
          name="keywords"
          content="COVID-19, Coronavirus, Coachella Valley, Riverside County"
        />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="description" content={PAGE_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <meta property="og:site_name" content={PAGE_TITLE} />
        <meta property="og:url" content="https://www.covid19cv.info" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={PAGE_DESCRIPTION} />
        <meta property="og:image" content={PAGE_IMAGE} />
        <meta property="og:image:width" content="528" />
        <meta property="og:image:height" content="528" />
        <meta name="twitter:image" content={PAGE_IMAGE} />
        <link rel="canonical" href="https://covid19cv.info" />
        <meta name="theme-color" content="#FFDD57" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-title"
          content="COVID-19 Coachella Valley Update"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link
          rel="apple-touch-startup-image"
          href="/apple-splash-2048-2732.png"
          media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/apple-splash-2732-2048.png"
          media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/apple-splash-1668-2388.png"
          media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/apple-splash-2388-1668.png"
          media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/apple-splash-1668-2224.png"
          media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/apple-splash-2224-1668.png"
          media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/apple-splash-1536-2048.png"
          media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/apple-splash-2048-1536.png"
          media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/apple-splash-1242-2688.png"
          media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/apple-splash-2688-1242.png"
          media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/apple-splash-1125-2436.png"
          media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/apple-splash-2436-1125.png"
          media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/apple-splash-828-1792.png"
          media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/apple-splash-1792-828.png"
          media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/apple-splash-1242-2208.png"
          media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/apple-splash-2208-1242.png"
          media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/apple-splash-750-1334.png"
          media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/apple-splash-1334-750.png"
          media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/apple-splash-640-1136.png"
          media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/apple-splash-1136-640.png"
          media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
        />
      </Head>
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
          {!isLoading && data && (
            <div style={{ width: "100%" }}>
              <div style={{ marginBottom: "1rem" }}>
                <span className="heading">Share ❤️</span>
                <SocialSharingButtons />
              </div>
              <p className="heading has-text-weight-bold">{`Last Updated ${format(
                new Date(data.countyData.Last_Update),
                "MM/dd/yyyy @ hh:mm aa"
              )}`}</p>
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
                  <div className="media-content" style={{ overflow: "hidden" }}>
                    <div className="content">
                      <p className="is-size-4 is-size-5-mobile">
                        {`${data.countyData.Admin2} County`}
                      </p>
                    </div>
                    <div className="field is-grouped is-grouped-multiline">
                      <div className="control">
                        <div className="tags has-addons">
                          <span className="tag has-background-grey-lighter">
                            Cases
                          </span>
                          <span className="tag is-dark">
                            {data.countyData.Confirmed}
                          </span>
                        </div>
                      </div>
                      <div className="control">
                        <div className="tags has-addons">
                          <span className="tag has-background-grey-lighter">
                            Deaths
                          </span>
                          <span className="tag is-danger">
                            {data.countyData.Deaths}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
              <div className="box has-background-light">
                {data.cdpData
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
