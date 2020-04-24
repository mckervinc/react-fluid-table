import React, { forwardRef, useContext } from "react";
import { TableContext } from "./TableContext";

const TableWrapper = forwardRef(({ style, children, ...rest }: any, ref: any) => {
  // hooks
  const tableContext = useContext(TableContext);

  // variables
  const { tableStyle } = tableContext.state;
  const styles = {
    ...(tableStyle || {}),
    ...style
  };

  return (
    <div ref={ref} style={styles} {...rest}>
      {children}
    </div>
  );
});

export default TableWrapper;
