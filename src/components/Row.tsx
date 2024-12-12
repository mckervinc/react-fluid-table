import React, { forwardRef, memo, useCallback } from "react";
import { ColumnProps, RowRenderProps, SubComponentProps } from "../..";
import Minus from "../svg/minus-circle.svg";
import Plus from "../svg/plus-circle.svg";
import { cx } from "../util";

type TableCellProps<T> = {
  row: T;
  index: number;
  width?: number;
  prevWidth: number;
  column: ColumnProps<T>;
  isExpanded: boolean;
  onExpanderClick: (event?: React.MouseEvent<Element, MouseEvent>) => void;
};

const TableCell = memo(function <T>({
  row,
  index,
  width,
  column,
  isExpanded,
  prevWidth,
  onExpanderClick
}: TableCellProps<T>) {
  // cell style
  const style: React.CSSProperties = {
    width: width || undefined,
    minWidth: width || undefined,
    left: column.frozen ? prevWidth : undefined
  };

  // cell classname
  const cellClass = column.contentCellClassname
    ? typeof column.contentCellClassname === "string"
      ? column.contentCellClassname
      : column.contentCellClassname({ row, index })
    : null;

  // expander
  if (column.expander) {
    if (typeof column.expander === "boolean") {
      const Logo = isExpanded ? Minus : Plus;

      return (
        <div className={cx("rft-cell", column.frozen && "frozen", cellClass)} style={style}>
          <Logo className="rft-expander" onClick={onExpanderClick} />
        </div>
      );
    }

    const frozenStyle: React.CSSProperties = column.frozen ? { position: "sticky", zIndex: 2 } : {};
    return (
      <column.expander
        row={row}
        index={index}
        isExpanded={isExpanded}
        onClick={onExpanderClick}
        style={{ ...style, ...frozenStyle }}
      />
    );
  }

  // basic styling
  if (!column.cell) {
    let content = (row[column.key as keyof T] || null) as React.ReactNode;
    if (column.content) {
      if (typeof column.content === "string" || typeof column.content === "number") {
        content = column.content;
      } else {
        content = <column.content row={row} index={index} />;
      }
    }

    return (
      <div className={cx("rft-cell", column.frozen && "frozen", cellClass)} style={style}>
        {content}
      </div>
    );
  }

  // custom cell styling
  const frozenStyle: React.CSSProperties = column.frozen ? { position: "sticky", zIndex: 2 } : {};
  return <column.cell row={row} index={index} style={{ ...style, ...frozenStyle }} />;
});

TableCell.displayName = "TableCell";

type RowComponentProps<T> = {
  row: T;
  index: number;
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  onRowClick?: (data: {
    row: T;
    index: number;
    event?: React.MouseEvent<Element, MouseEvent>;
  }) => void;
  rowRenderer?: (props: RowRenderProps<T>) => JSX.Element;
};

function RowComponent<T>({
  row,
  index,
  children,
  className,
  onRowClick,
  style,
  rowRenderer: RowRenderer
}: RowComponentProps<T>) {
  // functions
  const onContainerClick = useCallback(
    (event: React.MouseEvent<Element, MouseEvent>) => onRowClick?.({ row, index, event }),
    [row, index, onRowClick]
  );

  if (RowRenderer) {
    return (
      <RowRenderer row={row} index={index}>
        {children}
      </RowRenderer>
    );
  }

  return (
    <div className={className} style={style} onClick={onContainerClick}>
      {children}
    </div>
  );
}

type RowProps<T> = {
  uuid: string;
  row: T;
  rowKey: string | number;
  index: number;
  pixelWidths: number[];
  columns: ColumnProps<T>[];
  isExpanded: boolean;
  onExpand: (
    row: T,
    index: number,
    rowKey: string | number,
    event?: React.MouseEvent<Element, MouseEvent>
  ) => void;
  className?: string;
  style?: React.CSSProperties;
  subComponent?: (props: SubComponentProps<T>) => React.ReactNode | JSX.Element;
  onRowClick?: (data: {
    row: T;
    index: number;
    event?: React.MouseEvent<Element, MouseEvent>;
  }) => void;
  rowRenderer?: (props: RowRenderProps<T>) => JSX.Element;
};

const Row = forwardRef(function <T>(
  {
    uuid,
    index,
    row,
    rowKey,
    columns,
    pixelWidths,
    isExpanded,
    onExpand,
    onRowClick,
    className,
    style,
    rowRenderer,
    subComponent: SubComponent
  }: RowProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return (
    <div
      ref={ref}
      data-index={index}
      data-row-key={`${uuid}-${rowKey}`}
      className="rft-row-container"
    >
      <RowComponent
        row={row}
        index={index}
        className={cx("rft-row", className)}
        style={style}
        onRowClick={onRowClick}
        rowRenderer={rowRenderer}
      >
        {columns.map((c, i) => (
          <TableCell
            key={`${uuid}-${rowKey}-${i}`}
            row={row}
            column={c as any}
            index={index}
            width={pixelWidths[i]}
            isExpanded={isExpanded}
            onExpanderClick={e => onExpand(row, index, rowKey, e)}
            prevWidth={c.frozen ? pixelWidths.slice(0, i).reduce((pv, c) => pv + c, 0) : 0}
          />
        ))}
      </RowComponent>
      {!SubComponent ? null : (
        <div className={isExpanded ? undefined : "rft-hidden"}>
          <SubComponent row={row} index={index} isExpanded={isExpanded} />
        </div>
      )}
    </div>
  );
});

Row.displayName = "Row";

export default Row;
