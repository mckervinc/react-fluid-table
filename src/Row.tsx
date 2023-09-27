import React, { SVGProps, useCallback, useContext, useLayoutEffect, useRef } from "react";
import {
  CacheFunction,
  ClickFunction,
  ColumnProps,
  Generic,
  RowProps,
  RowRenderProps
} from "../index";
//@ts-ignore TS2307
import Minus from "./svg/minus-circle.svg";
//@ts-ignore TS2307
import Plus from "./svg/plus-circle.svg";
import { TableContext } from "./TableContext";

interface TableCellProps<T> {
  row: T;
  index: number;
  width?: number;
  column: ColumnProps<T>;
  isExpanded: boolean;
  clearSizeCache: CacheFunction;
  onExpanderClick: (event?: React.MouseEvent<Element, MouseEvent>) => void;
}

interface RowContainerProps {
  row: Generic;
  index: number;
  children: React.ReactNode;
  containerStyle: React.CSSProperties;
  onRowClick: ClickFunction;
  rowRenderer: React.ElementType<RowRenderProps>;
}

type CSSFunction = (index: number) => React.CSSProperties;

const getRowStyle = (index: number, rowStyle?: React.CSSProperties | CSSFunction) => {
  if (!rowStyle) {
    return {};
  }

  return typeof rowStyle === "function" ? rowStyle(index) : rowStyle;
};

const TableCell = React.memo(
  ({
    row,
    index,
    width,
    column,
    isExpanded,
    clearSizeCache,
    onExpanderClick
  }: TableCellProps<any>) => {
    // cell width
    const style = {
      width: width ? `${width}px` : undefined,
      minWidth: width ? `${width}px` : undefined
    };

    // expander
    if (column.expander) {
      if (typeof column.expander === "boolean") {
        const Logo: React.ElementType<SVGProps<SVGSVGElement>> = isExpanded ? Minus : Plus;

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
  }
);

const RowContainer = ({
  row,
  index,
  children,
  onRowClick,
  containerStyle,
  rowRenderer: RowRenderer
}: RowContainerProps) => {
  const onContainerClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
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
      <RowRenderer row={row} index={index} style={style}>
        {children}
      </RowRenderer>
    );
  }

  return (
    <div className="row-container" style={containerStyle} onClick={onContainerClick}>
      {children}
    </div>
  );
};

const Row = ({
  row,
  index,
  style,
  borders,
  rowStyle,
  rowHeight,
  onRowClick,
  useRowWidth,
  rowRenderer,
  clearSizeCache,
  calculateHeight,
  generateKeyFromRow,
  subComponent: SubComponent
}: RowProps<any>) => {
  // hooks
  const expandedCalledRef = useRef(false);
  const rowRef = useRef<HTMLDivElement>(null);
  const tableContext = useContext(TableContext);

  // variables
  const { height } = style;
  const { dispatch } = tableContext;
  const { uuid, columns, expanded, pixelWidths } = tableContext.state;

  // key
  const key = generateKeyFromRow(row, index);
  const rowKey = `${uuid}-${key}`;

  // expanded
  const isExpanded = !!expanded[key];
  const containerHeight = !rowHeight ? undefined : isExpanded && SubComponent ? rowHeight : "100%";

  // sub component props
  const subProps = { row, index, isExpanded, clearSizeCache };

  // row styling
  const borderBottom = borders ? undefined : "none";
  const containerStyle = {
    height: containerHeight,
    ...getRowStyle(index, rowStyle)
  };

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
  }, [rowRef, index, height, calculateHeight, clearSizeCache, pixelWidths]);

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
  }, [isExpanded, expandedCalledRef, resetHeight, index, clearSizeCache]);

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
};

export default Row;
