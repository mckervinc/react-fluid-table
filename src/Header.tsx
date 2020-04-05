import React, { forwardRef, useContext } from "react";
import { useCellResize } from "./useCellResize";
import { TableContext } from "./TableContext";
import { ColumnProps } from "../index";

interface HeaderRowProps {
  pixelWidths: number[];
}

interface ColumnCellProps {
  width: number;
  column: ColumnProps;
}

const NO_REF = {
  scrollWidth: 0,
  clientWidth: 0
};

const ColumnCell = React.memo(({ column, width }: ColumnCellProps) => {
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

  const HeaderCell = column.header;
  const headerDir = column.key === col ? dir || null : null;
  return <HeaderCell style={style} onClick={onClick} sortDirection={headerDir} />;
});

const HeaderRow = React.memo(({ pixelWidths }: HeaderRowProps) => {
  // hooks
  const tableContext = useContext(TableContext);
  const { columns } = tableContext.state;

  return (
    <div className="react-fluid-table-header">
      {columns.map((c: ColumnProps, i: number) => (
        <ColumnCell key={c.key} column={c} width={pixelWidths[i]} />
      ))}
    </div>
  );
});

const Header = forwardRef(({ children, ...rest }, ref: any) => {
  const tableContext = useContext(TableContext);

  // variables
  const { id, uuid, columns, remainingCols, fixedWidth, minColumnWidth } = tableContext.state;
  const pixelWidths = useCellResize(
    ref.current,
    remainingCols,
    fixedWidth,
    minColumnWidth,
    columns
  );
  const { scrollWidth, clientWidth } = ref.current || NO_REF;
  const width = scrollWidth <= clientWidth ? "100%" : undefined;

  return (
    <div id={id} ref={ref} data-table-key={uuid} className="react-fluid-table-container" {...rest}>
      <div className="sticky-header" data-header-key={`${uuid}-header`}>
        <div className="row-wrapper" style={{ width }}>
          <HeaderRow pixelWidths={pixelWidths} />
        </div>
      </div>
      <div className="row-wrapper">{children}</div>
    </div>
  );
});

Header.displayName = "Header";

export default Header;
