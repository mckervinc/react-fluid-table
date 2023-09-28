import { useRef, useState } from "react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import tsx from "react-syntax-highlighter/dist/esm/languages/prism/tsx";
import okaidia from "react-syntax-highlighter/dist/esm/styles/prism/okaidia";
import { Icon, Menu, Popup } from "semantic-ui-react";
import styled from "styled-components";
import { copy } from "./util";

SyntaxHighlighter.registerLanguage("tsx", tsx);

const Container = styled.div`
  position: relative;
  font-size: 0.85714286em;
`;

const Highligher = styled(SyntaxHighlighter)`
  margin-bottom: 0 !important;
  border-radius: 0 !important;
`;

const Group = styled(Menu)`
  position: absolute;
  top: 14px;
  right: 14px;
  &&& {
    background: transparent;
  }
`;

const MenuItem = styled(Menu.Item)`
  color: rgba(255, 255, 255, 0.7) !important;
  :hover {
    color: rgb(248, 248, 243) !important;
  }

  &&& {
    padding: 0 0.57142857em;
  }
`;

const Alert = styled(Popup)`
  &&& {
    margin: 0;
    color: #2185d0;
    border: none;
    background-color: #dff0ff;
    box-shadow:
      0 0 0 1px #2185d0 inset,
      0 0 0 0 transparent;
  }
`;

interface SnippetProps {
  code: string;
  copy?: boolean;
  edit?: boolean;
}

const Snippet = ({ code, copy: showCopy = true, edit = false }: SnippetProps) => {
  const ref = useRef(0);
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
      <Group borderless>
        {!showCopy ? null : (
          <Alert
            basic
            on="click"
            position="bottom center"
            content="copied to clipboard"
            trigger={
              <MenuItem as="a" className="item">
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
          <MenuItem as="a" className="item">
            <Icon name="react" />
            Edit
          </MenuItem>
        )}
      </Group>
      <Highligher language="tsx" style={okaidia}>
        {code.trim()}
      </Highligher>
    </Container>
  );
};

export { Snippet };
