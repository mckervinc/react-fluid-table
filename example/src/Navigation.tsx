import React, { useState } from "react";
import { Icon } from "semantic-ui-react";
import styled from "styled-components";

const StyledNav = styled.nav`
  position: sticky;
  top: 0;
  width: 100%;
  background-color: #1b1c1d;
  color: rgba(255, 255, 255, 0.9);
  padding: 1rem 10px;

  @media screen and (min-width: 769px) {
    display: none;
  }
`;

const Toggle = styled(Icon)`
  cursor: pointer;
  display: block;
`;

const Navigation = ({ children }: { children?: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const onClick = () => {
    setIsOpen(!isOpen);
    const elem = document.getElementById("pusher");
    const side = document.getElementById("sidebar");
    if (!elem || !side) {
      return;
    }

    if (isOpen) {
      side.style.overflow = "";
      elem.style.overflow = "";
    } else {
      side.style.overflow = "hidden";
      elem.style.overflow = "hidden";
    }
  };

  return (
    <StyledNav>
      <Toggle name={isOpen ? "times" : "bars"} onClick={onClick} />
      {!isOpen ? null : <div>{children}</div>}
    </StyledNav>
  );
};

export default Navigation;
