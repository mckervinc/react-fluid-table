import { useVirtualizer } from "@tanstack/react-virtual";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from "react";
import { useResizeDetector } from "react-resize-detector";
import { ColumnProps, ScrollAlignment, TableProps, TableRef } from "../..";
import { DEFAULT_ROW_HEIGHT } from "../constants";
import { arraysMatch, calculateColumnWidths, cx, findColumnWidthConstants } from "../util";
import Footer from "./Footer";
import Header from "./Header";
import Row from "./Row";

type ListProps<T> = TableProps<T> & {
  uuid: string;
  height: number;
  width: number;
};

const syncScroll = (source: HTMLElement | null, target: HTMLElement | null) => {
  if (source && target) {
    target.scrollLeft = source.scrollLeft;
  }
};

const List = forwardRef(function <T>(
  {
    id,
    uuid,
    height,
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
    style = {},
    minColumnWidth = 80
  }: ListProps<T>,
  ref: React.ForwardedRef<TableRef>
) {
  // hooks
  const parentRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const { ref: innerRef, width: innerWidth = 0 } = useResizeDetector<HTMLDivElement>();
  const [pixelWidths, setPixelWidths] = useState<number[]>([]);
  const [widthConstants, setWidthConstants] = useState(findColumnWidthConstants(columns));
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
  const showRowWrapper = (innerRef.current?.scrollWidth || 0) > innerWidth;
  const items = virtualizer.getVirtualItems();
  const { fixedWidth, remainingCols } = widthConstants;

  // functions
  const updatePixelWidths = useCallback(() => {
    const widths = calculateColumnWidths(
      parentRef.current,
      remainingCols,
      fixedWidth,
      minColumnWidth,
      columns
    );
    if (!arraysMatch(widths, pixelWidths)) {
      setPixelWidths(widths);
    }
  }, [remainingCols, fixedWidth, minColumnWidth, pixelWidths, columns]);
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
    [expandedCache]
  );

  // Event listeners for scroll events
  const parentScroll = useCallback(() => syncScroll(parentRef.current, headerRef.current), []);
  const headerScroll = useCallback(() => syncScroll(headerRef.current, parentRef.current), []);

  // effects
  // update pixel widths every time the width changes
  useEffect(() => updatePixelWidths(), [width]);

  // set the width constants
  useEffect(() => setWidthConstants(findColumnWidthConstants(columns)), [columns]);

  // initialize expansion
  useEffect(() => {
    if (expandedRows && typeof expandedRows !== "function") {
      setExpandedCache(expandedRows);
    }
  }, [expandedRows]);

  // Attach scroll listeners when component mounts
  useEffect(() => {
    parentRef.current?.addEventListener("scroll", parentScroll);
    headerRef.current?.addEventListener("scroll", headerScroll);

    // Clean up event listeners when component unmounts
    return () => {
      parentRef.current?.removeEventListener("scroll", parentScroll);
      headerRef.current?.removeEventListener("scroll", headerScroll);
    };
  }, []);

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
        ref={headerRef}
        uuid={uuid}
        showRowWrapper={showRowWrapper}
        pixelWidths={pixelWidths}
        columns={columns as ColumnProps<any>[]}
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
          <div className={cx(showRowWrapper && "rft-row-wrapper")}>
            {items.map(item => {
              const row = data[item.index];
              const key = generateKeyFromRow(row, item.index);
              const isExpanded = isRowExpanded?.(item.index) ?? !!expandedCache[key];
              const className =
                typeof rowClassname === "function" ? rowClassname(item.index) : rowClassname;
              const style = typeof rowStyle === "function" ? rowStyle(item.index) : rowStyle;
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
                  onRowClick={onRowClick as any}
                  rowRenderer={rowRenderer as any}
                  onExpand={onExpand as any}
                  index={item.index}
                  columns={columns as any}
                  pixelWidths={pixelWidths}
                  subComponent={subComponent as any}
                />
              );
            })}
          </div>
        </div>
      </div>
      <Footer
        uuid={uuid}
        rows={data}
        sticky={stickyFooter}
        columns={columns as ColumnProps<any>[]}
        pixelWidths={pixelWidths}
        className={footerClassname}
        style={footerStyle}
        component={footerComponent as any}
      />
    </div>
  );
});

export default List;
