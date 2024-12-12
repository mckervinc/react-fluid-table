import { useVirtualizer } from "@tanstack/react-virtual";
import React, {
  forwardRef,
  JSX,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from "react";
import {
  ColumnProps,
  FooterProps,
  RowRenderProps,
  ScrollAlignment,
  SortDirection,
  SubComponentProps,
  TableRef
} from "../..";
import { DEFAULT_ROW_HEIGHT } from "../constants";
import { arraysMatch, calculateColumnWidths, cx, findColumnWidthConstants } from "../util";
import Header from "./Header";
import Row from "./Row";
import Footer from "./Footer";

type ListProps<T> = {
  id?: string;
  uuid: string;
  height: number;
  width: number;
  minColumnWidth: number;
  data: T[];
  columns: ColumnProps<T>[];
  rowHeight?: number;
  className?: string;
  style?: React.CSSProperties;
  headerStyle?: React.CSSProperties;
  headerClassname?: string;
  rowClassname?: string | ((index: number) => string | undefined);
  rowStyle?: React.CSSProperties | ((index: number) => React.CSSProperties | undefined);
  sortColumn?: string;
  sortDirection?: SortDirection | null;
  itemKey?: (row: T) => string | number;
  onSort?: (col: string, dir: SortDirection | null) => void;
  expandedRows?: { [x: string | number]: boolean };
  onExpandRow?: (value: {
    row: T;
    index: number;
    isExpanded: boolean;
    event?: React.MouseEvent<Element, MouseEvent>;
  }) => void;
  subComponent?: (props: SubComponentProps<T>) => React.ReactNode | JSX.Element;
  stickyFooter?: boolean;
  footerComponent?: (props: FooterProps<T>) => React.ReactNode;
  footerClassname?: string;
  footerStyle?: React.CSSProperties;
  onRowClick?: (data: {
    row: T;
    index: number;
    event?: React.MouseEvent<Element, MouseEvent>;
  }) => void;
  rowRenderer?: (props: RowRenderProps<T>) => JSX.Element;
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
    minColumnWidth,
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
    style = {}
  }: ListProps<T>,
  ref: React.ForwardedRef<TableRef>
) {
  // hooks
  const parentRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
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
    if (expandedRows) {
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
          className="rft-inner-container"
          style={{
            transform: `translateY(${items[0]?.start ?? 0}px)`
          }}
        >
          <div className="rft-row-wrapper">
            {items.map(item => {
              const row = data[item.index];
              const key = generateKeyFromRow(row, item.index);
              const isExpanded = !!expandedCache[key];
              const className =
                typeof rowClassname === "function" ? rowClassname(item.index) : rowClassname;
              const style = typeof rowStyle === "function" ? rowStyle(item.index) : rowStyle;
              return (
                <Row
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
                  ref={virtualizer.measureElement}
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
