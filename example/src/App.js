import React, { useCallback, useEffect, useState } from "react";
import { HashRouter as Router, Link, Route, Switch } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import { Icon, Menu, Segment, Sidebar } from "semantic-ui-react";
import styled from "styled-components";
import { Example1, Source as Example1Code } from "./examples/01-base";
import { Example2, Source as Example2Code } from "./examples/02-sort";
import { Example3, Source as Example3Code } from "./examples/03-sub";
import { Example4, Source as Example4Code } from "./examples/04-custom";
import { Example5, Source as Example5Code } from "./examples/05-variable";
import { Example6, Source as Example6Code } from "./examples/06-expanded";
import { Example7, Source as Example7Code } from "./examples/07-controlled";
import { Example8, Source as Example8Code } from "./examples/08-header";
import Navigation from "./Navigation";
import Props from "./Props";
import { Snippet } from "./shared/Snippet";
import Title from "./Title";

const Application = styled(Sidebar.Pushable)`
  border: none;
`;

const Page = styled(Sidebar.Pusher)`
  width: calc(100% - 260px);
  height: 100%;
  &&& {
    overflow-y: auto;
  }

  @media screen and (max-width: 768px) {
    width: 100%;
    transform: translate3d(0, 0, 0) !important;
  }
`;

const MobileMenu = styled(Menu)`
  &&& {
    width: 100%;
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

const App = () => {
  const [mobile, setIsMobile] = useState(window.innerWidth <= 768);
  const onResize = useCallback(() => {
    setIsMobile(window.innerWidth <= 768);

    const elem = document.getElementById("pusher");
    const side = document.getElementById("sidebar");
    if (!elem || !side) {
      return;
    }

    if (window.innerWidth > 768) {
      side.style.overflow = "";
      elem.style.overflow = "";
    }
  }, []);

  useEffect(() => {
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [onResize]);

  return (
    <Router>
      <Application>
        <Navigation>
          <MobileMenu vertical inverted>
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
            <Menu.Item as={Link} to="/custom">
              Cell Renderer
            </Menu.Item>
            <Menu.Item as={Link} to="/variable">
              Variable Row Size
            </Menu.Item>
            <Menu.Item as={Link} to="/expanded">
              Expanded Row Height
            </Menu.Item>
            <Menu.Item as={Link} to="/controlled">
              Controlled Props
            </Menu.Item>
            <Menu.Item as={Link} to="/header">
              Custom Styling
            </Menu.Item>
            <Menu.Item as={Link} to="/props">
              Table Props
            </Menu.Item>
            <Menu.Item as="a" href="https://github.com/mckervinc/react-fluid-table">
              <GitHub />
              GitHub
            </Menu.Item>
          </MobileMenu>
        </Navigation>
        <Sidebar vertical inverted id="sidebar" as={Menu} visible={!mobile}>
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
          <Menu.Item as={Link} to="/custom">
            Cell Renderer
          </Menu.Item>
          <Menu.Item as={Link} to="/variable">
            Variable Row Size
          </Menu.Item>
          <Menu.Item as={Link} to="/expanded">
            Expanded Row Height
          </Menu.Item>
          <Menu.Item as={Link} to="/controlled">
            Controlled Props
          </Menu.Item>
          <Menu.Item as={Link} to="/header">
            Custom Styling
          </Menu.Item>
          <Menu.Item as={Link} to="/props">
            Table Props
          </Menu.Item>
          <Menu.Item as="a" href="https://github.com/mckervinc/react-fluid-table">
            <GitHub />
            GitHub
          </Menu.Item>
        </Sidebar>
        <Page id="pusher">
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
            <Route exact path="/custom">
              <Title title="Cell Renderer" />
              <Wrapper>
                <Example4 />
              </Wrapper>
              <Snippet code={Example4Code} />
            </Route>
            <Route exact path="/variable">
              <Title title="Variable Row Size" />
              <Wrapper>
                <Example5 />
              </Wrapper>
              <Snippet code={Example5Code} />
            </Route>
            <Route exact path="/expanded">
              <Title title="Expanded Row Height" />
              <Wrapper>
                <Example6 />
              </Wrapper>
              <Snippet code={Example6Code} />
            </Route>
            <Route exact path="/controlled">
              <Title title="Controlled Props" />
              <Wrapper>
                <Example7 />
              </Wrapper>
              <Snippet code={Example7Code} />
            </Route>
            <Route exact path="/header">
              <Title title="Custom Styling" />
              <Wrapper>
                <Example8 />
              </Wrapper>
              <Snippet code={Example8Code} />
            </Route>
            <Route exact path="/props">
              <Props />
            </Route>
          </Switch>
        </Page>
      </Application>
    </Router>
  );
};
export default App;
