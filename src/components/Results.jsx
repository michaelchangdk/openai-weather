import React from "react";
import Typewriter from "typewriter-effect";

const Results = ({ results, night, weatherGroup }) => {
  return (
    <>
      <Typewriter
        onInit={(typewriter) => {
          typewriter.changeDelay(40).typeString(results).start();
        }}
      />
    </>
  );
};

export default Results;
