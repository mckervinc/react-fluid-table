import React, { forwardRef, useContext } from "react";
import { ColumnProps, SortDirection } from "../index";
import { TableContext } from "./TableContext";
import { NO_NODE } from "./constants";
import { cx } from "./util";

type HeaderCellProps<T> = {
  width: number;
  column: ColumnProps<T>;
  prevWidth: number;
};

type HeaderProps = {
  children: React.ReactNode;
  style: React.CSSProperties;
};

const HeaderCell = React.memo(function <T>({ column, width, prevWidth }: HeaderCellProps<T>) {
  // hooks
  const { dispatch, sortColumn: col, sortDirection, onSort } = useContext(TableContext);

  // constants
  const dir = sortDirection ? (sortDirection.toUpperCase() as SortDirection) : null;

  const style: React.CSSProperties = {
    cursor: column.sortable ? "pointer" : undefined,
    width: width || undefined,
    minWidth: width || undefined,
    left: column.frozen ? prevWidth : undefined
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
      <div
        style={style}
        onClick={onClick}
        className={cx("rft-header-cell", column.frozen && "frozen", column.headerCellClassname)}
      >
        {column.header ? <div className="rft-header-cell-text">{column.header}</div> : null}
        {column.key !== col ? null : (
          <div className={cx("rft-header-cell-arrow", dir?.toLowerCase())}></div>
        )}
      </div>
    );
  }

  const headerDir = column.key === col ? dir || null : null;
  const frozenStyle: React.CSSProperties = column.frozen ? { position: "sticky", zIndex: 1 } : {};
  return (
    <column.header
      onClick={onClick}
      sortDirection={headerDir}
      style={{ ...style, ...frozenStyle }}
    />
  );
});

HeaderCell.displayName = "HeaderCell";

const Header = forwardRef(({ children, ...rest }: HeaderProps, ref: any) => {
  // hooks
  const {
    uuid,
    columns,
    pixelWidths,
    headerStyle = {},
    headerHeight,
    headerClassname
  } = useContext(TableContext);

  // variables
  const { scrollWidth, clientWidth } = (ref.current || NO_NODE) as HTMLDivElement;
  const width = scrollWidth <= clientWidth ? "100%" : undefined;
  const stickyStyle: React.CSSProperties = {
    zIndex: columns.find(c => c.frozen) ? 2 : undefined
  };

  return (
    <div ref={ref} className="rft-container" data-container-key={`${uuid}-container`} {...rest}>
      <div className="rft-sticky-header" data-header-key={`${uuid}-header`} style={stickyStyle}>
        <div className="rft-row-wrapper" style={{ width }}>
          <div
            className={cx("rft-header", headerClassname)}
            style={{
              ...headerStyle,
              height: headerHeight && headerHeight > 0 ? `${headerHeight}px` : undefined
            }}
          >
            {columns.map((c, i) => (
              <HeaderCell
                key={c.key}
                column={c}
                width={pixelWidths[i]}
                prevWidth={c.frozen ? pixelWidths.slice(0, i).reduce((pv, c) => pv + c, 0) : 0}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="rft-row-wrapper">{children}</div>
    </div>
  );
});

Header.displayName = "Header";

export default Header;
