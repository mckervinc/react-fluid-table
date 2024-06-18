import React, { useContext, useMemo } from "react";
import { useResizeDetector } from "react-resize-detector";
import { TableContext } from "./TableContext";
import { DEFAULT_FOOTER_HEIGHT, DEFAULT_HEADER_HEIGHT, DEFAULT_ROW_HEIGHT } from "./constants";
import { findFooterByUuid, findHeaderByUuid, positive } from "./util";

type AutoSizerProps = {
  numRows: number;
  rowHeight?: number;
  headerHeight?: number;
  footerHeight?: number;
  tableWidth?: number;
  tableHeight?: number;
  minTableHeight?: number;
  maxTableHeight?: number;
  children: ({ height, width }: { height: number; width: number }) => React.ReactNode;
};

type Heights = {
  tableHeight: number;
  containerHeight: number;
  computedHeight: number;
  minHeight: number;
  maxHeight: number;
};

const findCorrectHeight = ({
  tableHeight,
  containerHeight,
  computedHeight,
  minHeight,
  maxHeight
}: Heights) => {
  // case 1: tableHeight is specified, so just return that
  if (tableHeight > 0) {
    return tableHeight;
  }

  // case 2: min or max is specified. this means that the table can grow/shrink,
  // depending upon the number of rows
  if (minHeight > 0 || maxHeight > 0) {
    let curr = computedHeight;
    if (minHeight > 0) {
      curr = Math.max(minHeight, curr);

      // if no maxHeight provided, in order to actually
      // enable the windowed features, we have to heuristically
      // use the maxHeight as minHeight + 400px;
      if (!maxHeight) {
        return Math.min(curr, minHeight + 400);
      }
    }

    if (maxHeight > 0) {
      curr = Math.min(maxHeight, curr);
    }

    return curr;
  }

  // case 3: no min/max specified, so just return the containerHeight.
  // if no containerHeight, return the computedHeight
  return containerHeight || computedHeight;
};

const calculateHeight = (
  rowHeight: number,
  headerHeight: number,
  footerHeight: number,
  uuid: string,
  size: number,
  hasFooter: boolean
) => {
  // get the header and the rows of the table
  const header = findHeaderByUuid(uuid);
  const nodes = [...(header?.nextElementSibling?.children || [])] as HTMLElement[];

  // calculate header & footer offsets
  const headerOffset =
    headerHeight > 0 ? headerHeight : header?.offsetHeight || DEFAULT_HEADER_HEIGHT;
  let footerOffset = 0;
  if (hasFooter) {
    footerOffset =
      footerHeight > 0
        ? footerHeight
        : findFooterByUuid(uuid)?.offsetHeight || DEFAULT_FOOTER_HEIGHT;
  }

  // calculate border offset
  const table = header?.parentElement?.parentElement;
  const borderOffset = !!table ? table.offsetHeight - table.clientHeight : 0;

  // if there are rows, let's do the calculation
  if (nodes.length) {
    if (rowHeight > 0) {
      return headerOffset + nodes.length * rowHeight + footerOffset + borderOffset;
    }

    let overscan = 0;
    return (
      headerOffset +
      nodes.reduce((pv, c) => {
        overscan = c.offsetHeight;
        return pv + c.offsetHeight;
      }, 0) +
      overscan +
      footerOffset +
      borderOffset
    );
  }

  // if the nodes are not specified, guess the height
  const height = Math.max(rowHeight || DEFAULT_ROW_HEIGHT, 10);
  return headerOffset + height * Math.min(size || 10, 10) + footerOffset + borderOffset;
};

/**
 * This is a skinny AutoSizer based on react-virtualized-auto-sizer.
 * This removes the `bailout` functionality in order to allow the Table
 * to generate its own height. This uses ResizeObserver to observe the
 * container when it changes in order to provide the correct height
 */
const AutoSizer = ({
  numRows,
  rowHeight,
  tableWidth,
  tableHeight,
  minTableHeight,
  maxTableHeight,
  headerHeight,
  footerHeight,
  children
}: AutoSizerProps) => {
  // hooks
  const {
    ref,
    width: containerWidth,
    height: containerHeight
  } = useResizeDetector<HTMLDivElement>();
  const { uuid, columns, footerComponent } = useContext(TableContext);

  // variables
  const hasFooter = useMemo(
    () => !!footerComponent || !!columns.find(c => !!c.footer),
    [columns, footerComponent]
  );

  // calculate the computed height
  const computedHeight = useMemo(() => {
    if (positive(tableHeight)) {
      return tableHeight;
    }

    return calculateHeight(
      rowHeight || 0,
      headerHeight || 0,
      footerHeight || 0,
      uuid,
      numRows,
      hasFooter
    );
  }, [tableHeight, rowHeight, headerHeight, footerHeight, numRows, uuid, hasFooter]);

  // calculate the actual height of the table
  const height = findCorrectHeight({
    computedHeight,
    containerHeight: containerHeight || 0,
    tableHeight: tableHeight || 0,
    minHeight: minTableHeight || 0,
    maxHeight: maxTableHeight || 0
  });

  // get actual width
  const width = positive(tableWidth) ? tableWidth : containerWidth || 0;

  return <div ref={ref}>{height || width ? children({ height, width }) : null}</div>;
};

export default AutoSizer;
