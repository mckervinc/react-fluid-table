import "semantic-ui-css/semantic.min.css";

import React from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Icon, Menu, Segment, Sidebar } from "semantic-ui-react";

import Title from "./Title";
import { Example1 } from "./examples/01-base";
import { Example2 } from "./examples/02-sort";

const Application = styled(Sidebar.Pushable)`
  border: none;
`;

const Page = styled(Sidebar.Pusher)`
  width: calc(100% - 260px);
`;

const Content = styled.div`
  background: #fff;
  padding: 10px;
  margin-bottom: 10px;
  box-shadow: 0 2px 8px #bbb;
`;

const App = () => (
  <Router>
    <Application>
      <Sidebar vertical visible inverted as={Menu} animation="push">
        <Menu.Item as={Link} to="/">
          <Icon name="home" />
          Home
        </Menu.Item>
        <Menu.Item as={Link} to="/sort">
          <Icon name="home" />
          Sortable Table
        </Menu.Item>
      </Sidebar>
      <Page>
        <Title />
        <Segment basic>
          <Content>
            <Switch>
              <Route exact path="/">
                <Example1 />
              </Route>
              <Route exact path="/sort">
                <Example2 />
              </Route>
            </Switch>
          </Content>
        </Segment>
      </Page>
    </Application>
  </Router>
);
export default App;
