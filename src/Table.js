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
import PropTypes from "prop-types";
import Header from "./Header";
import RowWrapper from "./RowWrapper";
import { TableContextProvider, TableContext } from "./TableContext";
import { calculateColumnWidth } from "./useCellResize";
import { randomString, findHeaderByUuid, findRowByUuidAndKey } from "./util";

const DEFAULT_ROW_HEIGHT = 37;
const DEFAULT_HEADER_HEIGHT = 32;
const NO_PARENT = {
  parentElement: { scrollWidth: 0, clientWidth: 0 }
};

/**
 * The main table component
 */
const ListComponent = ({ className, height, width, itemKey, rowHeight, data, subComponent }) => {
  // hooks
  const listRef = useRef(null);
  const tableRef = useRef(null);
  const resizeRef = useRef(null);
  const timeoutRef = useRef(null);
  const pixelWidthRef = useRef(null);
  const resetIndexRef = useRef(Infinity);
  const tableContext = useContext(TableContext);
  const [useRowWidth, setUseRowWidth] = useState(true);
  const [pixelWidth, setPixelWidth] = useState(0);

  // variables
  const defaultSize = rowHeight || DEFAULT_ROW_HEIGHT;
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

      resetIndexRef.current = Math.min(index, resetIndexRef.current);
      timeoutRef.current = window.setTimeout(() => {
        const resetNumber = resetIndexRef.current;
        resetIndexRef.current = Infinity;
        listRef.current.resetAfterIndex(resetNumber);
      }, 50);
    },
    [listRef, timeoutRef, resetIndexRef]
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

      return [...row.children].reduce((pv, c) => pv + c.offsetHeight, 0);
    },
    [uuid, data, listRef, defaultSize, generateKeyFromRow]
  );

  const pixelWidthHelper = useCallback(() => {
    const [val] = calculateColumnWidth(tableRef.current, remainingCols, fixedWidth);
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

  // initialize whether or not to use row Width (useful for bottom border)
  useEffect(() => {
    setUseRowWidth(tableRef.current.scrollWidth <= tableRef.current.clientWidth);
  }, []);

  // trigger window resize. fixes issue in FF
  useEffect(() => {
    if (!window.document.documentMode) {
      window.dispatchEvent(new Event('resize'));
    }
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
      useIsScrolling
      className={`react-fluid-table ${className || ""}`}
      ref={listRef}
      innerRef={tableRef}
      innerElementType={Header}
      height={height}
      width={width}
      itemKey={(index, data) => {
        if (!index) return `${uuid}-header`;
        const dataIndex = index - 1;
        const row = data.rows[dataIndex];
        return generateKeyFromRow(row, index);
      }}
      itemCount={data.length + 1}
      itemSize={index => {
        if (!index) {
          const header = findHeaderByUuid(uuid);
          return header ? header.children[0].offsetHeight : DEFAULT_HEADER_HEIGHT;
        }

        return calculateHeight(index - 1);
      }}
      itemData={{
        rows: data,
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
}) => {
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
        <ListComponent height={tableHeight} width={tableWidth} {...rest} />
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

ListComponent.propTypes = {
  className: PropTypes.string,
  height: PropTypes.number,
  width: PropTypes.number,
  itemKey: PropTypes.func,
  rowHeight: PropTypes.number,
  data: PropTypes.array,
  subComponent: PropTypes.elementType
};

Table.propTypes = {
  id: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      header: PropTypes.node,
      width: PropTypes.number,
      minWidth: PropTypes.number,
      cell: PropTypes.oneOfType([PropTypes.elementType, PropTypes.func]),
      expander: PropTypes.oneOfType([PropTypes.bool, PropTypes.elementType, PropTypes.func])
    })
  ).isRequired,
  minColumnWidth: PropTypes.number,
  tableHeight: PropTypes.number,
  tableWidth: PropTypes.number,
  rowHeight: PropTypes.number,
  subComponent: PropTypes.elementType,
  columns: PropTypes.array,
  onSort: PropTypes.func,
  sortColumn: PropTypes.string,
  sortDirection: PropTypes.string
};

Table.defaultProps = {
  minColumnWidth: 80,
  rowStyles: {}
};

ListComponent.defaultProps = {
  height: 37
};

export default Table;
