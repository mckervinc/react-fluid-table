import React, { forwardRef, useContext } from "react";
import { ColumnProps, SortDirection } from "../index";
import { TableContext } from "./TableContext";
import { NO_NODE } from "./constants";
import { cx } from "./util";

interface HeaderCellProps<T> {
  width: number;
  column: ColumnProps<T>;
}

interface HeaderProps {
  children: React.ReactNode;
  style: React.CSSProperties;
}

const HeaderCell = React.memo(function <T>({ column, width }: HeaderCellProps<T>) {
  // hooks
  const { dispatch, sortColumn: col, sortDirection, onSort } = useContext(TableContext);

  // constants
  const cellWidth = width ? `${width}px` : undefined;
  const dir = sortDirection ? (sortDirection.toUpperCase() as SortDirection) : null;

  const style: React.CSSProperties = {
    cursor: column.sortable ? "pointer" : undefined,
    width: cellWidth,
    minWidth: cellWidth
  };

  // function(s)
  const onClick = () => {
    // change the state of the sorted column
    if (!column.sortable) return;

    // sorting the same column
    const oldCol = col;
    const oldDir = dir;
    let newDir: SortDirection = "ASC";
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
          <div className={cx(["header-cell-arrow", dir?.toLowerCase()])}></div>
        )}
      </div>
    );
  }

  const ColumnCell = column.header;
  const headerDir = column.key === col ? dir || null : null;
  return <ColumnCell style={style} onClick={onClick} sortDirection={headerDir} />;
});

HeaderCell.displayName = "HeaderCell";

const Header = forwardRef(({ children, ...rest }: HeaderProps, ref: any) => {
  // hooks
  const { uuid, columns, pixelWidths, headerStyle, headerClassname } = useContext(TableContext);

  // variables
  const { scrollWidth, clientWidth } = ref.current || NO_NODE;
  const width = scrollWidth <= clientWidth ? "100%" : undefined;

  return (
    <div
      ref={ref}
      className="react-fluid-table-container"
      data-container-key={`${uuid}-container`}
      {...rest}
    >
      <div className="sticky-header" data-header-key={`${uuid}-header`}>
        <div className="row-wrapper" style={{ width }}>
          <div className={cx(["react-fluid-table-header", headerClassname])} style={headerStyle}>
            {columns.map((c, i) => (
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
