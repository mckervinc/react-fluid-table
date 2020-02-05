import "semantic-ui-css/semantic.min.css";

import React from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Icon, Menu, Segment, Sidebar } from "semantic-ui-react";

import Title from "./Title";
import Props from "./Props";
import { Snippet } from "./shared/Snippet";
import { Example1, Source as Example1Code } from "./examples/01-base";
import { Example2 } from "./examples/02-sort";
import { Example3 } from "./examples/03-sub";

const Application = styled(Sidebar.Pushable)`
  border: none;
`;

const Page = styled(Sidebar.Pusher)`
  width: calc(100% - 260px);
  height: 100%;
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

const App = () => (
  <Router>
    <Application>
      <Sidebar vertical visible inverted as={Menu}>
        <Menu.Item as={Link} to="/">
          <Icon name="home" />
          Home
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
      </Sidebar>
      <Page>
        <Title />
        <Switch>
          <Route exact path="/">
            <Wrapper>
              <Example1 />
            </Wrapper>
            <Snippet code={Example1Code}/>
          </Route>
          <Route exact path="/sort">
            <Wrapper>
              <Example2 />
            </Wrapper>
          </Route>
          <Route exact path="/sub">
            <Wrapper>
              <Example3 />
            </Wrapper>
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
