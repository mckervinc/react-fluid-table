import React, { forwardRef, useContext } from "react";
import { TableContext } from "./TableContext";

const TableWrapper = forwardRef(({ style, children, ...rest }: any, ref: any) => {
  // hooks
  const { tableStyle } = useContext(TableContext);

  // variables
  const styles: React.CSSProperties = {
    ...(tableStyle || {}),
    ...style
  };

  return (
    <div ref={ref} style={styles} {...rest}>
      {children}
    </div>
  );
});

TableWrapper.displayName = "TableWrapper";

export default TableWrapper;
