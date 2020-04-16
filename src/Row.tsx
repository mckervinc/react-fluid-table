import React, { useCallback, useContext, useLayoutEffect, useRef } from "react";
import { ColumnProps, RowProps } from "../index";
import { TableContext } from "./TableContext";

//@ts-ignore TS2307
import Minus from "./svg/minus-circle.svg";

//@ts-ignore TS2307
import Plus from "./svg/plus-circle.svg";

const Row = ({
  row,
  index,
  style,
  rowHeight,
  useRowWidth,
  clearSizeCache,
  calculateHeight,
  generateKeyFromRow,
  subComponent: SubComponent,
  customRowContainer: CustomRowContainer
}: RowProps) => {
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
  // on expansion, clear the cache
  useLayoutEffect(() => {
    if (expandedCalledRef.current) {
      clearSizeCache(index, true);
    }
  }, [isExpanded, index, clearSizeCache, expandedCalledRef]);

  // every time isExpanded/pixelWidth changes, check the height
  useLayoutEffect(() => {
    if (!expandedCalledRef.current) {
      resetHeight();
    }

    expandedCalledRef.current = false;
  }, [isExpanded, expandedCalledRef, resetHeight, pixelWidths]);

  const DefaultRowContainer = props => (
    <div {...props}> 
      {props.children}
    </div>
  )

  const RowContainer = CustomRowContainer ? CustomRowContainer : DefaultRowContainer;

  return (
    <div
      ref={rowRef}
      className="react-fluid-table-row"
      data-index={index}
      data-row-key={rowKey}
      style={{ ...style, width: useRowWidth ? style.width : undefined }}
    >
      <RowContainer index={index} rowKey={rowKey} className="row-container" style={{ height: containerHeight }}>
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
