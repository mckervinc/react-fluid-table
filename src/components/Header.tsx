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

function BaseHeaderCell<T>({
  column,
  width,
  prevWidth,
  sortedCol,
  sortedDir,
  onHeaderClick
}: HeaderCellProps<T>) {
  // instance
  const { key, sortable, frozen } = column;
  const style: React.CSSProperties = {
    cursor: sortable ? "pointer" : undefined,
    width: width || undefined,
    minWidth: width || undefined,
    left: frozen ? prevWidth : undefined
  };

  if (!column.header || typeof column.header === "string") {
    const { headerStyle = {}, headerClassname } = column;
    return (
      <div
        style={{ ...headerStyle, ...style }}
        onClick={() => onHeaderClick(column)}
        className={cx("rft-header-cell", frozen && "frozen", headerClassname)}
      >
        {column.header ? <div className="rft-header-cell-text">{column.header}</div> : null}
        {key !== sortedCol ? null : (
          <div className={cx("rft-header-cell-arrow", sortedDir?.toLowerCase())}></div>
        )}
      </div>
    );
  }

  const headerDir = key === sortedCol ? sortedDir || null : null;
  const frozenStyle: React.CSSProperties = frozen ? { position: "sticky", zIndex: 1 } : {};
  return (
    <column.header
      onClick={() => onHeaderClick(column)}
      sortDirection={headerDir}
      style={{ ...style, ...frozenStyle }}
    />
  );
}

const HeaderCell = memo(BaseHeaderCell) as <T>(props: HeaderCellProps<T>) => React.JSX.Element;
(HeaderCell as React.FC).displayName = "HeaderCell";

type HeaderProps<T> = {
  uuid: string;
  columns: ColumnProps<T>[];
  pixelWidths: number[];
  isScrollHorizontal: boolean;
  className?: string;
  style?: React.CSSProperties;
  sortColumn?: string;
  sortDirection?: SortDirection | null;
  onSort?: (col: string, dir: SortDirection | null) => void;
};

function BaseHeader<T>(
  {
    uuid,
    columns,
    isScrollHorizontal,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sortedCol, sortedDir]
  );

  // effects
  useEffect(() => {
    setSortedCol(sortColumn);
    setSortedDir(sortDirection);
  }, [sortColumn, sortDirection]);

  return (
    <div
      ref={ref}
      className={cx("rft-sticky-header", isScrollHorizontal && "scroll")}
      data-header-key={`${uuid}-header`}
    >
      <div className={cx("rft-header-wrapper", isScrollHorizontal && "rft-row-wrapper")}>
        <div className={cx("rft-header", className)} style={style}>
          {columns.map((c, i) => (
            <HeaderCell
              key={c.key}
              width={pixelWidths[i]}
              sortedCol={sortedCol}
              sortedDir={sortedDir}
              column={c}
              onHeaderClick={onHeaderClick}
              prevWidth={c.frozen ? pixelWidths.slice(0, i).reduce((pv, c) => pv + c, 0) : 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const Header = forwardRef(BaseHeader) as <T>(
  props: HeaderProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => React.JSX.Element;
(Header as React.FC).displayName = "Header";

export default Header;
