import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Container } from "../styled_components/styledelements";

const Header = () => {
  return (
    <Container>
      <HeaderWrapper>
        <Link to="/">CURRENT WEATHER</Link>
        <Link to="/about">ABOUT</Link>
      </HeaderWrapper>
    </Container>
  );
};

export default Header;

const HeaderWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;

  a {
    color: black;
    text-decoration: underline;
    cursor: pointer;
  }

  /* @media (hover: hover) {
    a:hover {
      color: #fb8500;
      font-weight: 600;
    }
  } */
`;
