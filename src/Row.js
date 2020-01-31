import React, {
  useRef,
  useState,
  useContext,
  useEffect,
  useLayoutEffect,
  useCallback
} from "react";
import PropTypes from "prop-types";
import { findColumnWidthConstants } from "./util";
import { useCellResize } from "./useCellResize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import { TableContext } from "./TableContext";

// base scroll width
const NO_PARENT = {
  parentElement: { scrollWidth: 0, clientWidth: 0 }
};

const Row = ({
  row,
  index,
  style,
  tableRef,
  rowHeight,
  subComponent,
  clearSizeCache,
  calculateHeight,
  generateKeyFromRow
}) => {
  // hooks
  const rowRef = useRef(null);
  const resizeRef = useRef(null);
  const tableContext = useContext(TableContext);
  const [useRowWidth, setUseRowWidth] = useState(true);
  const [colWidths] = useState(findColumnWidthConstants(tableContext.state.columns));

  // variables
  const { dispatch } = tableContext;

  // calculate pixel width for remaining cols
  const { uuid, columns, expanded, minColumnWidth } = tableContext.state;

  const { fixedWidth, remainingCols } = colWidths;
  const pixelWidth = useCellResize(
    tableRef.current || uuid,
    remainingCols,
    fixedWidth,
    minColumnWidth,
    true
  );

  // key
  const key = generateKeyFromRow(row, index);
  const rowUuid = `${uuid}-${key}`;

  // expanded
  const isExpanded = Boolean(expanded[key]);

  // function(s)
  const onExpanderClick = () => {
    dispatch({ type: "updateExpanded", key: generateKeyFromRow(row, index) });
    clearSizeCache(index);
  };
  const onWindowResize = useCallback(() => {
    if (resizeRef.current) {
      window.clearTimeout(resizeRef.current);
    }

    resizeRef.current = window.setTimeout(() => {
      const { parentElement } = tableRef.current || NO_PARENT;
      setUseRowWidth(parentElement.scrollWidth <= parentElement.clientWidth);
    }, 50);
  }, [resizeRef, uuid, tableRef]);

  // cell renderer
  const cellRenderer = c => {
    if (c.expander) {
      return (
        <FontAwesomeIcon
          icon={isExpanded ? faMinusCircle : faPlusCircle}
          onClick={onExpanderClick}
        />
      );
    }

    return !c.cell ? row[c.key] || null : c.cell(row, index, clearSizeCache);
  };

  useLayoutEffect(() => {
    if (!rowRef.current) {
      return;
    }

    const element = rowRef.current;
    const height = element.clientHeight;
    const correctHeight = calculateHeight(rowRef.current, index);
    if (height !== correctHeight) {
      clearSizeCache(index, false);
    }
  }, [rowRef, calculateHeight, index, clearSizeCache]);

  useEffect(() => {
    window.addEventListener("resize", onWindowResize);
    return () => {
      if (resizeRef.current) {
        window.clearTimeout(resizeRef.current);
      }
      window.removeEventListener("resize", onWindowResize);
    };
  }, [onWindowResize, resizeRef]);

  useEffect(() => {
    if (!tableRef.current) {
      return;
    }

    setUseRowWidth(tableRef.current.scrollWidth <= tableRef.current.clientWidth);
  }, [tableRef, pixelWidth]);

  return (
    <div
      className="react-fluid-table-row"
      ref={rowRef}
      data-row-uuid={rowUuid}
      style={{ ...style, width: useRowWidth ? style.width : undefined }}
    >
      <div className="row-container" style={{ height: rowHeight ? `${rowHeight}px` : undefined }}>
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
        <div style={{ display: isExpanded ? undefined : "none" }}>
          {subComponent({ row, index, isExpanded, clearSizeCache })}        
        </div>
      )}
    </div>
  );
};

Row.propTypes = {
  row: PropTypes.object,
  rowHeight: PropTypes.number,
  index: PropTypes.number,
  style: PropTypes.object,
  subComponent: PropTypes.elementType,
  generateKeyFromRow: PropTypes.func,
  calculateHeight: PropTypes.func,
  clearSizeCache: PropTypes.func
};

export default Row;
