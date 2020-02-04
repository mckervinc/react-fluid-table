import React, { useRef, useContext, useCallback, useEffect, useLayoutEffect } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import { TableContext } from "./TableContext";

const Row = ({
  row,
  index,
  style,
  pixelWidth,
  useRowWidth,
  isScrolling,
  subComponent,
  clearSizeCache,
  calculateHeight,
  generateKeyFromRow
}) => {
  // hooks
  const rowRef = useRef(null);
  const expandedCalledRef = useRef(false);
  const tableContext = useContext(TableContext);

  // variables
  const { dispatch } = tableContext;
  const { uuid, columns, expanded } = tableContext.state;

  // key
  const key = generateKeyFromRow(row, index);
  const rowUuid = `${uuid}-${key}`;

  // expanded
  const isExpanded = Boolean(expanded[key]);

  // function(s)
  const onExpanderClick = () => {
    dispatch({ type: "updateExpanded", key: generateKeyFromRow(row, index) });
    expandedCalledRef.current = true;
  };

  // cell renderer
  const cellRenderer = c => {
    if (c.expander) {
      return (
        <FontAwesomeIcon
          className="expander"
          icon={isExpanded ? faMinusCircle : faPlusCircle}
          onClick={onExpanderClick}
        />
      );
    }

    return !c.cell ? row[c.key] || null : c.cell(row, index, clearSizeCache);
  };

  const resetHeight = useCallback(() => {
    if (!rowRef.current) {
      return;
    }

    const height = rowRef.current.clientHeight;
    const correctHeight = calculateHeight(rowRef.current, index);
    if (height !== correctHeight) {
      clearSizeCache(index);
    }
  }, [rowRef, index, calculateHeight, clearSizeCache]);

  const onResize = useCallback(() => {
    setTimeout(resetHeight, 0)
  }, [resetHeight]);

  // effects
  useLayoutEffect(() => {
    if (expandedCalledRef.current) {
      clearSizeCache(index, true);
    }
  }, [isExpanded, index, clearSizeCache, expandedCalledRef]);

  useLayoutEffect(() => {
    if (rowRef.current && !expandedCalledRef.current && !isScrolling) {
      resetHeight();
    }

    expandedCalledRef.current = false;
  }, [rowRef, isExpanded, isScrolling, expandedCalledRef, resetHeight]);

  useEffect(() => {
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [onResize]);

  return (
    <div
      ref={rowRef}
      className="react-fluid-table-row"
      data-row-uuid={rowUuid}
      style={{ ...style, width: useRowWidth ? style.width : undefined }}
    >
      <div className="row-container">
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
      {!subComponent ? null : (
        <div className={isExpanded ? undefined : "hidden"}>
          {subComponent({ row, index, isExpanded, clearSizeCache })}
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
