import React, { forwardRef, JSX, memo, useCallback } from "react";
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

function BaseTableCell<T>({
  row,
  index,
  width,
  column,
  isExpanded,
  prevWidth,
  onExpanderClick
}: TableCellProps<T>) {
  // instance
  const { frozen, contentClassname, contentStyle } = column;
  const style: React.CSSProperties = {
    width: width || undefined,
    minWidth: width || undefined,
    left: frozen ? prevWidth : undefined
  };

  // expander
  if (column.expander) {
    // cell classname
    const cellClass =
      typeof contentClassname === "function" ? contentClassname({ row, index }) : contentClassname;

    if (typeof column.expander === "boolean") {
      const Logo = isExpanded ? Minus : Plus;
      const cellStyle =
        (typeof contentStyle === "function" ? contentStyle({ row, index }) : contentStyle) || {};

      return (
        <div
          className={cx("rft-cell", frozen && "frozen", cellClass)}
          style={{ ...cellStyle, ...style }}
        >
          <Logo className="rft-expander" onClick={onExpanderClick} />
        </div>
      );
    }

    const frozenStyle: React.CSSProperties = frozen ? { position: "sticky", zIndex: 2 } : {};
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
    // cell classname/style
    const cellClass =
      typeof contentClassname === "function" ? contentClassname({ row, index }) : contentClassname;
    const cellStyle =
      (typeof contentStyle === "function" ? contentStyle({ row, index }) : contentStyle) || {};
    let content = (row[column.key as keyof T] || null) as React.ReactNode;
    if (column.content) {
      if (typeof column.content === "string" || typeof column.content === "number") {
        content = column.content;
      } else {
        content = <column.content row={row} index={index} />;
      }
    }

    return (
      <div
        className={cx("rft-cell", frozen && "frozen", cellClass)}
        style={{ ...cellStyle, ...style }}
      >
        {content}
      </div>
    );
  }

  // custom cell styling
  const frozenStyle: React.CSSProperties = column.frozen ? { position: "sticky", zIndex: 2 } : {};
  return <column.cell row={row} index={index} style={{ ...style, ...frozenStyle }} />;
}

const TableCell = memo(BaseTableCell) as <T>(props: TableCellProps<T>) => React.JSX.Element;
(TableCell as React.FC).displayName = "TableCell";

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
  rowHeight?: number;
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

function BaseRow<T>(
  {
    uuid,
    index,
    row,
    rowKey,
    columns,
    rowHeight = 0,
    pixelWidths,
    isExpanded,
    onExpand,
    onRowClick,
    className,
    style = {},
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
        style={{ height: rowHeight > 0 ? rowHeight : undefined, ...style }}
        onRowClick={onRowClick}
        rowRenderer={rowRenderer}
      >
        {columns.map((c, i) => (
          <TableCell
            key={`${uuid}-${rowKey}-${i}`}
            row={row}
            column={c}
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
}

const Row = forwardRef(BaseRow) as <T>(
  props: RowProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => React.JSX.Element;
(Row as React.FC).displayName = "Row";

export default Row;
