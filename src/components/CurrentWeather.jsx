import React, { useEffect, useState } from "react";
import formatRelative from "date-fns/formatRelative";
import styled from "styled-components";
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

const CurrentWeather = ({ weatherID, night, sunrise, sunset, temp }) => {
  const [icon, setIcon] = useState();

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
    <CurrentWrapper>
      <ForecastIcon src={icon} alt={"weather icon"} />
      <div>
        <LargeText>{Math.round(temp)}°</LargeText>
        <SmallText>
          sunrise {formatRelative(new Date(sunrise), new Date()).substring(6)}
        </SmallText>
        <SmallText>
          sunset {formatRelative(new Date(sunset), new Date()).substring(6)}
        </SmallText>
      </div>
    </CurrentWrapper>
  );
};

export default CurrentWeather;

// ADD ANIMATION FOR WEATHER?
const CurrentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20px 0;
`;

const ForecastIcon = styled.img`
  width: 38%;
`;

const SmallText = styled.p`
  font-weight: 300;
  text-align: end;
`;

const LargeText = styled.p`
  font-weight: 600;
  font-size: 50px;
  text-align: end;
`;
