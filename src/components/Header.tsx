import React, { forwardRef, memo, useCallback, useEffect, useState } from "react";
import { ColumnProps, SortDirection } from "../..";
import { cx } from "../util";

type HeaderCellProps<T> = {
  width: number;
  column: ColumnProps<T>;
  prevWidth: number;
  sortedCol?: string;
  sortedDir?: SortDirection | null;
  onHeaderClick: (column: ColumnProps<T>) => void;
};

const HeaderCell = memo(function <T>({
  column,
  width,
  prevWidth,
  sortedCol,
  sortedDir,
  onHeaderClick
}: HeaderCellProps<T>) {
  const style: React.CSSProperties = {
    cursor: column.sortable ? "pointer" : undefined,
    width: width || undefined,
    minWidth: width || undefined,
    left: column.frozen ? prevWidth : undefined
  };

  if (!column.header || typeof column.header === "string") {
    return (
      <div
        style={style}
        onClick={() => onHeaderClick(column)}
        className={cx("rft-header-cell", column.frozen && "frozen", column.headerCellClassname)}
      >
        {column.header ? <div className="rft-header-cell-text">{column.header}</div> : null}
        {column.key !== sortedCol ? null : (
          <div className={cx("rft-header-cell-arrow", sortedDir?.toLowerCase())}></div>
        )}
      </div>
    );
  }

  const headerDir = column.key === sortedCol ? sortedDir || null : null;
  const frozenStyle: React.CSSProperties = column.frozen ? { position: "sticky", zIndex: 1 } : {};
  return (
    <column.header
      onClick={() => onHeaderClick(column)}
      sortDirection={headerDir}
      style={{ ...style, ...frozenStyle }}
    />
  );
});

HeaderCell.displayName = "HeaderCell";

type HeaderProps<T> = {
  uuid: string;
  columns: ColumnProps<T>[];
  pixelWidths: number[];
  className?: string;
  style?: React.CSSProperties;
  sortColumn?: string;
  sortDirection?: SortDirection | null;
  onSort?: (col: string, dir: SortDirection | null) => void;
};

const Header = forwardRef(function <T>(
  {
    uuid,
    columns,
    pixelWidths,
    className,
    style,
    sortColumn,
    sortDirection,
    onSort
  }: HeaderProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  // hooks
  const [sortedCol, setSortedCol] = useState(sortColumn);
  const [sortedDir, setSortedDir] = useState(sortDirection);

  // functions
  const onHeaderClick = useCallback(
    (column: ColumnProps<T>) => {
      // change the state of the sorted column
      if (!column.sortable) return;

      // sorting the same column
      let newDir: SortDirection | null = "ASC";

      if (sortedCol === column.key) {
        newDir = !sortedDir ? "ASC" : sortedDir === "ASC" ? "DESC" : null;
      }

      // onSort actually changes the data
      onSort?.(column.key, newDir);
      setSortedCol(column.key);
      setSortedDir(newDir);
    },
    [sortedCol, sortedDir]
  );

  // effects
  useEffect(() => {
    setSortedCol(sortColumn);
    setSortedDir(sortDirection);
  }, [sortColumn, sortDirection]);

  return (
    <div ref={ref} className="rft-sticky-header" data-header-key={`${uuid}-header`}>
      <div className={cx("rft-header", className)} style={style}>
        {columns.map((c, i) => (
          <HeaderCell
            key={c.key}
            width={pixelWidths[i]}
            sortedCol={sortedCol}
            sortedDir={sortedDir}
            column={c as ColumnProps<any>}
            onHeaderClick={onHeaderClick as any}
            prevWidth={c.frozen ? pixelWidths.slice(0, i).reduce((pv, c) => pv + c, 0) : 0}
          />
        ))}
      </div>
    </div>
  );
});

Header.displayName = "Header";

export default Header;