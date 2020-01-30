import { useState, useCallback, useEffect, useLayoutEffect } from "react";
import { calculateColumnWidth } from "./util";

/**
 * Calculates the column widths of the cells in rows.
 * @param {string} selector - the id or data-uuid of the row element or the element
 * @param {number} numColumns - number of columns to calculate width for
 * @param {number} usedSpace - total size in pixels of defined widths
 * @param {number} minColumnWidth - the min column width of each column
 * @param {boolean} subtractScrollbar - whether or not to subtract the scrollbar width when finding column width
 */
export const useCellResize = (selector, numColumns, usedSpace, minColumnWidth = 0, subtractScrollbar = false) => {
  const [pixelWidth, setPixelWidth] = useState(0);
  const resize = useCallback(() => {
    const el = document.getElementById(selector) || document.querySelector(selector);
    const [val] = calculateColumnWidth(el, numColumns, usedSpace, subtractScrollbar);
    const width = Math.max(val, minColumnWidth);
    if (pixelWidth !== width) {
      setPixelWidth(width);
    }
  }, [selector, pixelWidth, numColumns, usedSpace, minColumnWidth, subtractScrollbar]);

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
