import React from "react";
import styled from "styled-components";
import { Menu, Icon } from "semantic-ui-react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import jsx from "react-syntax-highlighter/dist/esm/languages/prism/jsx";
import okaidia from "react-syntax-highlighter/dist/esm/styles/prism/okaidia";

SyntaxHighlighter.registerLanguage("jsx", jsx);

const Container = styled.div`
  position: relative;
`;

const Highligher = styled(SyntaxHighlighter)`
  height: 330px;
`;

const Group = styled(Menu).attrs(() => ({
  borderless: true
}))`
  position: absolute;
  top: 14px;
  right: 14px;
  &&& {
    background: transparent;
  }
`;

const MenuItem = styled(Menu.Item).attrs(() => ({
  as: "a",
  className: "item"
}))`
  color: rgba(255,255,255,0.7)!important;
  :hover {
    color: rgb(248, 248, 243) !important;
  }

  &&& {
    padding: 0 0.57142857em;
  }
`;

const Snippet = ({ code }) => (
  <Container>
    <Group>
      <MenuItem>
        <Icon name="copy" />
        Copy
      </MenuItem>
      <MenuItem>
        <Icon name="react" />
        Edit
      </MenuItem>
    </Group>
    <Highligher language="jsx" style={okaidia}>
      {code}
    </Highligher>
  </Container>
);

export { Snippet };
