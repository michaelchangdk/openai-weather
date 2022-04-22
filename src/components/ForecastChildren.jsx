import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { formatRelative } from "date-fns";
import atmosphere from "../assets/atmosphere.svg";
import cloudy from "../assets/cloudy.svg";
import drizzle from "../assets/drizzle.svg";
import nightIcon from "../assets/night.svg";
import rain from "../assets/rain.svg";
import snow from "../assets/snow.svg";
import sunny from "../assets/sunny.svg";
import thunderstorm from "../assets/thunderstorm.svg";
import lightclouds from "../assets/lightclouds.svg";
import partcloudy from "../assets/partcloudy.svg";
import nightcloudy from "../assets/nightcloudy.svg";

const ForecastChildren = ({ weather, night }) => {
  const [icon, setIcon] = useState();
  const weatherID = weather.weather[0].id;
  const temp = `${Math.round(weather.temp)}°`;
  const time = formatRelative(new Date(weather.dt * 1000), new Date())
    .split(" ")
    .slice(2, 3)
    .join(" ");

  useEffect(() => {
    selectIcon();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectIcon = () => {
    if (night === "Night" && weatherID > 800) {
      setIcon(nightcloudy);
    } else if (night === "Night") {
      setIcon(nightIcon);
    } else if (weatherID >= 200 && weatherID < 299) {
      setIcon(thunderstorm);
    } else if (weatherID >= 300 && weatherID < 399) {
      setIcon(drizzle);
    } else if (weatherID >= 500 && weatherID < 599) {
      setIcon(rain);
    } else if (weatherID >= 600 && weatherID < 699) {
      setIcon(snow);
    } else if (weatherID >= 700 && weatherID < 799) {
      setIcon(atmosphere);
    } else if (weatherID === 800) {
      setIcon(sunny);
    } else if (weatherID === 801) {
      setIcon(lightclouds);
    } else if (weatherID === 802) {
      setIcon(partcloudy);
    } else if (weatherID > 802) {
      setIcon(cloudy);
    }
  };

  return (
    <WeatherChild>
      <Icon src={icon} alt={"weather icon"} />
      <div>
        <Time>{time}</Time>
        <Temp>{temp}</Temp>
      </div>
    </WeatherChild>
  );
};

export default ForecastChildren;

const WeatherChild = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  text-align: center;
`;

const Icon = styled.img`
  width: 100%;
  height: 100%;
`;

const Time = styled.p`
  font-weight: 300;
`;

const Temp = styled.p`
  font-weight: 500;
`;
