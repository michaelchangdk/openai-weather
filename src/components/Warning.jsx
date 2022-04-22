import React from "react";
import Typewriter from "typewriter-effect";
import styled from "styled-components";

const Warning = ({ warning }) => {
  return (
    <WarningWrapper>
      <Typewriter
        onInit={(typewriter) => {
          typewriter
            .pauseFor(15000)
            .changeDelay(10)
            .typeString(warning)
            .start();
        }}
      />
    </WarningWrapper>
  );
};

export default Warning;

const WarningWrapper = styled.div`
  font-size: 13px;
  font-weight: 500;
`;
