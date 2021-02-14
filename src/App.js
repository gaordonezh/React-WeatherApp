//import Test from "./components/Test";
import React, { useState, useEffect } from "react";
import {
  TextField,
  Chip,
  Backdrop,
  CircularProgress,
  Typography,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import axios from "axios";
import moment from "moment";
import IconButton from "@material-ui/core/IconButton";
import "moment/locale/es";
import "./index.scss";

const api = {
  key: "58c43ddcca9340062dfd34d409cdda4c",
  base: "http://api.openweathermap.org/data/2.5",
};

const CssTextField = withStyles({
  root: {
    "& label.Mui-focused": {
      color: "white",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "white",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "white",
      },
      "&:hover fieldset": {
        borderColor: "white",
      },
      "&.Mui-focused fieldset": {
        borderColor: "white",
      },
    },
  },
})(TextField);

function App() {
  const [query, setQuery] = useState("Lima");
  const [weather, setWeather] = useState();
  const [loader, setLoader] = useState(true);
  const [first, setFirst] = useState(true);

  const _search = async () => {
    setLoader(true);
    try {
      await axios
        .get(
          `${api.base}/weather?q=${query}&lang=es&units=metric&APPID=${api.key}`
        )
        .then((res) => {
          setWeather(res.data);
        })
        .catch((error) => {
          setTimeout(() => setLoader(false), 2000);
        })
        .finally(() => {
          setTimeout(() => setLoader(false), 500);
          setFirst(false);
        });
    } catch (error) {
      setTimeout(() => setLoader(false), 5000);
    }
  };

  useEffect(() => {
    if (first) {
      _search();
    }
  }, []);

  return (
    <>
      <Backdrop open={loader} style={{ zIndex: "1" }}>
        <CircularProgress
          disableShrink
          size={100}
          thickness={1}
          style={{
            color: "#fff",
            animationDuration: "250ms",
            position: "absolute",
          }}
        />
        <Typography variant="p" style={{ color: "white" }}>
          Cargando...
        </Typography>
      </Backdrop>
      <div
        className={
          moment(Date.now()).format("HH") < 18
            ? (weather && (weather.main.temp > 15 ? "cold hot" : "cold"))
            : "cold night"
        }
      >
        <main>
          <div className="search-box">
            <CssTextField
              label="Buscar..."
              className="search"
              variant="outlined"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              style={{ margin: "0 10px" }}
            />
            <IconButton
              onClick={() => {
                _search();
              }}
              style={{
                position: "absolute",
                right: "60px",
                marginRight: "-50px",
                color: "white",
                height: "56px",
              }}
            >
              <SearchIcon />
            </IconButton>
          </div>
          <div className="location-box">
            {weather && (
              <div className="location">
                {weather.name}, {weather.sys.country}
              </div>
            )}
            <div className="date">
              {moment(Date.now()).format("dddd D MMMM YYYY")}
            </div>
          </div>
          <div className="weather-box">
            {weather && (
              <div className="temp">
                {Math.round(weather.main.temp)}°c
                <div>
                  <p>Min {Math.round(weather.main.temp_min)}°c</p>
                  <p>Max {Math.round(weather.main.temp_max)}°c</p>
                </div>
              </div>
            )}
            {weather && (
              <div className="weather">
                {weather.weather[0].description}
                <div>
                  <Chip
                    label={`Humedad al ${Math.round(weather.main.humidity)}%`}
                    variant="outlined"
                    style={{
                      border: "1px solid white",
                      color: "white",
                      margin: 2,
                    }}
                  />
                  <Chip
                    label={`Viento ${weather.wind.speed} m/s`}
                    variant="outlined"
                    style={{
                      border: "1px solid white",
                      color: "white",
                      margin: 2,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
