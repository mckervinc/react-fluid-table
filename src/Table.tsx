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
import { ClearCacheOptions, ScrollAlign, TableProps, TableRef } from "../index";
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
  positive,
  randomString
} from "./util";

type Data<T> = {
  rows: T[];
  [key: string]: any;
};

type ListProps<T> = Omit<TableProps<T>, "columns" | "borders"> & {
  height: number;
  width: number;
  borders: boolean;
};

type ListRef<T = any> = VariableSizeList<T> & {
  _instanceProps: {
    itemMetadataMap: {
      [x: number]: { size: number };
    };
  };
};

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
  const listRef = useRef<ListRef>(null);
  const prevWidthRef = useRef(width);
  const [tree] = useState(new NumberTree());
  const tableRef = useRef<HTMLDivElement>(null);
  const [useRowWidth, setUseRowWidth] = useState(true);
  const cacheRef = useRef<{ [index: number]: number }>({});
  const defaultSizeRef = useRef(rowHeight || DEFAULT_ROW_HEIGHT);
  const { dispatch, uuid, columns, minColumnWidth, fixedWidth, remainingCols, pixelWidths } =
    useContext(TableContext);

  // constants
  const footerExists = !!footerComponent;
  const hasFooter = useMemo(() => {
    return footerExists || !!columns.find(c => !!c.footer);
  }, [footerExists, columns]);

  // functions
  const generateKeyFromRow = useCallback(
    function <T>(row: T, defaultValue: number) {
      const generatedKey = itemKey ? itemKey(row) : undefined;
      return generatedKey !== undefined ? generatedKey : defaultValue;
    },
    [itemKey]
  );

  const clearSizeCache = useCallback(
    (
      dataIndex: number,
      { forceUpdate, timeout }: ClearCacheOptions = { forceUpdate: false, timeout: 50 }
    ) => {
      if (!listRef.current) {
        return;
      }

      window.clearTimeout(timeoutRef.current);
      if (forceUpdate) {
        tree.clearFromIndex(dataIndex);
        listRef.current.resetAfterIndex(dataIndex + 1);
        return;
      }

      timeoutRef.current = window.setTimeout(() => {
        const node = tableRef.current?.children[1].children[0] as HTMLElement;
        const resetIndex = Number(node?.dataset.index || "0") + 1;
        tree.clearFromIndex(resetIndex);
        listRef.current!.resetAfterIndex(resetIndex);
      }, timeout);
    },
    []
  );

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

  // add clear function to the context
  useLayoutEffect(() => {
    dispatch({
      type: "initializeCacheFunction",
      clearSizeCache: (index: number, shouldRevalidate?: boolean) => {
        window.clearTimeout(timeoutRef.current);
        listRef.current?.resetAfterIndex(index, shouldRevalidate);
      }
    });
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
      tree.clearFromIndex(0);
      window.setTimeout(() => {
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
          const dataIndex = Number(node.dataset.index || "0");

          // if the row is incorrect, update the tops going forward
          const height: number = cache[dataIndex + 1].size;
          const computed = calculateHeight(node, dataIndex);

          // case 0: the first element, where the top is correct
          if (i === 0) {
            prevTop = Number(node.style.top);
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
  }, []);

  /* misc */
  // provide access to window functions
  useImperativeHandle(ref, () => ({
    scrollTo: (scrollOffset: number): void => listRef.current!.scrollTo(scrollOffset),
    scrollToItem: (index: number, align: ScrollAlign = "auto"): void =>
      listRef.current!.scrollToItem(index, align)
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
      itemKey={function <T>(index: number, data: Data<T>) {
        if (!index) return `${uuid}-header`;
        const row = data.rows[index - 1];
        return generateKeyFromRow(row, index);
      }}
      itemSize={index => {
        if (!index) {
          if (positive(headerHeight)) {
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
          const dataIndex = Number(node.dataset.index || "0");
          if (!tree.hasIndex(dataIndex)) {
            tree.insert({
              index: dataIndex,
              height: calculateHeight(node, dataIndex)
            });
          }
        });

        defaultSizeRef.current = tree.getMedian();
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

let warned = false;

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
    headerHeight,
    headerClassname,
    footerComponent,
    footerStyle,
    footerClassname,
    maxTableHeight,
    minTableHeight,
    expandedRows,
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
    <TableContextProvider
      initialState={{
        id,
        uuid,
        columns,
        minColumnWidth,
        onSort,
        sortColumn: sortColumn || null,
        sortDirection: sortDirection || null,
        tableStyle,
        headerStyle,
        headerHeight,
        headerClassname,
        stickyFooter,
        footerComponent,
        footerClassname,
        footerStyle,
        expanded: typeof expandedRows === "function" ? expandedRows : undefined,
        expandedCache: expandedRows && typeof expandedRows !== "function" ? expandedRows : {}
      }}
    >
      <AutoSizer
        numRows={rest.data.length}
        tableWidth={tableWidth}
        tableHeight={tableHeight}
        rowHeight={rest.rowHeight}
        minTableHeight={minTableHeight}
        maxTableHeight={maxHeight}
        headerHeight={headerHeight}
        footerHeight={rest.footerHeight}
      >
        {({ height, width }) => {
          return (
            <ListComponent
              ref={ref}
              borders={borders}
              width={width}
              height={height}
              headerHeight={headerHeight}
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
