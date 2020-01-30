import { useRef, useState, useCallback, useEffect, useLayoutEffect } from "react";
import { calculateColumnWidth, findTableByUuid } from "./util";

/**
 * Calculates the column widths of the cells in rows.
 * @param {string} selector - the data-uuid of the row element or the element
 * @param {number} numColumns - number of columns to calculate width for
 * @param {number} usedSpace - total size in pixels of defined widths
 * @param {number} minColumnWidth - the min column width of each column
 * @param {boolean} subtractScrollbar - whether or not to subtract the scrollbar width when finding column width
 */
export const useCellResize = (selector, numColumns, usedSpace, minColumnWidth = 0, subtractScrollbar = false) => {
  const timeoutRef = useRef(null);
  const [pixelWidth, setPixelWidth] = useState(0);
  const resize = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = window.setTimeout(() => {
      const el = typeof selector === "string" ? findTableByUuid(selector) : selector;
      const [val] = calculateColumnWidth(el, numColumns, usedSpace, subtractScrollbar);
      const width = Math.max(val, minColumnWidth);
      if (pixelWidth !== width) {
        setPixelWidth(width);
      }
    }, 50);
  }, [timeoutRef, selector, pixelWidth, numColumns, usedSpace, minColumnWidth, subtractScrollbar]);

  // effects
  // on resize re-calculate pixel width
  useEffect(() => {
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, [resize]);

  useLayoutEffect(() => {
    if (!pixelWidth) {
      resize();
    }
  }, [pixelWidth, resize]);

  return pixelWidth;
};
