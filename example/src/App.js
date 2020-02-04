import "semantic-ui-css/semantic.min.css";

import React from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Icon, Menu, Segment, Sidebar } from "semantic-ui-react";

import Title from "./Title";
import Props from "./Props";
import { Example1 } from "./examples/01-base";
import { Example2 } from "./examples/02-sort";
import { Example3 } from "./examples/03-sub";

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
          Sortable Table
        </Menu.Item>
        <Menu.Item as={Link} to="/sub">
          Table w/Subcomponent
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
              <Route exact path="/sub">
                <Example3 />
              </Route>
            </Switch>
          </Content>
        </Segment>
        <Props />
      </Page>
    </Application>
  </Router>
);
export default App;
