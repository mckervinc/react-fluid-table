import React, { forwardRef, useContext } from "react";
import { ColumnProps } from "../index";
import { NO_NODE } from "./constants";
import { TableContext } from "./TableContext";

interface ColumnCellProps {
  width: number;
  column: ColumnProps;
}

const HeaderCell = React.memo(({ column, width }: ColumnCellProps) => {
  // hooks
  const tableContext = useContext(TableContext);

  // variables
  const { sortColumn: col, sortDirection, onSort } = tableContext.state;
  const { dispatch } = tableContext;
  const dir = sortDirection ? sortDirection.toUpperCase() : null;

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

  if (!column.header || typeof column.header === "string") {
    return (
      <div className="header-cell" onClick={onClick} style={style}>
        {column.header ? <div className="header-cell-text">{column.header}</div> : null}
        {column.key !== col ? null : (
          <div className={`header-cell-arrow ${(dir || "").toLowerCase()}`}></div>
        )}
      </div>
    );
  }

  const ColumnCell = column.header;
  const headerDir = column.key === col ? dir || null : null;
  return <ColumnCell style={style} onClick={onClick} sortDirection={headerDir} />;
});

const Header = forwardRef(({ children, ...rest }, ref: any) => {
  // hooks
  const tableContext = useContext(TableContext);

  // variables
  const { id, uuid, columns, pixelWidths, headerStyle } = tableContext.state;
  const { scrollWidth, clientWidth } = ref.current || NO_NODE;
  const width = scrollWidth <= clientWidth ? "100%" : undefined;

  return (
    <div id={id} ref={ref} data-table-key={uuid} className="react-fluid-table-container" {...rest}>
      <div className="sticky-header" data-header-key={`${uuid}-header`}>
        <div className="row-wrapper" style={{ width }}>
          <div className="react-fluid-table-header" style={headerStyle}>
            {columns.map((c: ColumnProps, i: number) => (
              <HeaderCell key={c.key} column={c} width={pixelWidths[i]} />
            ))}
          </div>
        </div>
      </div>
      <div className="row-wrapper">{children}</div>
    </div>
  );
});

Header.displayName = "Header";

export default Header;
