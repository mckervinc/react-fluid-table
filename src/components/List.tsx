import { useVirtualizer } from "@tanstack/react-virtual";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { ScrollAlignment, TableProps, TableRef } from "../..";
import { FOOTER_HEIGHT, HEADER_HEIGHT, ROW_HEIGHT } from "../constants";
import {
  arraysMatch,
  calculateColumnWidths,
  cx,
  findColumnWidthConstants,
  getElemHeight
} from "../util";
import Footer from "./Footer";
import Header from "./Header";
import Row from "./Row";

type ListProps<T> = Omit<
  TableProps<T>,
  | "tableWidth"
  | "tableHeight"
  | "footerHeight"
  | "headerHeight"
  | "minTableHeight"
  | "maxTableHeight"
> & {
  uuid: string;
  height: number;
  width: number;
  tableHeight: number;
  maxTableHeight: number;
  headerHeight: number;
  footerHeight: number;
};

function BaseList<T>(
  {
    id,
    uuid,
    width,
    data,
    columns,
    rowHeight,
    headerStyle,
    headerClassname,
    itemKey,
    onSort,
    sortColumn,
    sortDirection,
    expandedRows,
    onRowClick,
    onLoadRows,
    onExpandRow,
    subComponent,
    className,
    rowClassname,
    rowStyle,
    footerStyle,
    footerClassname,
    footerComponent,
    stickyFooter,
    tableHeight,
    maxTableHeight,
    estimatedRowHeight,
    style = {},
    asyncOverscan = 1,
    minColumnWidth = 80,
    endComponent: EndComponent,
    height: estimatedHeight,
    headerHeight: heightOfHeader,
    footerHeight: heightOfFooter
  }: ListProps<T>,
  ref: React.ForwardedRef<TableRef>
) {
  // hooks
  const parentRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const prevRowHeight = useRef(rowHeight ?? estimatedRowHeight);
  const [widthConstants, setWidthConstants] = useState(findColumnWidthConstants(columns));
  const [pixelWidths, setPixelWidths] = useState<number[]>(() => {
    const { fixedWidth, remainingCols } = widthConstants;
    return calculateColumnWidths(width, remainingCols, fixedWidth, minColumnWidth, columns);
  });
  const [expandedCache, setExpandedCache] = useState<Record<string | number, boolean>>({});
  const generateKeyFromRow = useCallback(
    (row: T, defaultValue: number) => itemKey?.(row) ?? defaultValue,
    [itemKey]
  );
  const virtualizer = useVirtualizer({
    count: data.length + (EndComponent ? 1 : 0),
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight ?? estimatedRowHeight ?? ROW_HEIGHT,
    getItemKey: index => generateKeyFromRow(data[index], index)
  });

  // constants
  const items = virtualizer.getVirtualItems();
  const { measure: recalculate, measurementsCache } = virtualizer;
  const { fixedWidth, remainingCols } = widthConstants;

  // calculate body height
  const bodyHeight = useMemo(() => {
    // do not calculate if tableHeight is specfied/no max specified
    if (tableHeight > 0 || maxTableHeight <= 0) {
      return null;
    }

    // calculate body height
    let bodyHeight = 0;
    for (let i = 0; i < measurementsCache.length; i++) {
      bodyHeight += measurementsCache[i].size;
      if (bodyHeight >= maxTableHeight) {
        bodyHeight = maxTableHeight;
        break;
      }
    }

    return bodyHeight;
  }, [maxTableHeight, measurementsCache, tableHeight]);

  // calculate the height
  const height = useMemo(() => {
    if (tableHeight > 0) {
      return tableHeight;
    }

    if (maxTableHeight > 0) {
      // calculate border height
      const table = parentRef.current?.parentElement;
      const borderHeight = table ? table.offsetHeight - table.clientHeight : 0;

      // compute
      const headerHeight = getElemHeight(headerRef.current, heightOfHeader, HEADER_HEIGHT);
      const footerHeight = getElemHeight(footerRef.current, heightOfFooter, FOOTER_HEIGHT);
      return (
        Math.min(headerHeight + bodyHeight! + footerHeight + borderHeight * 2, maxTableHeight) + 2
      );
    }

    return estimatedHeight;
  }, [bodyHeight, estimatedHeight, heightOfFooter, heightOfHeader, maxTableHeight, tableHeight]);

  // functions
  const isRowExpanded = typeof expandedRows === "function" ? expandedRows : undefined;

  const onExpand = useCallback(
    (
      row: T,
      index: number,
      rowKey: string | number,
      event?: React.MouseEvent<Element, MouseEvent>
    ) => {
      const toggleExpanded = !expandedCache[rowKey];
      onExpandRow?.({ row, index, isExpanded: toggleExpanded, event });
      if (!onExpandRow) {
        setExpandedCache(prev => ({ ...prev, [rowKey]: toggleExpanded }));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [expandedCache]
  );

  const lastItem = items.length ? items[items.length - 1] : null;
  const row = lastItem ? data[lastItem.index] : null;
  const onLoadMore = useCallback(async () => {
    if (!onLoadRows || !lastItem || !row) {
      return;
    }

    if (lastItem.index >= data.length - asyncOverscan && !loadingMore) {
      setLoadingMore(true);
      try {
        await onLoadRows();
      } finally {
        setLoadingMore(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastItem, data.length, loadingMore, row, asyncOverscan]);

  // effects
  // update pixel widths every time the width changes
  useLayoutEffect(() => {
    const widths = calculateColumnWidths(
      parentRef.current?.clientWidth ?? width,
      remainingCols,
      fixedWidth,
      minColumnWidth,
      columns
    );

    setPixelWidths(prev => (!arraysMatch(widths, prev) ? widths : prev));
  }, [width, remainingCols, fixedWidth, minColumnWidth, columns]);

  // remeasure if the rowHeight changes
  useLayoutEffect(() => {
    const toCheck = rowHeight ?? estimatedRowHeight;
    if (prevRowHeight.current !== toCheck) {
      recalculate();
    }

    prevRowHeight.current = toCheck;
  }, [estimatedRowHeight, rowHeight, recalculate]);

  // set the width constants
  useEffect(() => setWidthConstants(findColumnWidthConstants(columns)), [columns]);

  // initialize expansion
  useEffect(() => {
    if (expandedRows && typeof expandedRows !== "function") {
      setExpandedCache(expandedRows);
    }
  }, [expandedRows]);

  // handle async fetching
  useEffect(() => {
    onLoadMore();
  }, [onLoadMore]);

  // provide access to window functions
  useImperativeHandle(ref, () => ({
    scrollTo: (scrollOffset: number): void => virtualizer.scrollToOffset(scrollOffset),
    scrollToItem: (index: number, align: ScrollAlignment = "auto"): void =>
      virtualizer.scrollToIndex(index, { align })
  }));

  return (
    <div
      id={id}
      ref={parentRef}
      data-table-key={uuid}
      className={cx("rft", className)}
      style={{ ...style, height, width }}
    >
      <Header
        uuid={uuid}
        ref={headerRef}
        pixelWidths={pixelWidths}
        columns={columns}
        className={headerClassname}
        style={headerStyle}
        onSort={onSort}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
      />
      <div className="rft-body" style={{ height: virtualizer.getTotalSize() }}>
        {items.map(({ index, start }) => {
          const isEndRow = index > data.length - 1;
          if (isEndRow && !!EndComponent) {
            const key = `${uuid}-end`;
            return (
              <div
                key={key}
                ref={virtualizer.measureElement}
                className="rft-end"
                data-index={index}
                data-row-key={key}
                style={{ transform: `translateY(${start}px)` }}
              >
                <EndComponent isLoading={loadingMore} />
              </div>
            );
          }

          const row = data[index];
          const fargs = { row, index };
          const key = generateKeyFromRow(row, index);
          const isExpanded = isRowExpanded?.(fargs) ?? !!expandedCache[key];
          const className = typeof rowClassname === "function" ? rowClassname(fargs) : rowClassname;
          const style = typeof rowStyle === "function" ? rowStyle(fargs) : rowStyle;
          return (
            <Row
              ref={virtualizer.measureElement}
              key={key}
              row={row}
              uuid={uuid}
              rowKey={key}
              style={style}
              offset={start}
              className={className}
              isExpanded={isExpanded}
              onRowClick={onRowClick}
              onExpand={onExpand}
              index={index}
              columns={columns}
              pixelWidths={pixelWidths}
              subComponent={subComponent}
            />
          );
        })}
      </div>
      <Footer
        uuid={uuid}
        rows={data}
        ref={footerRef}
        sticky={stickyFooter}
        columns={columns}
        pixelWidths={pixelWidths}
        className={footerClassname}
        style={footerStyle}
        component={footerComponent}
      />
    </div>
  );
}

const List = forwardRef(BaseList) as <T>(
  props: ListProps<T> & { ref?: React.ForwardedRef<TableRef> }
) => React.JSX.Element;
(List as React.FC).displayName = "List";

export default List;
