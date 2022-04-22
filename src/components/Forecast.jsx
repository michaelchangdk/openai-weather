import React from "react";
import styled from "styled-components";
import ForecastChildren from "./ForecastChildren";

const Forecast = ({ hourly, night }) => {
  const fourHours = hourly.slice(0, 4);
  return (
    <ForecastGrid>
      {fourHours.map((hour, index) => (
        <ForecastChildren weather={hour} key={index} night={night} />
      ))}
    </ForecastGrid>
  );
};

export default Forecast;

const ForecastGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 20px;
  margin: 20px 0;
`;
