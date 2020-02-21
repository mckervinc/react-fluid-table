import React, {
  useRef,
  useContext,
  useState,
  useCallback,
  useEffect,
  useLayoutEffect
} from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { VariableSizeList } from "react-window";
import Header from "./Header";
import RowWrapper from "./RowWrapper";
import { TableContextProvider, TableContext } from "./TableContext";
import { calculateColumnWidth } from "./useCellResize";
import { randomString, findHeaderByUuid, findRowByUuidAndKey } from "./util";
import { ListProps, TableProps } from "../index";

type Text = string | number;

const DEFAULT_HEADER_HEIGHT = 32;
const NO_PARENT = {
  parentElement: { scrollWidth: 0, clientWidth: 0 }
};

/**
 * The main table component
 */
const ListComponent = ({ height, width, ...rest }: ListProps) => {
  // hooks
  const resizeRef = useRef(0);
  const timeoutRef = useRef(0);
  const pixelWidthRef = useRef(0);
  const listRef = useRef<any>(null);
  const tableRef = useRef<any>(null);
  const tableContext = useContext(TableContext);
  const [pixelWidth, setPixelWidth] = useState(0);
  const [useRowWidth, setUseRowWidth] = useState(true);

  // variables
  const { className, itemKey, rowHeight, estimatedRowHeight, data, subComponent } = rest;
  const defaultSize = rowHeight || estimatedRowHeight;
  const { uuid, minColumnWidth, fixedWidth, remainingCols } = tableContext.state;

  // functions
  const generateKeyFromRow = useCallback(
    (row, defaultValue) => {
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
        const resetIndex =
          parseInt(tableRef.current ? tableRef.current.children[1].children[0].dataset.index : 0) +
          1;
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

  const pixelWidthHelper = useCallback(() => {
    const val = calculateColumnWidth(tableRef.current, remainingCols, fixedWidth);
    const width = Math.max(val, minColumnWidth);
    if (width !== pixelWidth) {
      setPixelWidth(width);
    }
  }, [tableRef, remainingCols, fixedWidth, minColumnWidth, pixelWidth]);

  const shouldUseRowWidth = useCallback(() => {
    if (resizeRef.current) {
      window.clearTimeout(resizeRef.current);
    }

    resizeRef.current = window.setTimeout(() => {
      const { parentElement } = tableRef.current || NO_PARENT;
      setUseRowWidth(parentElement.scrollWidth <= parentElement.clientWidth);
    }, 50);
  }, [resizeRef, uuid, tableRef]);

  const calculatePixelWidth = useCallback(() => {
    if (pixelWidthRef.current) {
      window.clearTimeout(pixelWidthRef.current);
    }

    pixelWidthRef.current = window.setTimeout(pixelWidthHelper, 50);
  }, [pixelWidthRef, pixelWidthHelper]);

  // effects
  /* initializers */
  // calculate cache after first render
  useLayoutEffect(() => {
    listRef.current.resetAfterIndex(0);
  }, []);

  // initialize pixel width
  useLayoutEffect(pixelWidthHelper, []);

  // initialize whether or not to use rowWidth (useful for bottom border)
  useEffect(() => {
    setUseRowWidth(tableRef.current.scrollWidth <= tableRef.current.clientWidth);
  }, []);

  // trigger window resize. fixes issue in FF
  useEffect(() => {
    // if (!(window.document as any).documentMode) {
    window.dispatchEvent(new Event("resize"));
    // }
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
    window.addEventListener("resize", calculatePixelWidth);
    return () => {
      if (pixelWidthRef.current) {
        window.clearTimeout(pixelWidthRef.current);
      }
      window.removeEventListener("resize", calculatePixelWidth);
    };
  }, [calculatePixelWidth, pixelWidthRef]);

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
      itemKey={(index: number, data: any): Text => {
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
        pixelWidth,
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
      {disableHeight === true && disableWidth === true ? (
        <ListComponent height={tableHeight || 100} width={tableWidth || 100} {...rest} />
      ) : (
        <AutoSizer disableHeight={disableHeight} disableWidth={disableWidth}>
          {({ height, width }) => (
            <ListComponent height={tableHeight || height} width={tableWidth || width} {...rest} />
          )}
        </AutoSizer>
      )}
    </TableContextProvider>
  );
};

Table.defaultProps = {
  minColumnWidth: 80,
  estimatedRowHeight: 37
};

export default Table;
