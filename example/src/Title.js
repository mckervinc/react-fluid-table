import React from "react";
import styled from "styled-components";
import { Header } from "semantic-ui-react";

const Container = styled.div`
  background-color: #fff;
  height: 75px;
  padding: 1em;
  -webkit-box-shadow: 0px 4px 5px 0px rgba(176, 176, 176, 0.75);
  -moz-box-shadow: 0px 4px 5px 0px rgba(176, 176, 176, 0.75);
  box-shadow: 0px 4px 5px 0px rgba(176, 176, 176, 0.75);
`;

const Title = ({ title }) => (
  <Container>
    <Header size="huge">{title}</Header>
  </Container>
);

export default Title;
