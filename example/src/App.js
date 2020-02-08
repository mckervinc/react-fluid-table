import "semantic-ui-css/semantic.min.css";

import React from "react";
import styled from "styled-components";
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Icon, Menu, Segment, Sidebar } from "semantic-ui-react";

import Title from "./Title";
import Props from "./Props";
import { Snippet } from "./shared/Snippet";
import { Example1, Source as Example1Code } from "./examples/01-base";
import { Example2, Source as Example2Code } from "./examples/02-sort";
import { Example3, Source as Example3Code } from "./examples/03-sub";

const Application = styled(Sidebar.Pushable)`
  border: none;
`;

const Page = styled(Sidebar.Pusher)`
  width: calc(100% - 260px);
  height: 100%;
  &&& {
    overflow-y: auto;
  }
`;

const Content = styled.div`
  background: #fff;
  padding: 10px;
  margin-bottom: 10px;
  box-shadow: 0 2px 8px #bbb;
`;

const Wrapper = ({ children }) => (
  <Segment basic>
    <Content>{children}</Content>
  </Segment>
);

const Banner = styled.code`
  color: #50f97a;
  white-space: pre;
  padding: 0 0.2em;
  border-radius: 0.28571429rem;
  font-size: 1.3em;
`;

const GitHub = styled(Icon).attrs(() => ({
  name: "github alternate"
}))`
  float: none !important;
  margin: 0 0.5em 0 0 !important;
`;

const App = () => (
  <Router>
    <Application>
      <Sidebar vertical visible inverted as={Menu}>
        <Menu.Item>
          <Banner>react-fluid-table</Banner>
        </Menu.Item>
        <Menu.Item as={Link} to="/">
          Basic Table
        </Menu.Item>
        <Menu.Item as={Link} to="/sort">
          Sortable Table
        </Menu.Item>
        <Menu.Item as={Link} to="/sub">
          Table w/Subcomponent
        </Menu.Item>
        <Menu.Item as={Link} to="/props">
          Table Props
        </Menu.Item>
        <Menu.Item as="a" href="https://github.com/mckervinc/react-fluid-table">
          <GitHub />
          GitHub
        </Menu.Item>
      </Sidebar>
      <Page>
        <Switch>
          <Route exact path="/">
            <Title title="Basic Table" />
            <Wrapper>
              <Example1 />
            </Wrapper>
            <Snippet code={Example1Code} />
          </Route>
          <Route exact path="/sort">
            <Title title="Sortable Table" />
            <Wrapper>
              <Example2 />
            </Wrapper>
            <Snippet code={Example2Code} />
          </Route>
          <Route exact path="/sub">
            <Title title="Table with Subcomponent" />
            <Wrapper>
              <Example3 />
            </Wrapper>
            <Snippet code={Example3Code} />
          </Route>
          <Route exact path="/props">
            <Props />
          </Route>
        </Switch>
      </Page>
    </Application>
  </Router>
);
export default App;
