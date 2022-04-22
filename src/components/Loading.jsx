import React from "react";
import Typewriter from "typewriter-effect";
import { Container } from "../styled_components/styledelements";
import styled from "styled-components";

const Loading = () => {
  return (
    <Container>
      <LoadingWrapper>
        <Typewriter
          options={{
            loop: true,
          }}
          onInit={(typewriter) => {
            typewriter
              .typeString("Loading...")
              .pauseFor(800)
              .changeDelay(60)
              .deleteChars(3)
              .pauseFor(400)
              .start();
          }}
        />
        <br />
        <Typewriter
          onInit={(typewriter) => {
            typewriter
              .typeString("Please be patient, this may take some time.")
              .start();
          }}
        />
      </LoadingWrapper>
    </Container>
  );
};

export default Loading;

const LoadingWrapper = styled.div`
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;
