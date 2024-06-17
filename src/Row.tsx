import React, { memo, useCallback, useContext, useLayoutEffect, useRef } from "react";
import { ListChildComponentProps } from "react-window";
import { ClearCacheOptions, ColumnProps, RowRenderProps, SubComponentProps } from "../index";
import { TableContext } from "./TableContext";
import Minus from "./svg/minus-circle.svg";
import Plus from "./svg/plus-circle.svg";
import { cx } from "./util";

type TableCellProps<T> = {
  row: T;
  index: number;
  width?: number;
  prevWidth: number;
  column: ColumnProps<T>;
  isExpanded: boolean;
  clearSizeCache: (dataIndex: number, options?: ClearCacheOptions) => void;
  onExpanderClick: (
    event: React.MouseEvent<Element, MouseEvent> | undefined,
    isExpanded: boolean
  ) => void;
};

type RowContainerProps<T> = {
  row: T;
  index: number;
  className?: string;
  children: React.ReactNode;
  containerStyle: React.CSSProperties;
  onRowClick: (data: {
    row: T;
    index: number;
    event: React.MouseEvent<Element, MouseEvent>;
  }) => void;
  rowRenderer: (props: RowRenderProps<T>) => JSX.Element;
};

interface RowProps<T> extends Omit<ListChildComponentProps<T>, "data"> {
  row: T;
  borders: boolean;
  rowHeight: number;
  rowClassname: string | ((index: number) => string);
  rowStyle: React.CSSProperties | ((index: number) => React.CSSProperties);
  rowContainerClassname: string | ((index: number) => string);
  rowContainerStyle: React.CSSProperties | ((index: number) => React.CSSProperties);
  useRowWidth: boolean;
  forceReset?: boolean;
  clearSizeCache: (dataIndex: number, options?: ClearCacheOptions) => void;
  calculateHeight: (
    queryParam: number | HTMLElement | null,
    optionalDataIndex?: number | null
  ) => number;
  generateKeyFromRow: (row: T, defaultValue: number) => string | number;
  onRowClick: (data: {
    row: T;
    index: number;
    event: React.MouseEvent<Element, MouseEvent>;
  }) => void;
  subComponent?: (props: SubComponentProps<T>) => React.ReactNode;
  onExpandRow?: (value: { row: T; index: number; isExpanded: boolean }) => void;
  rowRenderer: (props: RowRenderProps<T>) => JSX.Element;
}

const getRowStyle = (
  index: number,
  rowStyle?: React.CSSProperties | ((index: number) => React.CSSProperties)
) => {
  if (!rowStyle) {
    return {};
  }

  return typeof rowStyle === "function" ? rowStyle(index) : rowStyle;
};

const getRowClassname = (index: number, rowClassname?: string | ((index: number) => string)) => {
  if (!rowClassname) {
    return undefined;
  }

  return typeof rowClassname === "function" ? rowClassname(index) : rowClassname;
};

const TableCell = memo(function <T>({
  row,
  index,
  width,
  column,
  isExpanded,
  prevWidth,
  clearSizeCache,
  onExpanderClick
}: TableCellProps<T>) {
  // cell style
  const style: React.CSSProperties = {
    width: width || undefined,
    minWidth: width || undefined,
    left: column.frozen ? prevWidth : undefined
  };

  // expander
  if (column.expander) {
    if (typeof column.expander === "boolean") {
      const Logo = isExpanded ? Minus : Plus;

      return (
        <div className={cx("rft-cell", column.frozen && "frozen")} style={style}>
          <Logo className="rft-expander" onClick={e => onExpanderClick(e, !isExpanded)} />
        </div>
      );
    }

    const frozenStyle: React.CSSProperties = column.frozen ? { position: "sticky", zIndex: 2 } : {};
    return (
      <column.expander
        row={row}
        index={index}
        isExpanded={isExpanded}
        onClick={e => onExpanderClick(e, !isExpanded)}
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
        content = <column.content row={row} index={index} clearSizeCache={clearSizeCache} />;
      }
    }

    return (
      <div className={cx("rft-cell", column.frozen && "frozen")} style={style}>
        {content}
      </div>
    );
  }

  // custom cell styling
  const frozenStyle: React.CSSProperties = column.frozen ? { position: "sticky", zIndex: 2 } : {};
  return (
    <column.cell
      row={row}
      index={index}
      clearSizeCache={clearSizeCache}
      style={{ ...style, ...frozenStyle }}
    />
  );
});

