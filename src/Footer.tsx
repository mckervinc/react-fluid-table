import React, { useCallback, useContext, useEffect, useRef } from "react";
import { ColumnProps } from "..";
import { TableContext } from "./TableContext";
import { cx, findTableByUuid } from "./util";

interface InnerFooterCellProps<T> {
  width: number;
  column: ColumnProps<T>;
}

const FooterCell = React.memo(function <T>(props: InnerFooterCellProps<T>) {
  // hooks
  const { rows } = useContext(TableContext);

  // instance
  const { width, column } = props;
  const style: React.CSSProperties = {
    width: width ? `${width}px` : undefined,
    minWidth: width ? `${width}px` : undefined,
    padding: !column.footer ? 0 : undefined
  };

  const FooterCellComponent = column.footer;
  return (
    <div className="cell" style={style}>
      {!!FooterCellComponent && <FooterCellComponent rows={rows} {...props} />}
    </div>
  );
});

FooterCell.displayName = "FooterCell";

const Footer = () => {
  const {
    uuid,
    rows,
    columns,
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
    const hasFooter = !!columns.find(c => !!c.footer);
    return (
      <div
        ref={ref}
        style={{ border: !hasFooter ? "none" : undefined, ...style }}
        data-footer-key={`${uuid}-footer`}
        className={cx(["react-fluid-table-footer", stickyFooter && "sticky", footerClassname])}
        onScroll={e => onScroll(e.target as HTMLDivElement, findTableByUuid(uuid))}
      >
        <div className="row-container">
          {columns.map((c, i) => (
            <FooterCell key={c.key} column={c} width={pixelWidths[i]} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      style={style}
      data-footer-key={`${uuid}-footer`}
      className={cx(["react-fluid-table-footer", stickyFooter && "sticky", footerClassname])}
      onScroll={e => onScroll(e.target as HTMLDivElement, findTableByUuid(uuid))}
    >
      <FooterComponent rows={rows} widths={pixelWidths} />
    </div>
  );
};

export default Footer;
