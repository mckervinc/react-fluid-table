import React, { forwardRef, useContext } from "react";
import Footer from "./Footer";
import { TableContext } from "./TableContext";

interface TableWrapperProps {
  style: React.CSSProperties;
  children: React.ReactNode;
  className?: string;
  onScroll?: () => void;
}

const TableWrapper = forwardRef(
  ({ style, children, ...rest }: TableWrapperProps, ref: React.ForwardedRef<HTMLDivElement>) => {
    // hooks
    const { id, tableStyle, uuid } = useContext(TableContext);

    // variables
    const styles: React.CSSProperties = {
      ...(tableStyle || {}),
      ...style
    };

    return (
      <div id={id} ref={ref} data-table-key={uuid} style={styles} {...rest}>
        {children}
        <Footer />
      </div>
    );
  }
);

TableWrapper.displayName = "TableWrapper";

export default TableWrapper;
