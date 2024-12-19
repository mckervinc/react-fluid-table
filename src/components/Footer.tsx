import React, { memo, useCallback, useEffect, useRef } from "react";
import { ColumnProps, FooterProps } from "../..";
import { cx, findTableByUuid } from "../util";

type InnerFooterCellProps<T> = {
  width: number;
  column: ColumnProps<T>;
  prevWidth: number;
  rows: T[];
};

function BaseFooterCell<T>({ prevWidth, rows, ...rest }: InnerFooterCellProps<T>) {
  // instance
  const { width, column } = rest;
  const style: React.CSSProperties = {
    width: width || undefined,
    minWidth: width || undefined,
    padding: !column.footer ? 0 : undefined,
    left: column.frozen ? prevWidth : undefined
  };

  return (
    <div className={cx("cell", column.frozen && "frozen")} style={style}>
      {!!column.footer && <column.footer rows={rows} {...rest} />}
    </div>
  );
}

const FooterCell = memo(BaseFooterCell) as <T>(props: InnerFooterCellProps<T>) => React.JSX.Element;
(FooterCell as React.FC).displayName = "FooterCell";

type InnerFooterProps<T> = {
  uuid: string;
  rows: T[];
  columns: ColumnProps<T>[];
  pixelWidths: number[];
  className?: string;
  style?: React.CSSProperties;
  sticky?: boolean;
  component?: (props: FooterProps<T>) => React.ReactNode;
};

function Footer<T>({
  uuid,
  rows,
  columns,
  pixelWidths,
  sticky,
  className,
  style: footerStyle = {},
  component: Component
}: InnerFooterProps<T>) {
  const scroll = useRef(false);
  const ref = useRef<HTMLDivElement>(null);

  // constants
  const hasFooter = !!Component || columns.some(c => !!c.footer);
  const style: React.CSSProperties = {
    minWidth: sticky ? undefined : pixelWidths.reduce((pv, c) => pv + c, 0),
    ...footerStyle
  };
  if (!hasFooter) {
    style.width = 0;
    style.minWidth = 0;
  }

  // functions
  const onScroll = useCallback(
    (target: HTMLElement | null, element: HTMLElement | null) => {
      if (scroll.current || !element || !sticky) {
        return;
      }

      const left = target?.scrollLeft || 0;
      scroll.current = true;
      element.scrollLeft = left;
      setTimeout(() => {
        scroll.current = false;
      }, 0);
    },
    [uuid, sticky]
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
  if (!Component) {
    const hasFooter = columns.some(c => !!c.footer);
    return (
      <div
        ref={ref}
        style={{ border: !hasFooter ? "none" : undefined, ...style }}
        data-footer-key={`${uuid}-footer`}
        className={cx("rft-footer", sticky && "sticky", className)}
        onScroll={e => onScroll(e.target as HTMLDivElement, findTableByUuid(uuid))}
      >
        <div className="rft-row">
          {columns.map((c, i) => (
            <FooterCell
              key={c.key}
              column={c}
              rows={rows}
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
      className={cx("rft-footer", sticky && "sticky", className)}
      onScroll={e => onScroll(e.target as HTMLDivElement, findTableByUuid(uuid))}
    >
      <Component rows={rows} widths={pixelWidths} />
    </div>
  );
}

export default Footer;
