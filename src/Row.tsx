import React, { useRef, useContext, useCallback, useLayoutEffect } from "react";
import { TableContext } from "./TableContext";
import { RowProps, ColumnProps } from "../index";
import useResize from "./useResize";

//@ts-ignore TS2307
import Plus from "./svg/plus-circle.svg";

//@ts-ignore TS2307
import Minus from "./svg/minus-circle.svg";

const Row = ({
  row,
  index,
  style,
  rowHeight,
  pixelWidths,
  useRowWidth,
  clearSizeCache,
  calculateHeight,
  generateKeyFromRow,
  subComponent: SubComponent
}: RowProps) => {
  // hooks
  const expandedCalledRef = useRef(false);
  const rowRef = useRef<HTMLDivElement>(null);
  const tableContext = useContext(TableContext);

  // variables
  const { height } = style;
  const { dispatch } = tableContext;
  const { uuid, columns, expanded } = tableContext.state;

  // key
  const key = generateKeyFromRow(row, index);
  const rowKey = `${uuid}-${key}`;

  // expanded
  const isExpanded = Boolean(expanded[key]);
  const containerHeight = !rowHeight ? undefined : isExpanded && SubComponent ? rowHeight : "100%";

  // sub component props
  const subProps = { row, index, isExpanded, clearSizeCache };

  // function(s)
  const onExpanderClick = () => {
    dispatch({ type: "updateExpanded", key: generateKeyFromRow(row, index) });
    expandedCalledRef.current = true;
  };

  // cell renderer
  const cellRenderer = (c: ColumnProps) => {
    if (c.expander) {
      let Logo: any = c.expander;
      if (typeof c.expander === "boolean") {
        Logo = isExpanded ? Minus : Plus;
        return <Logo className="expander" onClick={onExpanderClick} />;
      }

      // assume the expander is a component
      return <Logo isExpanded={isExpanded} onClick={onExpanderClick} />;
    }

    if (!c.cell) {
      return row[c.key] || null;
    }

    const Cell = c.cell;
    return <Cell row={row} index={index} clearSizeCache={clearSizeCache} />;
  };

  const resetHeight = useCallback(() => {
    if (!rowRef.current) {
      return;
    }

    if (height !== calculateHeight(rowRef.current, index)) {
      clearSizeCache(index);
    }
  }, [rowRef, index, height, calculateHeight, clearSizeCache]);

  // effects
  useLayoutEffect(() => {
    if (expandedCalledRef.current) {
      clearSizeCache(index, true);
    }
  }, [isExpanded, index, clearSizeCache, expandedCalledRef]);

  useLayoutEffect(() => {
    if (!expandedCalledRef.current) {
      resetHeight();
    }

    expandedCalledRef.current = false;
  }, [isExpanded, expandedCalledRef, resetHeight]);

  // on resize check for height mismatch
  useResize(resetHeight, 65);

  return (
    <div
      ref={rowRef}
      className="react-fluid-table-row"
      data-index={index}
      data-row-key={rowKey}
      style={{
        ...style,
        width: useRowWidth ? style.width : undefined,
        height: rowRef.current || rowHeight ? style.height : undefined
      }}
    >
      <div className="row-container" style={{ height: containerHeight }}>
        {columns.map((c: ColumnProps, i: number) => {
          const width = pixelWidths[i];
          const style = {
            width: width ? `${width}px` : undefined,
            minWidth: width ? `${width}px` : undefined
          };
          return (
            <div className="cell" key={`${uuid}-${c.key}-${key}`} style={style}>
              {cellRenderer(c)}
            </div>
          );
        })}
      </div>
      {!SubComponent ? null : (
        <div className={isExpanded ? undefined : "hidden"}>
          <SubComponent {...subProps} />
        </div>
      )}
    </div>
  );
};

export default Row;
