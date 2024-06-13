import React, { forwardRef, useContext } from "react";
import Footer from "./Footer";
import { TableContext } from "./TableContext";
import { cx } from "./util";

interface TableWrapperProps {
  style: React.CSSProperties;
  children: React.ReactNode;
  className?: string;
  onScroll?: () => void;
}

const TableWrapper = forwardRef(
  (
    { style, children, className, ...rest }: TableWrapperProps,
    ref: React.ForwardedRef<HTMLDivElement>
  ) => {
    // hooks
    const { id, tableStyle = {}, uuid, pixelWidths } = useContext(TableContext);

    // variables
    const width =
      !isNaN(Number(style.width)) && !style.width
        ? pixelWidths.reduce((pv, c) => pv + c, 0)
        : style.width;
    const styles: React.CSSProperties = {
      ...tableStyle,
      ...style,
      width
    };

    return (
      <div
        id={id}
        ref={ref}
        style={styles}
        data-table-key={uuid}
        className={cx("rft", className)}
        {...rest}
      >
        {children}
        <Footer />
      </div>
    );
  }
);

TableWrapper.displayName = "TableWrapper";

export default TableWrapper;
