import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react";
import { VariableSizeList } from "react-window";
import { Generic, ListProps, TableProps, Text } from "../index";
import AutoSizer from "./AutoSizer";
import Header from "./Header";
import RowWrapper from "./RowWrapper";
import { TableContext, TableContextProvider } from "./TableContext";
import { calculateColumnWidths } from "./useCellResize";
import { arraysMatch, findHeaderByUuid, findRowByUuidAndKey, randomString } from "./util";

interface Data {
  rows: Generic[];
  [key: string]: any;
}

const DEFAULT_ROW_HEIGHT = 37;
const DEFAULT_HEADER_HEIGHT = 32;
const NO_PARENT = {
  parentElement: { scrollWidth: 0, clientWidth: 0 }
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
  const resizeRef = useRef(0);
  const timeoutRef = useRef(0);
  const pixelWidthsRef = useRef(0);
  const listRef = useRef<any>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const tableContext = useContext(TableContext);
  const [useRowWidth, setUseRowWidth] = useState(true);
  const [pixelWidths, setPixelWidths] = useState<number[]>([]);

  // variables
  const defaultSize = rowHeight || estimatedRowHeight;
  const { uuid, columns, minColumnWidth, fixedWidth, remainingCols } = tableContext.state;

  // functions
  const generateKeyFromRow = useCallback(
    (row: Generic, defaultValue: number): Text => {
      const generatedKey = itemKey ? itemKey(row) : undefined;
      return generatedKey !== undefined ? generatedKey : defaultValue;
    },
    [itemKey]
  );

  const clearSizeCache = useCallback(
    (dataIndex, forceUpdate = false) => {
      if (!listRef.current) {
        return;
      }

      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }

      const index = dataIndex + 1;
      if (forceUpdate) {
        listRef.current.resetAfterIndex(index);
        return;
      }

      timeoutRef.current = window.setTimeout(() => {
        const node = tableRef.current
          ? (tableRef.current.children[1].children[0] as HTMLElement)
          : null;
        const resetIndex = parseInt(node ? node.dataset.index || "0" : "0") + 1;
        listRef.current.resetAfterIndex(resetIndex);
      }, 50);
    },
    [listRef, tableRef, timeoutRef]
  );

  const calculateHeight = useCallback(
    (queryParam, optionalDataIndex = null) => {
      const dataIndex = typeof queryParam === "number" ? queryParam : optionalDataIndex;
      const key = generateKeyFromRow(data[dataIndex], dataIndex);
      const row = typeof queryParam === "number" ? findRowByUuidAndKey(uuid, key) : queryParam;

      if (!row) {
        if (!listRef.current) {
          return defaultSize;
        }

        const cachedSize = listRef.current._instanceProps.itemMetadataMap[dataIndex + 1] || {
          size: defaultSize
        };
        return cachedSize.size || defaultSize;
      }

      const arr = rowHeight ? [...row.children].slice(1) : [...row.children];
      return (rowHeight || 0) + arr.reduce((pv, c) => pv + c.offsetHeight, 0);
    },
    [uuid, data, listRef, rowHeight, defaultSize, generateKeyFromRow]
  );

  const pixelWidthsHelper = useCallback(() => {
    const widths = calculateColumnWidths(
      tableRef.current,
      remainingCols,
      fixedWidth,
      minColumnWidth,
      columns
    );
    if (!arraysMatch(widths, pixelWidths)) {
      setPixelWidths(widths);
    }
  }, [tableRef, remainingCols, fixedWidth, minColumnWidth, pixelWidths]);

  const shouldUseRowWidth = useCallback(() => {
    if (resizeRef.current) {
      window.clearTimeout(resizeRef.current);
    }

    resizeRef.current = window.setTimeout(() => {
      const { parentElement } = tableRef.current || NO_PARENT;
      if (parentElement) {
        setUseRowWidth(parentElement.scrollWidth <= parentElement.clientWidth);
      }
    }, 50);
  }, [resizeRef, uuid, tableRef]);

  const calculatepixelWidths = useCallback(() => {
    if (pixelWidthsRef.current) {
      window.clearTimeout(pixelWidthsRef.current);
    }

    pixelWidthsRef.current = window.setTimeout(pixelWidthsHelper, 50);
  }, [pixelWidthsRef, pixelWidthsHelper]);

  // effects
  /* initializers */
  // initialize pixel width
  useLayoutEffect(pixelWidthsHelper, []);

  // initialize whether or not to use rowWidth (useful for bottom border)
  useEffect(() => {
    if (tableRef.current) {
      setUseRowWidth(tableRef.current.scrollWidth <= tableRef.current.clientWidth);
    }
  }, []);

  // trigger window resize. fixes issue in FF
  useEffect(() => {
    setTimeout(() => {
      if (!(window.document as any).documentMode) {
        window.dispatchEvent(new Event("resize"));
      }
    }, 0);
  }, []);

  /* listeners */
  useEffect(() => {
    window.addEventListener("resize", shouldUseRowWidth);
    return () => {
      if (resizeRef.current) {
        window.clearTimeout(resizeRef.current);
      }
      window.removeEventListener("resize", shouldUseRowWidth);
    };
  }, [shouldUseRowWidth, resizeRef]);

  useEffect(() => {
    window.addEventListener("resize", calculatepixelWidths);
    return () => {
      if (pixelWidthsRef.current) {
        window.clearTimeout(pixelWidthsRef.current);
      }
      window.removeEventListener("resize", calculatepixelWidths);
    };
  }, [calculatepixelWidths, pixelWidthsRef]);

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
      itemKey={(index: number, data: Data): Text => {
        if (!index) return `${uuid}-header`;
        const dataIndex = index - 1;
        const row = data.rows[dataIndex];
        return generateKeyFromRow(row, index);
      }}
      itemCount={data.length + 1}
      itemSize={index => {
        if (!index) {
          const header = findHeaderByUuid(uuid);
          return header ? (header.children[0] as HTMLElement).offsetHeight : DEFAULT_HEADER_HEIGHT;
        }

        return calculateHeight(index - 1);
      }}
      itemData={{
        rows: data,
        rowHeight,
        pixelWidths,
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

const guessTableHeight = (rowHeight?: number, estimatedRowHeight?: number) => {
  const height = rowHeight || estimatedRowHeight || DEFAULT_ROW_HEIGHT;
  return height * 10 + DEFAULT_HEADER_HEIGHT;
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
