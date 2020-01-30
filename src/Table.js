import React, { useRef, useContext, useState, useCallback } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { VariableSizeList } from 'react-window';
import PropTypes from 'prop-types';
import Header from './Header';
import RowWrapper from './RowWrapper';
import { TableContextProvider, TableContext } from './TableContext';
import { randomString } from './util';

const DEFAULT_ROW_HEIGHT = 37;
const NO_COMPONENT = { offsetHeight: 0 };

/**
 * We add 1 to the itemCount to account for the header 'row'
 */
const ListComponent = ({
  className,
  height,
  width,
  rowCount,
  itemKey,
  rowHeight,
  data,
  metaData,
  subComponent
}) => {
  // hooks
  const listRef = useRef(null);
  const tableContext = useContext(TableContext);

  // variables
  const { uuid, expanded } = tableContext.state;

  // functions
  const generateKeyFromRow = useCallback(
    (row, defaultValue) => {
      const generatedKey = itemKey ? itemKey(row) : undefined;
      return generatedKey !== undefined ? generatedKey : defaultValue;
    },
    [itemKey]
  );

  const clearSizeCache = useCallback(
    (index, forceUpdate = true) => {
      if (listRef.current) {
        listRef.current.resetAfterIndex(index, forceUpdate);
      }
    },
    [listRef]
  );

  const calculateHeight = useCallback(
    (queryParam, optionalDataIndex = null) => {
      const dataIndex =
        typeof queryParam === 'number' ? queryParam : optionalDataIndex;
      const key = generateKeyFromRow(data[dataIndex], dataIndex);
      const row =
        typeof queryParam === 'number'
          ? document.querySelector(`[data-row-uuid='${uuid}-${key}'`)
          : queryParam;

      if (!row) {
        return rowHeight || DEFAULT_ROW_HEIGHT;
      }

      const isExpanded = expanded[key];
      const rowComponent = row.children[0] || NO_COMPONENT;
      const subComponent = isExpanded ? row.children[1] : NO_COMPONENT;

      return (
        (rowHeight || rowComponent.offsetHeight) + subComponent.offsetHeight
      );
    },
    [uuid, data, rowHeight, expanded, generateKeyFromRow]
  );

  return (
    <VariableSizeList
      ref={listRef}
      className={`react-fluid-table ${className || ''}`}
      innerElementType={Header}
      height={height}
      width={width}
      itemKey={(index, data) => {
        if (!index) return `${uuid}-header`;
        const dataIndex = index - 1;
        const row = data.rows[dataIndex];
        return generateKeyFromRow(row, index);
      }}
      itemCount={rowCount + 1}
      itemSize={index => (!index ? 32 : calculateHeight(index - 1))}
      itemData={{
        ...metaData,
        rowHeight,
        generateKeyFromRow,
        clearSizeCache,
        calculateHeight,
        subComponent,
        rows: data
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
  const [uuid] = useState(`${id || 'data-table'}-${randomString()}`);

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
            <ListComponent
              height={tableHeight || height}
              width={tableWidth || width}
              {...rest}
            />
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
  rowCount: PropTypes.number,
  itemKey: PropTypes.func,
  rowHeight: PropTypes.number,
  data: PropTypes.array,
  metaData: PropTypes.object,
  subComponent: PropTypes.elementType
};

Table.propTypes = {
  id: PropTypes.string,
  headerHeight: PropTypes.number,
  minColumnWidth: PropTypes.number,
  tableHeight: PropTypes.number,
  tableWidth: PropTypes.number,
  subComponent: PropTypes.elementType,
  metaData: PropTypes.object,
  columns: PropTypes.array,
  onSort: PropTypes.func,
  sortColumn: PropTypes.string,
  sortDirection: PropTypes.string
};

Table.defaultProps = {
  headerHeight: 32,
  minColumnWidth: 80,
  metaData: {},
  rowStyles: {}
};

ListComponent.defaultProps = {
  height: 37
};

export default Table;
