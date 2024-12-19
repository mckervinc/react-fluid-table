import React, { memo } from "react";
import { ColumnProps, FooterProps } from "../..";
import { cx } from "../util";

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
  isScrollHorizontal: boolean;
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
  isScrollHorizontal,
  style: footerStyle = {},
  component: Component
}: InnerFooterProps<T>) {
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

  // render
  if (!Component) {
    const hasFooter = columns.some(c => !!c.footer);
    return (
      <div
        style={{ border: !hasFooter ? "none" : undefined, ...style }}
        data-footer-key={`${uuid}-footer`}
        className={cx("rft-footer", sticky && "sticky", isScrollHorizontal && "scroll", className)}
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
      style={style}
      data-footer-key={`${uuid}-footer`}
      className={cx("rft-footer", sticky && "sticky", isScrollHorizontal && "scroll", className)}
    >
      <Component rows={rows} widths={pixelWidths} />
    </div>
  );
}

export default Footer;
