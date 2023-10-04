import React, { useCallback, useContext, useEffect, useRef } from "react";
import { ColumnProps } from "..";
import { TableContext } from "./TableContext";
import { cx, findTableByUuid } from "./util";

interface InnerFooterCellProps<T> {
  width: number;
  column: ColumnProps<T>;
  prevWidth: number;
}

const FooterCell = React.memo(function <T>({ prevWidth, ...rest }: InnerFooterCellProps<T>) {
  // hooks
  const { rows } = useContext(TableContext);

  // instance
  const { width, column } = rest;
  const style: React.CSSProperties = {
    width: width || undefined,
    minWidth: width || undefined,
    padding: !column.footer ? 0 : undefined,
    left: column.frozen ? prevWidth : undefined
  };

  const FooterCellComponent = column.footer;
  return (
    <div className={cx(["cell", column.frozen && "frozen"])} style={style}>
      {!!FooterCellComponent && <FooterCellComponent rows={rows} {...rest} />}
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
  const style: React.CSSProperties = {
    minWidth: stickyFooter ? undefined : pixelWidths.reduce((pv, c) => pv + c, 0),
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
            <FooterCell
              key={c.key}
              column={c}
              width={pixelWidths[i]}
              prevWidth={c.frozen ? pixelWidths.slice(0, i).reduce((pv, c) => pv + c, 0) : 0}
            />
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
