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
import { useResizeDetector } from "react-resize-detector";
import { ScrollAlignment, TableProps, TableRef } from "../..";
import { DEFAULT_ROW_HEIGHT, DEFAULT_SCROLLBAR_WIDTH } from "../constants";
import { arraysMatch, calculateColumnWidths, cx, findColumnWidthConstants } from "../util";
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
    onExpandRow,
    subComponent,
    className,
    rowClassname,
    rowStyle,
    footerStyle,
    footerClassname,
    footerComponent,
    stickyFooter,
    rowRenderer,
    tableHeight,
    maxTableHeight,
    estimatedRowHeight,
    style = {},
    minColumnWidth = 80,
    height: estimatedHeight
  }: ListProps<T>,
  ref: React.ForwardedRef<TableRef>
) {
  // hooks
  const parentRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const prevRowHeight = useRef(rowHeight ?? estimatedRowHeight);
  const { ref: innerRef, width: _innerWidth = 0 } = useResizeDetector<HTMLDivElement>();
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
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight ?? DEFAULT_ROW_HEIGHT,
    getItemKey: index => generateKeyFromRow(data[index], index)
  });

  // constants
  const isScrollHorizontal =
    (innerRef.current?.scrollWidth || 0) > innerWidth + DEFAULT_SCROLLBAR_WIDTH;
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
      const headerHeight = headerRef.current?.offsetHeight ?? 0;
      const footerHeight = footerRef.current?.offsetHeight ?? 0;
      return Math.min(headerHeight + bodyHeight! + footerHeight, maxTableHeight);
    }

    return estimatedHeight;
  }, [bodyHeight, estimatedHeight, maxTableHeight, tableHeight]);

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
    if (!arraysMatch(widths, pixelWidths)) {
      setPixelWidths(widths);
    }
  }, [width, remainingCols, fixedWidth, minColumnWidth, pixelWidths, columns]);

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
        isScrollHorizontal={isScrollHorizontal}
        pixelWidths={pixelWidths}
        columns={columns}
        className={headerClassname}
        style={headerStyle}
        onSort={onSort}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
      />
      <div className="rft-outer-container" style={{ height: virtualizer.getTotalSize() }}>
        <div
          ref={innerRef}
          className="rft-inner-container"
          style={{
            transform: `translateY(${items[0]?.start ?? 0}px)`
          }}
        >
          <div className={cx(isScrollHorizontal && "rft-row-wrapper")}>
            {items.map(({ index }) => {
              const row = data[index];
              const fargs = { row, index };
              const key = generateKeyFromRow(row, index);
              const isExpanded = isRowExpanded?.(fargs) ?? !!expandedCache[key];
              const className =
                typeof rowClassname === "function" ? rowClassname(fargs) : rowClassname;
              const style = typeof rowStyle === "function" ? rowStyle(fargs) : rowStyle;
              return (
                <Row
                  ref={virtualizer.measureElement}
                  rowHeight={rowHeight}
                  key={key}
                  row={row}
                  uuid={uuid}
                  rowKey={key}
                  style={style}
                  className={className}
                  isExpanded={isExpanded}
                  onRowClick={onRowClick}
                  rowRenderer={rowRenderer}
                  onExpand={onExpand}
                  index={index}
                  columns={columns}
                  pixelWidths={pixelWidths}
                  subComponent={subComponent}
                />
              );
            })}
          </div>
        </div>
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
        isScrollHorizontal={isScrollHorizontal}
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
