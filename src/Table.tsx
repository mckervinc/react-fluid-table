import React, { forwardRef, useEffect, useMemo, useState } from "react";
import { TableProps, TableRef } from "../index";
import AutoSizer from "./AutoSizer";
import List from "./components/List";
import { positive, randomString } from "./util";

let warned = false;

const Table = forwardRef(function <T>(props: TableProps<T>, ref: React.ForwardedRef<TableRef>) {
  const {
    id,
    rowHeight,
    footerHeight,
    data,
    columns,
    onSort,
    sortColumn,
    sortDirection,
    tableHeight,
    tableWidth,
    style,
    headerStyle,
    headerHeight,
    headerClassname,
    footerComponent,
    footerStyle,
    footerClassname,
    maxTableHeight,
    minTableHeight,
    expandedRows,
    minColumnWidth = 80,
    stickyFooter = false,
    className,
    rowClassname,
    rowStyle,
    itemKey,
    subComponent,
    onExpandRow,
    onRowClick,
    rowRenderer
  } = props;
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
      hasFooter={!!footerComponent || !!columns.find(c => !!c.footer)}
    >
      {({ height, width }) => {
        return (
          <List
            ref={ref}
            uuid={uuid}
            width={width}
            height={height}
            data={data}
            columns={columns as any}
            rowHeight={rowHeight}
            minColumnWidth={minColumnWidth}
            style={style}
            className={className}
            rowClassname={rowClassname}
            rowStyle={rowStyle}
            itemKey={itemKey as any}
            onSort={onSort}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            headerStyle={headerStyle}
            headerClassname={headerClassname}
            subComponent={subComponent as any}
            expandedRows={expandedRows}
            onExpandRow={onExpandRow as any}
            stickyFooter={stickyFooter}
            footerComponent={footerComponent as any}
            footerClassname={footerClassname}
            footerStyle={footerStyle}
            onRowClick={onRowClick as any}
            rowRenderer={rowRenderer as any}
          />
        );
      }}
    </AutoSizer>
  );
});

Table.displayName = "Table";

export default Table;
