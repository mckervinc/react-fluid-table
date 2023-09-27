import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Header, Icon, Menu, Segment, Sidebar } from "semantic-ui-react";
import styled from "styled-components";
import Navigation from "./Navigation";
import { Snippet } from "./Snippet";

const Container = styled.div`
  background-color: #fff;
  height: 75px;
  padding: 1em;
  -webkit-box-shadow: 0px 4px 5px 0px rgba(176, 176, 176, 0.75);
  -moz-box-shadow: 0px 4px 5px 0px rgba(176, 176, 176, 0.75);
  box-shadow: 0px 4px 5px 0px rgba(176, 176, 176, 0.75);
`;

const Content = styled.div`
  background: #fff;
  padding: 10px;
  margin-bottom: 10px;
  box-shadow: 0 2px 8px #bbb;
`;

const Title = ({ title }: { title: string }) => (
  <Container>
    <Header size="huge">{title}</Header>
  </Container>
);

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <Segment basic>
    <Content>{children}</Content>
  </Segment>
);

const Application = styled(Sidebar.Pushable)`
  border: none;
  overflow: hidden;
`;

const PageContent = styled(Sidebar.Pusher)`
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

const Banner = styled.code`
  color: #50f97a;
  white-space: pre;
  padding: 0 0.2em;
  border-radius: 0.28571429rem;
  font-size: 1.3em;
`;

const GitHub = styled(Icon)`
  float: none !important;
  margin: 0 0.5em 0 0 !important;
`;

const LinkContainer = () => (
  <>
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
      Cell Content
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
    <Menu.Item as={Link} to="/scroll">
      Methods
    </Menu.Item>
    <Menu.Item as={Link} to="/footer">
      Footer
    </Menu.Item>
    <Menu.Item as={Link} to="/props">
      Table Props
    </Menu.Item>
    <Menu.Item as="a" href="https://github.com/mckervinc/react-fluid-table">
      <GitHub name="github alternate" />
      GitHub
    </Menu.Item>
  </>
);

const MobileMenu = styled(Menu)`
  &&& {
    width: 100%;
  }
`;

interface PageProps {
  title?: string;
  code?: string;
  children: React.ReactNode;
}

const Page = ({ title, code, children }: PageProps) => {
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
    <Application>
      <Navigation>
        <MobileMenu vertical inverted>
          <LinkContainer />
        </MobileMenu>
      </Navigation>
      <Sidebar vertical inverted id="sidebar" as={Menu} visible={!mobile}>
        <LinkContainer />
      </Sidebar>
      <PageContent id="pusher">
        {!!title && <Title title={title} />}
        <Wrapper>{children}</Wrapper>
        {!!code && <Snippet code={code} />}
      </PageContent>
    </Application>
  );
};

export default Page;
