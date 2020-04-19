import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react";
import { VariableSizeList } from "react-window";
import { ColumnProps, Generic, ListProps, TableProps, Text } from "../index";
import AutoSizer from "./AutoSizer";
import Header from "./Header";
import NumberTree from "./NumberTree";
import RowWrapper from "./RowWrapper";
import { TableContext, TableContextProvider } from "./TableContext";
import { arraysMatch, findHeaderByUuid, findRowByUuidAndKey, randomString } from "./util";

interface Data {
  rows: Generic[];
  [key: string]: any;
}

// constants
const DEFAULT_ROW_HEIGHT = 37;
const DEFAULT_HEADER_HEIGHT = 37;
const NO_NODE = { scrollWidth: 0, clientWidth: 0 };

// functions
const guessTableHeight = (rowHeight?: number, estimatedRowHeight?: number) => {
  const height = Math.max(rowHeight || estimatedRowHeight || DEFAULT_ROW_HEIGHT, 10);
  return height * 10 + DEFAULT_HEADER_HEIGHT;
};

const calculateColumnWidths = (
  element: HTMLElement | null,
  numColumns: number,
  fixedColumnWidths: number,
  minColumnWidth: number,
  columns: ColumnProps[]
): number[] => {
  if (!element) return columns.map(() => minColumnWidth);
  const offsetWidth = element.offsetWidth;
  let n = Math.max(numColumns, 1);
  let usedSpace = fixedColumnWidths;
  let freeSpace = Math.max(offsetWidth - usedSpace, 0);
  let width = Math.max(minColumnWidth, Math.floor(freeSpace / n));

  return columns.map((c: ColumnProps) => {
    if (c.width) {
      return c.width;
    }

    if (c.maxWidth) {
      const diff = width - c.maxWidth;
      if (diff > 0) {
        n = Math.max(n - 1, 1);
        usedSpace += c.maxWidth;
        freeSpace = Math.max(offsetWidth - usedSpace, 0);
        width = Math.max(minColumnWidth, Math.floor(freeSpace / n));
        return c.maxWidth;
      }
    }

    if (c.minWidth) {
      const diff = c.minWidth - width;
      if (diff > 0) {
        n = Math.max(n - 1, 1);
        usedSpace += c.minWidth;
        freeSpace = Math.max(offsetWidth - usedSpace, 0);
        width = Math.max(minColumnWidth, Math.floor(freeSpace / n));
        return c.minWidth;
      }
    }
    return width;
  });
};

/**
 * The main table component
 */
