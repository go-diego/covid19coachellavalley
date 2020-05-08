import Skeleton from "react-loading-skeleton";
import { cities } from "./CityListContainer";

const ListItemSkeleton = () => {
  return (
    <div style={{ display: "flex", margin: "1rem 0" }}>
      <div style={{ marginRight: "1rem" }}>
        <Skeleton circle={true} height={64} width={64} />
      </div>
      <div style={{ flexGrow: 1 }}>
        <Skeleton height={30} />
        <Skeleton height={30} />
      </div>
    </div>
  );
};

const ErrorMessage = () => {
  return (
    <div className="box has-background-light">
      <p className="heading has-text-danger">Oops!</p>
      <p>
        For some reason, city/community data is unavailable at the moment.
        Please try again later. If issues persist, please let Diego know at{" "}
        <a className="has-text-primary" href="mailto:hola@godiego.me">
          hola@godiego.me
        </a>
      </p>
    </div>
  );
};

const CityList = ({ data, isLoading, error }) => {
  if (error) return <ErrorMessage />;
  if (isLoading)
    return (
      <div style={{ padding: "1.25rem" }}>
        {cities.map((c, i) => (
          <ListItemSkeleton key={i} />
        ))}
      </div>
    );
  if (!isLoading && !error)
    return (
      <div className="box has-background-light">
        {data
          .sort((a, b) => a.NAME.toLowerCase() > b.NAME.toLowerCase())
          .map((datum, index) => {
            return (
              <article key={index} className="media">
                <figure className="media-left">
                  <p className="image is-64x64" style={{ overflow: "hidden" }}>
                    <img
                      alt={`${datum.NAME} image`}
                      className="is-rounded"
                      style={{ height: "100%", objectFit: "cover" }}
                      src={
                        cities.filter((city) => city.name === datum.NAME)[0]
                          .image ||
                        "https://bulma.io/images/placeholders/128x128.png"
                      }
                    />
                  </p>
                </figure>
                <div className="media-content" style={{ overflow: "hidden" }}>
                  <div className="content">
                    <p className="is-size-4 is-size-5-mobile">
                      {datum.NAME || "N/A"}
                    </p>
                  </div>
                  <div className="field is-grouped is-grouped-multiline">
                    <div className="control">
                      <div className="tags has-addons">
                        <span className="tag has-background-grey-lighter">
                          Cases
                        </span>
                        <span className="tag is-dark">
                          {datum.Point_Count === undefined
                            ? "N/A"
                            : datum.Point_Count}
                        </span>
                      </div>
                    </div>
                    <div className="control">
                      <div className="tags has-addons">
                        <span className="tag has-background-grey-lighter">
                          Deaths
                        </span>
                        <span className="tag is-danger">
                          {datum.SUM_Deceased === undefined
                            ? "N/A"
                            : datum.SUM_Deceased}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
      </div>
    );
};

export default CityList;
