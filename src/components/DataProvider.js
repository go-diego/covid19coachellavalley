import ky from "ky/umd";

const DataContext = React.createContext();

const initialState = {
  deaths: {
    isLoading: true,
    error: null,
    data: null
  },
  cases: {
    isLoading: true,
    error: null,
    data: null
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case "deaths/SUCCESS":
      return {
        ...state,
        deaths: {
          isLoading: false,
          data: action.payload
        }
      };
    case "deaths/FAIL":
      return {
        ...state,
        deaths: {
          isLoading: false,
          data: null,
          error: action.payload
        }
      };
    case "cases/SUCCESS":
      return {
        ...state,
        cases: {
          isLoading: false,
          data: action.payload
        }
      };
    case "cases/FAIL":
      return {
        ...state,
        cases: {
          isLoading: false,
          data: null,
          error: action.payload
        }
      };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
};

export const DataProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  React.useEffect(() => {
    async function getDeathsData() {
      const url =
        "https://services1.arcgis.com/pWmBUdSlVpXStHU6/arcgis/rest/services/COVID19_Deaths_DateReport/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=DateReported%20asc&outSR=102100&resultOffset=0&resultRecordCount=32000&resultType=standard&cacheHint=true";
      try {
        const data = await ky(url).json();
        dispatch({
          type: "deaths/SUCCESS",
          payload: data.features.map((f) => f.attributes)
        });
      } catch (error) {
        dispatch({
          type: "deaths/FAIL",
          payload: error
        });
      }
    }
    async function getCasesData() {
      const url =
        "https://services1.arcgis.com/pWmBUdSlVpXStHU6/arcgis/rest/services/COVID19_Cases_DateReport/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=DateReported%20asc&outSR=102100&resultOffset=0&resultRecordCount=32000&resultType=standard&cacheHint=true";
      try {
        const data = await ky(url).json();
        dispatch({
          type: "cases/SUCCESS",
          payload: data.features.map((f) => f.attributes)
        });
      } catch (error) {
        dispatch({
          type: "cases/FAIL",
          payload: error
        });
      }
    }

    getDeathsData();
    getCasesData();
  }, []);

  return <DataContext.Provider value={state}>{children}</DataContext.Provider>;
};

export const useData = () => React.useContext(DataContext);