const ListComponent = ({
  data,
  width,
  height,
  itemKey,
  rowHeight,
  className,
  subComponent,
  estimatedRowHeight
}: ListProps) => {
  // hooks
  const timeoutRef = useRef(0);
  const prevRef = useRef(width);
  const listRef = useRef<any>(null);
  const treeRef = useRef(new NumberTree());
  const tableRef = useRef<HTMLDivElement>(null);
  const tableContext = useContext(TableContext);
  const [useRowWidth, setUseRowWidth] = useState(true);
  const [defaultSize, setDefaultSize] = useState(rowHeight || estimatedRowHeight);

  // variables
  const { dispatch } = tableContext;
  const {
    uuid,
    columns,
    minColumnWidth,
    fixedWidth,
    remainingCols,
    pixelWidths
  } = tableContext.state;

  // functions
  const generateKeyFromRow = useCallback(
    (row: Generic, defaultValue: number): Text => {
      const generatedKey = itemKey ? itemKey(row) : undefined;
      return generatedKey !== undefined ? generatedKey : defaultValue;
    },
    [itemKey]
  );

  const clearSizeCache = useCallback(
    (dataIndex: number, forceUpdate = false) => {
      if (!listRef.current) {
        return;
      }

      window.clearTimeout(timeoutRef.current);
      if (forceUpdate) {
        treeRef.current.clear();
        listRef.current.resetAfterIndex(dataIndex + 1);
        return;
      }

      timeoutRef.current = window.setTimeout(() => {
        const node = tableRef.current?.children[1].children[0] as HTMLElement;
        const resetIndex = parseInt(node?.dataset.index || "0") + 1;
        treeRef.current.clear();
        listRef.current.resetAfterIndex(resetIndex);
      }, 50);
    },
    [listRef, tableRef, timeoutRef, treeRef]
  );

  const calculateHeight = useCallback(
    (queryParam: number | HTMLElement, optionalDataIndex = null) => {
      const dataIndex = typeof queryParam === "number" ? queryParam : optionalDataIndex;
      const key = generateKeyFromRow(data[dataIndex], dataIndex);
      const row = typeof queryParam === "number" ? findRowByUuidAndKey(uuid, key) : queryParam;

      if (!row) {
        return defaultSize;
      }

      const arr = [...row.children].slice(rowHeight ? 1 : 0);
      return (rowHeight || 0) + arr.reduce((pv, c) => pv + (c as HTMLElement).offsetHeight, 0);
    },
    [uuid, data, rowHeight, defaultSize, generateKeyFromRow]
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
  }, [tableRef]);

  // effects
  /* initializers */
  // initialize whether or not to use rowWidth (useful for bottom border)
  useEffect(() => {
    const widths = tableRef.current || NO_NODE;
    setUseRowWidth(widths.scrollWidth <= widths.clientWidth);
  }, []);

  // force clear cache to update header size
  useEffect(() => {
    clearSizeCache(-1, true);
    // figure out how to wait for scrollbar to appear
    // before recalculating. using 100ms heuristic
    setTimeout(() => {
      updatePixelWidths();
      shouldUseRowWidth();
    }, 100);
  }, []);

  /* updates */
  // update pixel widths every time the width changes
  useLayoutEffect(updatePixelWidths, [width]);

  // check if we should use the row width when width changes
  useEffect(shouldUseRowWidth, [width]);

  // manually alter the height of each row if height is incorrect
  // to help with flicker on resize
  useLayoutEffect(() => {
    if (prevRef.current !== width) {
      setTimeout(() => {
        if (!tableRef.current || !listRef.current) {
          return;
        }

        // variables
        let prevTop = 0;
        let prevHeight = 0;
        const cache = listRef.current._instanceProps.itemMetadataMap || {};
        const elements = [...tableRef.current.children[1].children];

        // manually change the `top` and `height` for visible rows
        elements.forEach((e, i) => {
          const node = e as HTMLDivElement;
          const dataIndex = parseInt(node.dataset.index || "0");

          // if the row is incorrect, update the tops going forward
          const height = cache[dataIndex + 1].size;
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

    prevRef.current = width;
  }, [width, tableRef, listRef, calculateHeight]);

  /* cleanup */
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [timeoutRef]);

  return (
    <VariableSizeList
      className={`react-fluid-table ${className || ""}`}
      ref={listRef}
      innerRef={tableRef}
      innerElementType={Header}
      height={height}
      width={width}
      itemCount={data.length + 1}
      itemKey={(index: number, data: Data): Text => {
        if (!index) return `${uuid}-header`;
        const dataIndex = index - 1;
        const row = data.rows[dataIndex];
        return generateKeyFromRow(row, index);
      }}
      itemSize={index => {
        if (!index) {
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
          treeRef.current.insert({ index: dataIndex, height: calculateHeight(node, dataIndex) });
        });

        const median = treeRef.current.getMedian();
        if (median) {
          setDefaultSize(median);
        }
      }}
      itemData={{
        rows: data,
        rowHeight,
        useRowWidth,
        subComponent,
        clearSizeCache,
        calculateHeight,
        generateKeyFromRow
      }}
    >
      {RowWrapper}
    </VariableSizeList>
  );
};

const Table = ({
  id,
  columns,
  minColumnWidth,
  onSort,
  sortColumn,
  sortDirection,
  tableHeight,
  tableWidth,
  ...rest
}: TableProps) => {
  // TODO: do all prop validation here
  const disableHeight = tableHeight !== undefined;
  const disableWidth = tableWidth !== undefined;
  const { rowHeight, estimatedRowHeight } = rest;
  const [uuid] = useState(`${id || "data-table"}-${randomString()}`);

  return (
    <TableContextProvider
      initialState={{
        id,
        uuid,
        columns,
        minColumnWidth,
        onSort,
        sortColumn,
        sortDirection
      }}
    >
      {typeof tableHeight === "number" && typeof tableWidth === "number" ? (
        <ListComponent height={tableHeight} width={tableWidth} {...rest} />
      ) : (
        <AutoSizer disableHeight={disableHeight} disableWidth={disableWidth}>
          {({ height, width }) => (
            <ListComponent
              width={tableWidth || width}
              height={tableHeight || height || guessTableHeight(rowHeight, estimatedRowHeight)}
              {...rest}
            />
          )}
        </AutoSizer>
      )}
    </TableContextProvider>
  );
};

Table.defaultProps = {
  minColumnWidth: 80,
  estimatedRowHeight: DEFAULT_ROW_HEIGHT
};

export default Table;
