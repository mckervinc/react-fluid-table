import React, { forwardRef, useEffect, useMemo, useState } from "react";
import { TableProps, TableRef } from "../index";
import AutoSizer from "./AutoSizer";
import List from "./components/List";
import { positive, randomString } from "./util";

let warned = false;

function BaseTable<T>(
  {
    id,
    rowHeight,
    footerHeight,
    data,
    columns,
    tableHeight,
    tableWidth,
    headerHeight,
    rowRenderer,
    subComponent,
    footerComponent,
    maxTableHeight,
    minTableHeight,
    itemKey,
    onRowClick,
    onExpandRow,
    ...props
  }: TableProps<T>,
  ref: React.ForwardedRef<TableRef>
) {
  const [uuid] = useState(`${id || "data-table"}-${randomString(5)}`);

  // warn if a minHeight is set without a maxHeight
  const maxHeight = useMemo(() => {
    if (positive(minTableHeight) && (!maxTableHeight || maxTableHeight <= 0)) {
      return minTableHeight + 400;
    }

    return maxTableHeight;
  }, [minTableHeight, maxTableHeight]);

  // handle warning
  useEffect(() => {
    if (
      minTableHeight &&
      minTableHeight > 0 &&
      (!maxTableHeight || maxTableHeight <= 0) &&
      !warned
    ) {
      warned = true;
      console.warn(
        `maxTableHeight was either not present, or is <= 0, but you provided a minTableHeight of ${minTableHeight}px. As a result, the maxTableHeight will be set to ${
          minTableHeight + 400
        }px. To avoid this warning, please specify a maxTableHeight.`
      );
    }
  }, [minTableHeight, maxTableHeight]);

  return (
    <AutoSizer
      uuid={uuid}
      numRows={data.length}
      tableWidth={tableWidth}
      tableHeight={tableHeight}
      rowHeight={rowHeight}
      minTableHeight={minTableHeight}
      maxTableHeight={maxHeight}
      headerHeight={headerHeight}
      footerHeight={footerHeight}
      hasFooter={!!footerComponent || columns.some(c => !!c.footer)}
    >
      {({ height, width }) => {
        return (
          <List
            ref={ref}
            uuid={uuid}
            width={width}
            height={height}
            data={data}
            rowHeight={rowHeight}
            itemKey={itemKey}
            onRowClick={onRowClick}
            rowRenderer={rowRenderer}
            onExpandRow={onExpandRow}
            subComponent={subComponent}
            footerComponent={footerComponent}
            columns={columns}
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
