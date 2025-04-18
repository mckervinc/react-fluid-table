import React, { useMemo } from "react";
import { useResizeDetector } from "react-resize-detector";
import { ESTIMATED_NUM_ROWS, FOOTER_HEIGHT, HEADER_HEIGHT, ROW_HEIGHT } from "./constants";
import { findFooterByUuid, findHeaderByUuid, getElemHeight } from "./util";

type EstimatedArgs = {
  estimatedRow: number;
  estimatedHeader: number;
  estimatedFooter: number;
  maxHeight: number;
};

const estimateTableHeight = (
  uuid: string,
  size: number,
  hasFooter: boolean,
  dimensions: EstimatedArgs
) => {
  const { estimatedRow, estimatedHeader, estimatedFooter, maxHeight } = dimensions;

  // find the header height
  const header = findHeaderByUuid(uuid);
  const headerHeight = getElemHeight(header, estimatedHeader, HEADER_HEIGHT);

  // find footer height
  const footerHeight = hasFooter
    ? getElemHeight(findFooterByUuid(uuid), estimatedFooter, FOOTER_HEIGHT)
    : 0;

  // calculate border height
  const table = header?.parentElement;
  const borderHeight = table ? table.offsetHeight - table.clientHeight : 0;

  // for the rows, calculate the height of all the rows
  const rowHeight = estimatedRow || ROW_HEIGHT;
  const numRows =
    maxHeight > 0 ? size : Math.min(size || ESTIMATED_NUM_ROWS, ESTIMATED_NUM_ROWS) + 1;
  const bodyHeight = numRows * rowHeight;

  const result = headerHeight + bodyHeight + borderHeight + footerHeight;
  return maxHeight > 0 ? Math.min(maxHeight, result) : result;
};

type AutoSizerDimensions = {
  rowHeight: number;
  headerHeight: number;
  footerHeight: number;
  tableWidth: number;
  tableHeight: number;
  minTableHeight: number;
  maxTableHeight: number;
  estimatedRowHeight: number;
};

type AutoSizerProps = {
  uuid: string;
  hasFooter: boolean;
  numRows: number;
  dimensions: AutoSizerDimensions;
  children: ({ height, width }: { height: number; width: number }) => React.ReactNode;
};

/**
 * This is a skinny AutoSizer based on react-virtualized-auto-sizer.
 * This removes the `bailout` functionality in order to allow the Table
 * to generate its own height. This uses ResizeObserver to observe the
 * container when it changes in order to provide the correct height
 */
const AutoSizer = ({ uuid, hasFooter, numRows, dimensions, children }: AutoSizerProps) => {
  // hooks
  const {
    ref,
    width: containerWidth = 0,
    height: containerHeight = 0
  } = useResizeDetector<HTMLDivElement>();

  // instance
  const {
    rowHeight,
    tableWidth,
    tableHeight,
    footerHeight,
    headerHeight,
    minTableHeight,
    maxTableHeight,
    estimatedRowHeight
  } = dimensions;

  // calculate the initial height of the table
  const height = useMemo(() => {
    if (tableHeight > 0) {
      return tableHeight;
    }

    const computedHeight = estimateTableHeight(uuid, numRows, hasFooter, {
      estimatedRow: rowHeight || estimatedRowHeight,
      estimatedHeader: headerHeight || HEADER_HEIGHT,
      estimatedFooter: footerHeight || FOOTER_HEIGHT,
      maxHeight: maxTableHeight
    });

    if (minTableHeight > 0 || maxTableHeight > 0) {
      return Math.min(Math.max(minTableHeight, computedHeight), maxTableHeight);
    }

    return containerHeight || computedHeight;
  }, [
    uuid,
    numRows,
    hasFooter,
    rowHeight,
    estimatedRowHeight,
    headerHeight,
    footerHeight,
    containerHeight,
    tableHeight,
    minTableHeight,
    maxTableHeight
  ]);

  // get actual width
  const width = tableWidth > 0 ? tableWidth : containerWidth;

  return (
    <div ref={ref} className="rft-sizer">
      {height && width ? children({ height, width }) : null}
    </div>
  );
};

export default AutoSizer;
