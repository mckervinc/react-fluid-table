import React, { useContext } from "react";
import { TableContext } from "./TableContext";

const Footer = () => {
  const { uuid, stickyFooter, footerComponent: FooterComponent } = useContext(TableContext);

  // render
  if (!FooterComponent) {
    return null;
  }

  return (
    <div
      data-footer-key={`${uuid}-footer`}
      className={`react-fluid-table-footer ${stickyFooter ? "sticky" : ""}`.trim()}
    >
      <FooterComponent />
    </div>
  );
};

export default Footer;
