import React, { useRef, useContext, useCallback, useEffect, useLayoutEffect } from "react";
import PropTypes from "prop-types";
import { TableContext } from "./TableContext";

import Plus from "./svg/plus-circle.svg";
import Minus from "./svg/minus-circle.svg";

const Row = ({
  row,
  index,
  style,
  rowHeight,
  pixelWidth,
  useRowWidth,
  clearSizeCache,
  calculateHeight,
  generateKeyFromRow,
  subComponent: SubComponent
}) => {
  // hooks
  const rowRef = useRef(null);
  const resizeRef = useRef(null);
  const expandedCalledRef = useRef(false);
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
  const cellRenderer = c => {
    if (c.expander) {
      let Logo = c.expander;
      if (typeof c.expander === "boolean") {
        Logo = isExpanded ? Minus : Plus;
        return <Logo className="expander" onClick={onExpanderClick} />;
      }

      // assume the expander is a component
      return <Logo isExpanded={isExpanded} onClick={onExpanderClick} />;
    }

    return !c.cell ? row[c.key] || null : c.cell(row, index, clearSizeCache);
  };

  const resetHeight = useCallback(() => {
    if (!rowRef.current) {
      return;
    }

    if (height !== calculateHeight(rowRef.current, index)) {
      clearSizeCache(index);
    }
  }, [rowRef, index, height, calculateHeight, clearSizeCache]);

  const onResize = useCallback(() => {
    if (resizeRef.current) {
      window.clearTimeout(resizeRef.current)
    }

    resizeRef.current = setTimeout(resetHeight, 65);
  }, [resetHeight, resizeRef]);

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

  useEffect(() => {
    window.addEventListener("resize", onResize);
    return () => {
      if (resizeRef.current) {
        window.clearTimeout(resizeRef.current)
      }
      window.removeEventListener("resize", onResize);
    };
  }, [onResize, resizeRef]);

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
        {columns.map(c => {
          const width = Math.max(c.width || pixelWidth, c.minWidth || 0);
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

Row.propTypes = {
  row: PropTypes.object,
  index: PropTypes.number,
  style: PropTypes.object,
  subComponent: PropTypes.elementType,
  generateKeyFromRow: PropTypes.func,
  calculateHeight: PropTypes.func,
  clearSizeCache: PropTypes.func
};

export default Row;
