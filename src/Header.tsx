import React, { forwardRef, useContext } from "react";
import { useCellResize } from "./useCellResize";
import { TableContext } from "./TableContext";
import { ColumnProps } from "../index";

interface HeaderRowProps {
  pixelWidth: number;
}

interface ColumnCellProps {
  pixelWidth: number;
  column: ColumnProps;
}

const NO_REF = {
  scrollWidth: 0,
  clientWidth: 0
};

const ColumnCell = React.memo(({ column, pixelWidth }: ColumnCellProps) => {
  // hooks
  const tableContext = useContext(TableContext);

  // variables
  const { sortColumn: col, sortDirection, onSort } = tableContext.state;
  const { dispatch } = tableContext;
  const dir = sortDirection ? sortDirection.toUpperCase() : null;
  const width = Math.max(column.width || pixelWidth, column.minWidth || 0);

  const style = {
    cursor: column.sortable ? "pointer" : undefined,
    width: width ? `${width}px` : undefined,
    minWidth: width ? `${width}px` : undefined
  };

  // function(s)
  const onClick = () => {
    // change the state of the sorted column
    if (!column.sortable) return;

    // sorting the same column
    const oldCol = col;
    const oldDir = dir;
    let newDir: string | null = "ASC";
    let newCol: string | null = column.key;

    if (oldCol === newCol) {
      newDir = !oldDir ? "ASC" : oldDir === "ASC" ? "DESC" : null;
      newCol = !newDir ? null : newCol;
    }

    // only changes the arrow
    dispatch({
      type: "updateSortedColumn",
      col: newCol,
      dir: newDir
    });

    // onSort actually changes the data
    if (onSort) {
      onSort(newCol, newDir);
    }
  };

  const header = !column.header ? null : typeof column.header === "string" ? (
    <div className="header-cell-text">{column.header}</div>
  ) : (
    column.header(onClick)
  );

  return (
    <div className="header-cell" onClick={onClick} style={style}>
      {header}
      {column.key !== col ? null : <div className={`header-cell-arrow ${dir.toLowerCase()}`}></div>}
    </div>
  );
});

const HeaderRow = React.memo(({ pixelWidth }: HeaderRowProps) => {
  // hooks
  const tableContext = useContext(TableContext);
  const { columns } = tableContext.state;

  return (
    <div className="react-fluid-table-header">
      {columns.map((c: ColumnProps) => (
        <ColumnCell key={c.key} column={c} pixelWidth={pixelWidth} />
      ))}
    </div>
  );
});

const Header = forwardRef(({ children, ...rest }, ref: any) => {
  const tableContext = useContext(TableContext);

  // variables
  const { id, uuid, remainingCols, fixedWidth, minColumnWidth } = tableContext.state;
  const pixelWidth = useCellResize(ref.current, remainingCols, fixedWidth, minColumnWidth);
  const { scrollWidth, clientWidth } = ref.current || NO_REF;
  const width = scrollWidth <= clientWidth ? "100%" : undefined;

  return (
    <div id={id} ref={ref} data-table-key={uuid} className="react-fluid-table-container" {...rest}>
      <div className="sticky-header" data-header-key={`${uuid}-header`}>
        <div className="row-wrapper" style={{ width }}>
          <HeaderRow pixelWidth={pixelWidth} />
        </div>
      </div>
      <div className="row-wrapper">{children}</div>
    </div>
  );
});

Header.displayName = "Header";

export default Header;
