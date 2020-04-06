import React, { useRef, useState } from "react";
import styled from "styled-components";
import { Menu, Icon, Popup } from "semantic-ui-react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import jsx from "react-syntax-highlighter/dist/esm/languages/prism/jsx";
import okaidia from "react-syntax-highlighter/dist/esm/styles/prism/okaidia";
import { copy } from "../util";

SyntaxHighlighter.registerLanguage("jsx", jsx);

const Container = styled.div`
  position: relative;
  font-size: 0.85714286em;
`;

const Highligher = styled(SyntaxHighlighter)`
  margin-bottom: 0 !important;
  border-radius: 0 !important;
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
  color: rgba(255, 255, 255, 0.7) !important;
  :hover {
    color: rgb(248, 248, 243) !important;
  }

  &&& {
    padding: 0 0.57142857em;
  }
`;

const Alert = styled(Popup).attrs(() => ({
  on: "click",
  basic: true,
  position: "bottom center",
  content: "copied to clipboard"
}))`
  &&& {
    margin: 0;
    color: #2185d0;
    border: none;
    background-color: #dff0ff;
    box-shadow: 0 0 0 1px #2185d0 inset, 0 0 0 0 transparent;
  }
`;

const Snippet = ({ code, copy: showCopy, edit }) => {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);
  const onOpen = () => {
    if (ref.current) {
      window.clearTimeout(ref.current);
    }

    setOpen(true);
    copy(code);
    ref.current = window.setTimeout(() => {
      setOpen(false);
    }, 1000);
  };

  return (
    <Container>
      <Group>
        {!showCopy ? null : (
          <Alert
            trigger={
              <MenuItem>
                <Icon name="copy" />
                Copy
              </MenuItem>
            }
            open={open}
            onOpen={onOpen}
            onClose={() => setOpen(false)}
          />
        )}
        {!edit ? null : (
          <MenuItem>
            <Icon name="react" />
            Edit
          </MenuItem>
        )}
      </Group>
      <Highligher language="jsx" style={okaidia}>
        {code.trim()}
      </Highligher>
    </Container>
  );
};

Snippet.defaultProps = {
  copy: true,
  edit: true
};

export { Snippet };
