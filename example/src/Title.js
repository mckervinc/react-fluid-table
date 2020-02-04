import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { Header } from "semantic-ui-react";
import { Name as BaseName } from "./examples/01-base";
import { Name as SortName } from "./examples/02-sort";

const Container = styled.div`
  background-color: #fff;
  height: 75px;
  padding: 1em;
  -webkit-box-shadow: 0px 4px 5px 0px rgba(176, 176, 176, 0.75);
  -moz-box-shadow: 0px 4px 5px 0px rgba(176, 176, 176, 0.75);
  box-shadow: 0px 4px 5px 0px rgba(176, 176, 176, 0.75);
`;

const getTitle = path => {
  switch (path) {
    case "sort":
      return SortName;
    default:
      return BaseName;
  }
};

const Title = () => {
  const [title, setTitle] = useState(BaseName);
  const location = useLocation();

  useEffect(() => {
    const newTitle = getTitle(location.pathname.slice(1));
    if (title !== newTitle) {
      setTitle(newTitle);
    }
  }, [title, location]);

  return (
    <Container>
      <Header size="huge">{title}</Header>
    </Container>
  );
};

export default Title;
