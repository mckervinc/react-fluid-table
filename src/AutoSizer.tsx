import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { TableContext } from "./TableContext";
import { DEFAULT_HEADER_HEIGHT, DEFAULT_ROW_HEIGHT } from "./constants";
import { findHeaderByUuid } from "./util";

interface AutoSizerProps {
  numRows: number;
  rowHeight?: number;
  tableWidth?: number;
  tableHeight?: number;
  minTableHeight?: number;
  maxTableHeight?: number;
  children: ({ height, width }: { height: number; width: number }) => React.ReactNode;
}

interface Heights {
  tableHeight: number;
  containerHeight: number;
  computedHeight: number;
  minHeight: number;
  maxHeight: number;
}

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

      // if no maxHeight provided, then treat
      // the computedHeight as the maxHeight
      if (!maxHeight && computedHeight > 0) {
        return Math.max(curr, computedHeight);
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

const calculateHeight = (rowHeight: number, uuid: string, size: number) => {
  // get the header and nodes
  const header = findHeaderByUuid(uuid);
  const nodes = [...(header?.nextElementSibling?.children || [])] as HTMLElement[];

  if (!!header && !!nodes.length) {
    // get border height
    let borders = 0;
    const table = header.parentElement?.parentElement;
    if (!!table) {
      borders = table.offsetHeight - table.clientHeight;
    }

    // perform calculation
    if (rowHeight > 0) {
      return header.clientHeight + nodes.length * rowHeight + borders;
    }

    let overscan = 0;
    return (
      header.clientHeight +
      nodes.reduce((pv, c) => {
        overscan = c.offsetHeight;
        return pv + c.offsetHeight;
      }, 0) +
      overscan +
      borders
    );
  }

  // if the header and nodes are not specified, guess the height
  const height = Math.max(rowHeight || DEFAULT_ROW_HEIGHT, 10);
  return height * Math.min(size || 10, 10) + DEFAULT_HEADER_HEIGHT;
};

/**
 * This is a skinny AutoSizer based on react-virtualized-auto-sizer.
 * This removes the `bailout` functionality in order to allow the Table
 * to generate its own height. This also ignores a resize if the
 * dimensions of the window did not actually change (one less render).
 */
const AutoSizer = ({
  numRows,
  rowHeight,
  tableWidth,
  tableHeight,
  minTableHeight,
  maxTableHeight,
  children
}: AutoSizerProps) => {
  // hooks
  const resizeRef = useRef(0);
  const ref = useRef<HTMLDivElement>(null);
  const { uuid } = useContext(TableContext);
  const [dimensions, setDimensions] = useState({ containerHeight: 0, containerWidth: 0 });

  // variables
  const { containerHeight, containerWidth } = dimensions;

  // calculate the computed height
  const computedHeight = useMemo(() => {
    if (!!tableHeight && tableHeight > 0) {
      return tableHeight;
    }

    return calculateHeight(rowHeight || 0, uuid, numRows);
  }, [tableHeight, rowHeight, numRows, uuid]);

  // calculate the actual height of the table
  const height = findCorrectHeight({
    computedHeight,
    containerHeight,
    tableHeight: tableHeight || 0,
    minHeight: minTableHeight || 0,
    maxHeight: maxTableHeight || 0
  });

  // get actual width
  const width = !!tableWidth && tableWidth > 0 ? tableWidth : containerWidth;

  // functions
  const calculateDimensions = useCallback(() => {
    // base cases
    if (!ref.current?.parentElement) {
      return;
    }

    // get style
    const parent = ref.current.parentElement;
    const style = window.getComputedStyle(parent);
    const paddingLeft = parseInt(style.paddingLeft) || 0;
    const paddingRight = parseInt(style.paddingRight) || 0;
    const paddingTop = parseInt(style.paddingTop) || 0;
    const paddingBottom = parseInt(style.paddingBottom) || 0;

    // find new dimensions
    const newHeight = (parent.offsetHeight || 0) - paddingTop - paddingBottom;
    const newWidth = (parent.offsetWidth || 0) - paddingLeft - paddingRight;

    // update state
    if (newHeight !== containerHeight || newWidth !== containerWidth) {
      setDimensions({ containerHeight: newHeight, containerWidth: newWidth });
    }
  }, [containerHeight, containerWidth]);

  const onResize = useCallback(() => {
    window.clearTimeout(resizeRef.current);
    resizeRef.current = window.setTimeout(calculateDimensions, 40);
  }, [calculateDimensions]);

  // effects
  // on mount, calculate the dimensions
  useEffect(() => calculateDimensions(), []);

  // on resize, we have to re-calculate the dimensions
  useEffect(() => {
    window.addEventListener("resize", onResize);
    const m = resizeRef.current;
    return () => {
      window.clearTimeout(m);
      window.removeEventListener("resize", onResize);
    };
  }, [onResize]);

  return <div ref={ref}>{height || width ? children({ height, width }) : null}</div>;
};

export default AutoSizer;
