import React from "react";
import ky from "ky/umd";
import CityList from "./CityList";

const initialState = {
  isLoading: true,
  error: null,
  data: null
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SUCCESS":
      return {
        ...state,
        isLoading: false,
        data: action.payload
      };
    case "FAIL":
      return {
        ...state,
        isLoading: false,
        data: null,
        error: action.payload
      };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
};

export const cities = [
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

const CityListContainer = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  React.useEffect(() => {
    async function getData() {
      try {
        const url = `https://services1.arcgis.com/pWmBUdSlVpXStHU6/arcgis/rest/services/Riverside_County_COVID19_Cases_Public/FeatureServer/1/query?f=json&where=(${getCitiesQuery()})&outFields=*`;
        const data = await ky.get(url).json();
        dispatch({
          type: "SUCCESS",
          payload: data.features.map((feature) => feature.attributes)
        });
      } catch (e) {
        dispatch({ type: "FAIL", payload: e });
      }
    }
    getData();
  }, []);

  return (
    <CityList
      data={state.data}
      isLoading={state.isLoading}
      error={state.error}
    />
  );
};

export default CityListContainer;
