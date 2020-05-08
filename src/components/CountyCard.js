import Skeleton from "react-loading-skeleton";
import { format } from "date-fns";
import { useData } from "../components/DataProvider";

const LevelItemSkeleton = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        margin: "0 0.5rem"
      }}
    >
      <Skeleton />
      <Skeleton height={30} />
      <Skeleton />
    </div>
  );
};

const ErrorMessage = () => {
  return (
    <div className="box has-background-light">
      <p className="heading has-text-danger">Oops!</p>
      <p>
        For some reason, county data is unavailable at the moment. Please try
        again later. If issues persist, please let Diego know at{" "}
        <a className="has-text-primary" href="mailto:hola@godiego.me">
          hola@godiego.me
        </a>
      </p>
    </div>
  );
};

const getLastUpdatedTime = (date) => format(new Date(date), "MM/dd/yyyy");

const CountyCard = () => {
  const appData = useData();
  if (!appData) return null;
  if (appData.cases.error || appData.deaths.error) return <ErrorMessage />;
  return (
    <div className="box has-background-light">
      <article className="media">
        <figure className="media-left">
          <p className="image is-64x64" style={{ overflow: "hidden" }}>
            <img
              alt="Riverside County Logo"
              className="is-rounded"
              style={{ height: "100%", objectFit: "cover" }}
              src="/images/riverside-county.png"
            />
          </p>
        </figure>
        <div className="media-content" style={{ overflow: "hidden" }}>
          <p className="is-size-4 is-size-5-mobile">Riverside County</p>
          {appData.cases.isLoading && <Skeleton />}
          {!appData.cases.isLoading && (
            <p className="heading has-text-weight-bold">{`Last Updated ${getLastUpdatedTime(
              appData.cases.data.slice(-1)[0].DateReported
            )}`}</p>
          )}
        </div>
      </article>
      <nav
        className="level is-mobile"
        style={{ marginTop: "0.5rem", justifyContent: "flex-start" }}
      >
        {appData.cases.isLoading && <LevelItemSkeleton />}
        {!appData.cases.isLoading && (
          <div className="level-item">
            <div>
              <p className="heading">Cases</p>
              <p className="title">
                {appData.cases.data
                  .slice(-1)[0]
                  .ReportedTotalCases.toLocaleString()}
              </p>
              <p
                title="New Cases Today"
                className="has-text-danger"
              >{`+${appData.cases.data
                .slice(-1)[0]
                .ReportedNewCases.toLocaleString()}`}</p>
            </div>
          </div>
        )}
        {appData.deaths.isLoading && <LevelItemSkeleton />}
        {!appData.deaths.isLoading && (
          <div className="level-item">
            <div>
              <p className="heading">Deaths</p>
              <p className="title">
                {appData.deaths.data
                  .slice(-1)[0]
                  .ReportedTotalDeaths.toLocaleString()}
              </p>
              <p
                title="New Deaths Today"
                className="has-text-danger"
              >{`+${appData.deaths.data
                .slice(-1)[0]
                .ReportedNewDeaths.toLocaleString()}`}</p>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default CountyCard;