TableCell.displayName = "TableCell";

function RowContainer<T>({
  row,
  index,
  children,
  className,
  onRowClick,
  containerStyle,
  rowRenderer: RowRenderer
}: RowContainerProps<T>) {
  const onContainerClick = useCallback(
    (event: React.MouseEvent<Element, MouseEvent>) => {
      if (onRowClick) {
        onRowClick({ row, index, event });
      }
    },
    [row, index, onRowClick]
  );

  if (RowRenderer) {
    const style = {
      ...containerStyle,
      display: "flex"
    };
    return (
      <RowRenderer row={row} index={index} className={className} style={style}>
        {children}
      </RowRenderer>
    );
  }

  return (
    <div
      className={cx("rft-row-container", className)}
      style={containerStyle}
      onClick={onContainerClick}
    >
      {children}
    </div>
  );
}

function Row<T>({
  row,
  index,
  style,
  borders,
  rowStyle,
  rowHeight,
  onRowClick,
  rowClassname,
  rowContainerStyle,
  rowContainerClassname,
  useRowWidth,
  forceReset,
  rowRenderer,
  onExpandRow,
  clearSizeCache,
  calculateHeight,
  generateKeyFromRow,
  subComponent: SubComponent
}: RowProps<T>) {
  // hooks
  const expandedCalledRef = useRef(false);
  const rowRef = useRef<HTMLDivElement>(null);
  const { dispatch, uuid, columns, expanded, expandedCache, pixelWidths } =
    useContext(TableContext);

  // variables
  const { height } = style;

  // key
  const key = generateKeyFromRow(row, index);
  const rowKey = `${uuid}-${key}`;

  // expanded
  const isExpanded = expanded ? expanded(index) : !!expandedCache[key];
  const containerHeight = !rowHeight ? undefined : isExpanded && SubComponent ? rowHeight : "100%";

  // sub component props
  const subProps: SubComponentProps<T> = { row, index, isExpanded, clearSizeCache };

  // function(s)
  const onExpanderClick = useCallback(
    (_: React.MouseEvent<Element, MouseEvent> | undefined, isExpanded: boolean) => {
      if (onExpandRow) {
        onExpandRow({ row, index, isExpanded });
      } else {
        dispatch({ type: "updateExpanded", key: generateKeyFromRow(row, index) });
      }
      expandedCalledRef.current = true;
    },
    [dispatch, row, index, generateKeyFromRow, onExpandRow]
  );

  const resetHeight = useCallback(() => {
    if (!rowRef.current || !pixelWidths.length) {
      return;
    }

    if (height !== calculateHeight(rowRef.current, index)) {
      clearSizeCache(index);
    }
  }, [index, height, calculateHeight, clearSizeCache, pixelWidths]);

  // effects
  // on expansion, clear the cache
  // every time isExpanded/pixelWidth changes, check the height
  useLayoutEffect(() => {
    if (!expandedCalledRef.current && !forceReset) {
      resetHeight();
    } else {
      clearSizeCache(index, { forceUpdate: true });
    }

    expandedCalledRef.current = false;
  }, [isExpanded, resetHeight, index, clearSizeCache, forceReset]);

  return (
    <div
      ref={rowRef}
      className={cx("rft-row", getRowClassname(index, rowContainerClassname))}
      data-index={index}
      data-row-key={rowKey}
      style={{
        ...getRowStyle(index, rowContainerStyle),
        ...style,
        borderBottom: borders ? undefined : "none",
        width: useRowWidth ? style.width : undefined
      }}
    >
      <RowContainer
        row={row}
        index={index}
        onRowClick={onRowClick}
        rowRenderer={rowRenderer}
        className={getRowClassname(index, rowClassname)}
        containerStyle={{
          height: containerHeight,
          ...getRowStyle(index, rowStyle)
        }}
      >
        {columns.map((c, i) => (
          <TableCell
            key={`${uuid}-${c.key}-${key}`}
            row={row}
            column={c}
            index={index}
            width={pixelWidths[i]}
            isExpanded={isExpanded}
            clearSizeCache={clearSizeCache}
            onExpanderClick={onExpanderClick}
            prevWidth={c.frozen ? pixelWidths.slice(0, i).reduce((pv, c) => pv + c, 0) : 0}
          />
        ))}
      </RowContainer>
      {!SubComponent ? null : (
        <div className={isExpanded ? undefined : "rft-hidden"}>
          <SubComponent {...subProps} />
        </div>
      )}
    </div>
  );
}

export default Row;
