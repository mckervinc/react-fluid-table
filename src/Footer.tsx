import React, { useCallback, useContext, useEffect, useRef } from "react";
import { TableContext } from "./TableContext";
import { cx, findTableByUuid } from "./util";

const Footer = () => {
  const {
    uuid,
    stickyFooter,
    pixelWidths,
    footerStyle,
    footerClassname,
    footerComponent: FooterComponent
  } = useContext(TableContext);
  const scroll = useRef(false);
  const ref = useRef<HTMLDivElement>(null);

  // constants
  const width = pixelWidths.reduce((pv, c) => pv + c, 0);
  const style: React.CSSProperties = {
    minWidth: stickyFooter ? undefined : `${width}px`,
    ...(footerStyle || {})
  };

  // functions
  const onScroll = useCallback(
    (target: HTMLElement | null, element: HTMLElement | null) => {
      if (scroll.current || !element || !stickyFooter) {
        return;
      }

      const left = target?.scrollLeft || 0;
      scroll.current = true;
      element.scrollLeft = left;
      setTimeout(() => {
        scroll.current = false;
      }, 0);
    },
    [uuid, stickyFooter]
  );

  const listener = useCallback(
    (ev: Event) => {
      onScroll(ev.target as HTMLDivElement, ref.current);
    },
    [onScroll]
  );

  // effects
  // add scroll listener
  useEffect(() => {
    if (uuid) {
      const e = findTableByUuid(uuid);
      if (e) {
        e.addEventListener("scroll", listener);
      }
    }

    return () => {
      if (uuid) {
        const e = findTableByUuid(uuid);
        if (e) {
          e.removeEventListener("scroll", listener);
        }
      }
    };
  }, [uuid, listener]);

  // render
  if (!FooterComponent) {
    return null;
  }

  return (
    <div
      ref={ref}
      style={style}
      data-footer-key={`${uuid}-footer`}
      className={cx(["react-fluid-table-footer", stickyFooter && "sticky", footerClassname])}
      onScroll={e => onScroll(e.target as HTMLDivElement, findTableByUuid(uuid))}
    >
      <FooterComponent widths={pixelWidths} />
    </div>
  );
};

export default Footer;
