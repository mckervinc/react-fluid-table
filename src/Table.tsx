import React, {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { VariableSizeList } from "react-window";
import { TableProps, TableRef } from "../index";
import AutoSizer from "./AutoSizer";
import Header from "./Header";
import NumberTree from "./NumberTree";
import RowWrapper from "./RowWrapper";
import { TableContext, TableContextProvider } from "./TableContext";
import TableWrapper from "./TableWrapper";
import { DEFAULT_HEADER_HEIGHT, DEFAULT_ROW_HEIGHT, NO_NODE } from "./constants";
import {
  arraysMatch,
  calculateColumnWidths,
  findHeaderByUuid,
  findRowByUuidAndKey,
  randomString
} from "./util";

interface Data<T> {
  rows: T[];
  [key: string]: any;
}

interface ListProps<T> extends Omit<TableProps<T>, "columns" | "borders"> {
  height: number;
  width: number;
  borders: boolean;
}

/**
 * The main table component
 */
const ListComponent = forwardRef(function (
  {
    data,
    width,
    height,
    itemKey,
    rowHeight,
    className,
    headerHeight,
    footerComponent,
    ...rest
  }: ListProps<any>,
  ref: React.ForwardedRef<TableRef>
) {
  // hooks
  const timeoutRef = useRef(0);
  const listRef = useRef<any>(null);
  const prevWidthRef = useRef(width);
  const treeRef = useRef(new NumberTree());
  const tableRef = useRef<HTMLDivElement>(null);
  const cacheRef = useRef<{ [index: number]: number }>({});
  const defaultSizeRef = useRef(rowHeight || DEFAULT_ROW_HEIGHT);
  const { dispatch, uuid, columns, minColumnWidth, fixedWidth, remainingCols, pixelWidths } =
    useContext(TableContext);
  const [useRowWidth, setUseRowWidth] = useState(true);

  // constants
  const hasFooter = useMemo(() => {
    return !!footerComponent || !!columns.find(c => !!c.footer);
  }, [footerComponent, columns]);

  // functions
  const generateKeyFromRow = useCallback(
    function <T>(row: T, defaultValue: number) {
      const generatedKey = itemKey ? itemKey(row) : undefined;
      return generatedKey !== undefined ? generatedKey : defaultValue;
    },
    [itemKey]
  );

  const clearSizeCache = useCallback((dataIndex: number, forceUpdate = false) => {
    if (!listRef.current) {
      return;
    }

    window.clearTimeout(timeoutRef.current);
    if (forceUpdate) {
      treeRef.current.clearFromIndex(dataIndex);
      listRef.current.resetAfterIndex(dataIndex + 1);
      return;
    }

    timeoutRef.current = window.setTimeout(() => {
      const node = tableRef.current?.children[1].children[0] as HTMLElement;
      const resetIndex = parseInt(node?.dataset.index || "0") + 1;
      treeRef.current.clearFromIndex(resetIndex);
      listRef.current.resetAfterIndex(resetIndex);
    }, 50);
  }, []);

  const calculateHeight = useCallback(
    (queryParam: number | HTMLElement, optionalDataIndex: number | null = null) => {
      const dataIndex = (typeof queryParam === "number" ? queryParam : optionalDataIndex) as number;
      const key = generateKeyFromRow(data[dataIndex], dataIndex);
      const row = typeof queryParam === "number" ? findRowByUuidAndKey(uuid, key) : queryParam;

      if (!row) {
        return cacheRef.current[dataIndex] || defaultSizeRef.current;
      }

      const arr = [...row.children].slice(rowHeight ? 1 : 0) as HTMLElement[];
      const res =
        arr.reduce((pv, c) => pv + c.offsetHeight, rowHeight || 0) || defaultSizeRef.current;

      // update the calculated height ref
      cacheRef.current[dataIndex] = res;
      return res;
    },
    [uuid, data, rowHeight, generateKeyFromRow]
  );

  const updatePixelWidths = useCallback(() => {
    const widths = calculateColumnWidths(
      tableRef.current,
      remainingCols,
      fixedWidth,
      minColumnWidth,
      columns
    );
    if (!arraysMatch(widths, pixelWidths)) {
      dispatch({ type: "updatePixelWidths", widths });
    }
  }, [dispatch, remainingCols, fixedWidth, minColumnWidth, pixelWidths, columns]);

  const shouldUseRowWidth = useCallback(() => {
    const parentElement = tableRef.current?.parentElement || NO_NODE;
    setUseRowWidth(parentElement.scrollWidth <= parentElement.clientWidth);
  }, []);

  // effects
  /* initializers */
  // initialize whether or not to use rowWidth (useful for bottom border)
  useEffect(() => {
    const widths = tableRef.current || NO_NODE;
    setUseRowWidth(widths.scrollWidth <= widths.clientWidth);
  }, []);

  /* updates */
  // update pixel widths every time the width changes
  useLayoutEffect(() => updatePixelWidths(), [width]);

  // check if we should use the row width when width changes
  useEffect(() => shouldUseRowWidth(), [width]);

  // manually alter the height of each row if height is incorrect
  // to help with flicker on resize
  useLayoutEffect(() => {
    if (prevWidthRef.current !== width) {
      treeRef.current.clearFromIndex(0);
      setTimeout(() => {
        if (!tableRef.current || !listRef.current) {
          return;
        }

        // variables
        let prevTop = 0;
        let prevHeight = 0;
        const cache = listRef.current._instanceProps.itemMetadataMap || {};
        const elements = [...tableRef.current.children[1].children] as HTMLElement[];

        // manually change the `top` and `height` for visible rows
        elements.forEach((node, i) => {
          const dataIndex = parseInt(node.dataset.index || "0");

          // if the row is incorrect, update the tops going forward
          const height: number = cache[dataIndex + 1].size;
          const computed = calculateHeight(node, dataIndex);

          // case 0: the first element, where the top is correct
          if (i === 0) {
            prevTop = parseInt(node.style.top);
            prevHeight = computed;

            if (height !== computed) {
              node.style.height = `${computed}px`;
            }
            return;
          }

          // case 1: every other element
          const newTop = prevTop + prevHeight;
          node.style.top = `${newTop}px`;
          if (height !== computed) {
            node.style.height = `${computed}px`;
          }

          prevTop = newTop;
          prevHeight = computed;
        });
      }, 0);
    }

    prevWidthRef.current = width;
  }, [width, calculateHeight]);

  // for the footer: set the rows in the context with the data.
  // this is useful for any aggregate calculations.
  // NOTE: maybe we should do this for the header too
  useEffect(() => {
    if (hasFooter) {
      dispatch({ type: "updateRows", rows: data });
    }
  }, [hasFooter, data, dispatch]);

  /* cleanup */
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [timeoutRef]);

  /* misc */
  // provide access to window functions
  useImperativeHandle(ref, () => ({
    scrollTo: (scrollOffset: number): void => listRef.current.scrollTo(scrollOffset),
    scrollToItem: (index: number, align: string = "auto"): void =>
      listRef.current.scrollToItem(index, align)
  }));

  return (
    <VariableSizeList
      className={className}
      ref={listRef}
      innerRef={tableRef}
      innerElementType={Header}
      outerElementType={TableWrapper}
      height={height}
      width={width}
      itemCount={data.length + 1}
      itemKey={(index: number, data: Data<any>) => {
        if (!index) return `${uuid}-header`;
        const row = data.rows[index - 1];
        return generateKeyFromRow(row, index);
      }}
      itemSize={index => {
        if (!index) {
          if (headerHeight && headerHeight > 0) {
            return headerHeight;
          }

          const header = findHeaderByUuid(uuid);
          return header ? (header.children[0] as HTMLElement).offsetHeight : DEFAULT_HEADER_HEIGHT;
        }

        return calculateHeight(index - 1);
      }}
      onItemsRendered={() => {
        // find median height of rows if no rowHeight provided
        if (rowHeight || !tableRef.current) {
          return;
        }

        // add calculated height to tree
        [...tableRef.current.children[1].children].forEach(e => {
          const node = e as HTMLDivElement;
          const dataIndex = parseInt(node.dataset.index || "0");
          if (!treeRef.current.hasIndex(dataIndex)) {
            treeRef.current.insert({
              index: dataIndex,
              height: calculateHeight(node, dataIndex)
            });
          }
        });

        defaultSizeRef.current = treeRef.current.getMedian();
      }}
      itemData={{
        rows: data,
        rowHeight,
        useRowWidth,
        clearSizeCache,
        calculateHeight,
        generateKeyFromRow,
        ...rest
      }}
    >
      {RowWrapper}
    </VariableSizeList>
  );
});

