import React, { forwardRef, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useCellResize } from './useCellResize';
import { findColumnWidthConstants } from './util';
import { TableContext } from './TableContext';

const ColumnCell = ({ column, pixelWidth }) => {
  const tableContext = useContext(TableContext);
  const { sortColumn: col, sortDirection: dir, onSort } = tableContext.state;
  const { dispatch } = tableContext;
  const width = Math.max(column.width || pixelWidth, column.minWidth || 0);

  const style = {
    cursor: column.sortable ? 'pointer' : undefined,
    width: width ? `${width}px` : undefined,
    minWidth: width ? `${width}px` : undefined
  };

  const onClick = () => {
    if (!column.sortable) return; // change the state of the sorted column

    const oldCol = col;
    const oldDir = dir;
    let newDir = 'ASC';
    let newCol = column.key; // sorting the same column

    if (oldCol === newCol) {
      newDir = !oldDir ? 'ASC' : oldDir === 'ASC' ? 'DESC' : null;
      newCol = !newDir ? null : newCol;
    } // only changes the arrow

    dispatch({
      type: 'updateSortedColumn',
      col: newCol,
      dir: newDir
    }); // onSort actually changes the data

    if (onSort) {
      onSort(newCol, newDir);
    }
  };

  return (
    <div className='header-cell' onClick={onClick} style={style}>
      <div className='header-cell-text'>{column.name}</div>
      {column.key !== col ? null : (
        <span className='header-cell-arrow'>{dir === 'ASC' ? '▲' : '▼'}</span>
      )}
    </div>
  );
};

const HeaderRow = () => {
  // hooks
  const tableContext = useContext(TableContext);
  const [colWidths] = useState(
    findColumnWidthConstants(tableContext.state.columns)
  ); // calculate pixel width for remaining cols

  const { uuid, columns, minColumnWidth } = tableContext.state;
  const { fixedWidth, remainingCols } = colWidths;
  const pixelWidth = useCellResize(
    `[data-uuid='${uuid}']`,
    remainingCols,
    fixedWidth,
    minColumnWidth,
    true
  );

  return (
    <div className='react-fluid-table-header'>
      {columns.map(c => (
        <ColumnCell key={c.key} column={c} pixelWidth={pixelWidth} />
      ))}
    </div>
  );
};

const Header = forwardRef(({ children, ...rest }, ref) => {
  const tableContext = useContext(TableContext);
  const { id, uuid } = tableContext.state;

  return (
    <div id={id} ref={ref} data-uuid={uuid} {...rest}>
      <div className='sticky-header'>
        <HeaderRow />
      </div>
      <div className='row-wrapper'>{children}</div>
    </div>
  );
});

Header.displayName = 'Header';

Header.propTypes = {
  children: PropTypes.any
};

ColumnCell.propTypes = {
  column: PropTypes.object,
  pixelWidth: PropTypes.number
};

export default Header;
