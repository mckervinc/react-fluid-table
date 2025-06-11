import React, { forwardRef, useMemo, useState } from "react";
import { TableProps, TableRef } from "../index";
import AutoSizer from "./AutoSizer";
import List from "./components/List";
import { randomString } from "./util";

function BaseTable<T>(
  {
    id,
    rowHeight,
    tableWidth = 0,
    tableHeight = 0,
    footerHeight = 0,
    headerHeight = 0,
    minTableHeight = 0,
    maxTableHeight = 0,
    estimatedRowHeight,
    ...props
  }: TableProps<T>,
  ref: React.ForwardedRef<TableRef>
) {
  // hooks
  const [uuid] = useState(`${id || "data-table"}-${randomString(5)}`);

  // constants
  const maxHeight = useMemo(() => {
    if (minTableHeight > 0 && maxTableHeight <= 0) {
      console.warn(
        `maxTableHeight was either not present, or is <= 0, but you provided a minTableHeight of ${minTableHeight}px. As a result, the maxTableHeight will be set to ${
          minTableHeight + 400
        }px. To avoid this warning, please specify a maxTableHeight.`
      );

      return minTableHeight + 400;
    }

    return maxTableHeight;
  }, [minTableHeight, maxTableHeight]);

  const dimensions = {
    rowHeight: rowHeight || 0,
    tableWidth,
    tableHeight,
    footerHeight,
    headerHeight,
    minTableHeight,
    estimatedRowHeight: estimatedRowHeight || 0,
    maxTableHeight: maxHeight
  };

  return (
    <AutoSizer
      uuid={uuid}
      dimensions={dimensions}
      numRows={props.data.length}
      hasFooter={!!props.footerComponent || props.columns.some(c => !!c.footer)}
    >
      {({ height, width }) => {
        return (
          <List
            ref={ref}
            uuid={uuid}
            width={width}
            height={height}
            rowHeight={rowHeight}
            tableHeight={tableHeight}
            maxTableHeight={maxHeight}
            headerHeight={headerHeight}
            footerHeight={footerHeight}
            estimatedRowHeight={estimatedRowHeight}
            {...props}
          />
        );
      }}
    </AutoSizer>
  );
}

const Table = forwardRef(BaseTable) as <T>(
  props: TableProps<T> & { ref?: React.ForwardedRef<TableRef> }
) => React.JSX.Element;
(Table as React.FC).displayName = "Table";

export default Table;