ListComponent.displayName = "ListComponent";

const Table = forwardRef(function <T>(
  {
    id,
    columns,
    onSort,
    sortColumn,
    sortDirection,
    tableHeight,
    tableWidth,
    tableStyle,
    headerStyle,
    headerClassname,
    footerComponent,
    footerStyle,
    footerClassname,
    maxTableHeight,
    minTableHeight,
    borders = false,
    minColumnWidth = 80,
    stickyFooter = false,
    ...rest
  }: TableProps<T>,
  ref: React.ForwardedRef<TableRef>
) {
  // TODO: do all prop validation here
  const [uuid] = useState(`${id || "data-table"}-${randomString(5)}`);

  // warn if a minHeight is set without a maxHeight
  let maxHeight = maxTableHeight;
  if (minTableHeight && minTableHeight > 0 && (!maxTableHeight || maxTableHeight <= 0)) {
    maxHeight = minTableHeight + 400;
  }

  // handle warning
  useEffect(() => {
    if (minTableHeight && minTableHeight > 0 && (!maxTableHeight || maxTableHeight <= 0)) {
      console.warn(
        `maxTableHeight was either not present, or is <= 0, but you provided a minTableHeight of ${minTableHeight}px. As a result, the maxTableHeight will be set to ${
          minTableHeight + 400
        }px. To avoid this warning, please specify a maxTableHeight.`
      );
    }
  }, [minTableHeight, maxTableHeight]);

  return (
    <TableContextProvider
      initialState={{
        id,
        uuid,
        columns,
        minColumnWidth,
        onSort,
        sortColumn,
        sortDirection,
        tableStyle,
        headerStyle,
        headerClassname,
        stickyFooter,
        footerComponent,
        footerClassname,
        footerStyle
      }}
    >
      <AutoSizer
        numRows={rest.data.length}
        tableWidth={tableWidth}
        tableHeight={tableHeight}
        rowHeight={rest.rowHeight}
        minTableHeight={minTableHeight}
        maxTableHeight={maxHeight}
        headerHeight={rest.headerHeight}
        footerHeight={rest.footerHeight}
      >
        {({ height, width }) => {
          return (
            <ListComponent
              ref={ref}
              borders={borders}
              width={width}
              height={height}
              footerComponent={footerComponent}
              {...rest}
            />
          );
        }}
      </AutoSizer>
    </TableContextProvider>
  );
});

Table.displayName = "Table";

export default Table;
