import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { Header } from "semantic-ui-react";
import { Name as BaseName } from "./examples/01-base";
import { Name as SortName } from "./examples/02-sort";
import { Name as SubName } from "./examples/03-sub";

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
    case "sub":
      return SubName;
    default:
      return BaseName;
  }
};

const Title = () => {
  const [title, setTitle] = useState(BaseName);
  const location = useLocation();
  const path = location.pathname.slice(1).toLowerCase();

  useEffect(() => {
    const newTitle = getTitle(path);
    if (title !== newTitle) {
      setTitle(newTitle);
    }
  }, [title, path]);

  return path === "props" ? null : (
    <Container>
      <Header size="huge">{title}</Header>
    </Container>
  );
};

export default Title;
