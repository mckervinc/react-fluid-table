import React, { useContext } from "react";
import { TableContext } from "./TableContext";
import { cx } from "./util";

const Footer = () => {
  const { uuid, stickyFooter, footerComponent: FooterComponent } = useContext(TableContext);

  // render
  if (!FooterComponent) {
    return null;
  }

  return (
    <div
      data-footer-key={`${uuid}-footer`}
      className={cx(["react-fluid-table-footer", stickyFooter && "sticky"])}
    >
      <FooterComponent />
    </div>
  );
};

export default Footer;
