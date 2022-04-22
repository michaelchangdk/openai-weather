import React from "react";
import Typewriter from "typewriter-effect";
import { Container } from "../styled_components/styledelements";
import styled from "styled-components";

const Error = ({ error }) => {
  return (
    <Container>
      <ErrorWrapper>
        <Typewriter
          onInit={(typewriter) => {
            typewriter.changeDelay(60).typeString(`Error: ${error}`).start();
          }}
        />
      </ErrorWrapper>
    </Container>
  );
};

export default Error;

const ErrorWrapper = styled.div`
  font-size: 13px;
  font-weight: 500;
`;
