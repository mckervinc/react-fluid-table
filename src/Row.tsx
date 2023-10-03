import React, { useCallback, useContext, useLayoutEffect, useRef } from "react";
import { ListChildComponentProps } from "react-window";
import { CacheFunction, ColumnProps, RowRenderProps, SubComponentProps } from "../index";
import { TableContext } from "./TableContext";
import Minus from "./svg/minus-circle.svg";
import Plus from "./svg/plus-circle.svg";
import { cx } from "./util";

interface TableCellProps<T> {
  row: T;
  index: number;
  width?: number;
  column: ColumnProps<T>;
  isExpanded: boolean;
  clearSizeCache: CacheFunction;
  onExpanderClick: (event?: React.MouseEvent<Element, MouseEvent>) => void;
}

interface RowContainerProps<T> {
  row: T;
  index: number;
  className?: string;
  children: React.ReactNode;
  containerStyle: React.CSSProperties;
  onRowClick: (event: React.MouseEvent<Element, MouseEvent>, data: { index: number }) => void;
  rowRenderer: (props: RowRenderProps<T>) => JSX.Element;
}

interface RowProps<T> extends Omit<ListChildComponentProps<T>, "data"> {
  row: T;
  borders: boolean;
  rowHeight: number;
  rowClassname: string | ((index: number) => string);
  rowStyle: React.CSSProperties | ((index: number) => React.CSSProperties);
  useRowWidth: boolean;
  clearSizeCache: CacheFunction;
  calculateHeight: (
    queryParam: number | HTMLElement | null,
    optionalDataIndex?: number | null
  ) => number;
  generateKeyFromRow: (row: T, defaultValue: number) => string | number;
  onRowClick: (event: React.MouseEvent<Element, MouseEvent>, data: { index: number }) => void;
  subComponent?: (props: SubComponentProps<T>) => React.ReactNode;
  rowRenderer: (props: RowRenderProps<T>) => JSX.Element;
}

type CSSFunction = (index: number) => React.CSSProperties;
type CSSClassFunction = (index: number) => string;

const getRowStyle = (index: number, rowStyle?: React.CSSProperties | CSSFunction) => {
  if (!rowStyle) {
    return {};
  }

  return typeof rowStyle === "function" ? rowStyle(index) : rowStyle;
};

const getRowClassname = (index: number, rowClassname?: string | CSSClassFunction) => {
  if (!rowClassname) {
    return undefined;
  }

  return typeof rowClassname === "function" ? rowClassname(index) : rowClassname;
};

const TableCell = React.memo(function <T>({
  row,
  index,
  width,
  column,
  isExpanded,
  clearSizeCache,
  onExpanderClick
}: TableCellProps<T>) {
  // cell width
  const cellWidth = width ? `${width}px` : undefined;
  const style: React.CSSProperties = {
    width: cellWidth,
    minWidth: cellWidth
  };

  // expander
  if (column.expander) {
    if (typeof column.expander === "boolean") {
      const Logo = isExpanded ? Minus : Plus;

      return (
        <div className="cell" style={style}>
          <Logo className="expander" onClick={onExpanderClick} />
        </div>
      );
    }

    const Expander = column.expander;
    return <Expander style={style} isExpanded={isExpanded} onClick={onExpanderClick} />;
  }

  // basic styling
  if (!column.cell) {
    // @ts-ignore
    let content: React.ReactNode = row[column.key] || null;
    if (column.content) {
      if (typeof column.content === "string" || typeof column.content === "number") {
        content = column.content;
      } else {
        const Content = column.content;
        content = <Content row={row} index={index} clearSizeCache={clearSizeCache} />;
      }
    }
    return (
      <div className="cell" style={style}>
        {content}
      </div>
    );
  }

  // custom cell styling
  const CustomCell = column.cell;
  return <CustomCell row={row} index={index} style={style} clearSizeCache={clearSizeCache} />;
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
        onRowClick(event, { index });
      }
    },
    [index, onRowClick]
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
      className={cx(["row-container", className])}
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
  useRowWidth,
  rowRenderer,
  clearSizeCache,
  calculateHeight,
  generateKeyFromRow,
  subComponent: SubComponent
}: RowProps<T>) {
  // hooks
  const expandedCalledRef = useRef(false);
  const rowRef = useRef<HTMLDivElement>(null);
  const { dispatch, uuid, columns, expanded, pixelWidths } = useContext(TableContext);

  // variables
  const { height } = style;

  // key
  const key = generateKeyFromRow(row, index);
  const rowKey = `${uuid}-${key}`;

  // expanded
  const isExpanded = !!expanded[key];
  const containerHeight = !rowHeight ? undefined : isExpanded && SubComponent ? rowHeight : "100%";

  // sub component props
  const subProps: SubComponentProps<T> = { row, index, isExpanded, clearSizeCache };

  // row styling
  const borderBottom = borders ? undefined : "none";
  const containerStyle: React.CSSProperties = {
    height: containerHeight,
    ...getRowStyle(index, rowStyle)
  };
  const containerClassname = getRowClassname(index, rowClassname);

  // function(s)
  const onExpanderClick = useCallback(() => {
    dispatch({ type: "updateExpanded", key: generateKeyFromRow(row, index) });
    expandedCalledRef.current = true;
  }, [dispatch, row, index, generateKeyFromRow, expandedCalledRef]);

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
    if (!expandedCalledRef.current) {
      resetHeight();
    } else {
      clearSizeCache(index, true);
    }

    expandedCalledRef.current = false;
  }, [isExpanded, resetHeight, index, clearSizeCache]);

  return (
    <div
      ref={rowRef}
      className="react-fluid-table-row"
      data-index={index}
      data-row-key={rowKey}
      style={{ ...style, borderBottom, width: useRowWidth ? style.width : undefined }}
    >
      <RowContainer
        row={row}
        index={index}
        onRowClick={onRowClick}
        rowRenderer={rowRenderer}
        className={containerClassname}
        containerStyle={containerStyle}
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
          />
        ))}
      </RowContainer>
      {!SubComponent ? null : (
        <div className={isExpanded ? undefined : "hidden"}>
          <SubComponent {...subProps} />
        </div>
      )}
    </div>
  );
}

export default Row;
