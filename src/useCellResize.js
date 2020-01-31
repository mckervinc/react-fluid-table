import { useRef, useState, useCallback, useEffect, useLayoutEffect } from "react";

const scrollbarSize = () => {
  const scrollDiv = document.createElement("div");
  scrollDiv.style.position = "absolute";
  scrollDiv.style.top = "-9999px";
  scrollDiv.style.width = "50px";
  scrollDiv.style.height = "50px";
  scrollDiv.style.overflow = "scroll";
  document.body.appendChild(scrollDiv);
  const size = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  document.body.removeChild(scrollDiv);
  return size;
};

const scrollWidth = scrollbarSize();

const scrollbarVisible = el => Boolean(el) && el.scrollHeight > el.clientHeight;

const calculateColumnWidth = (
  element,
  numColumns,
  fixedColumnWidths = 0,
  subtractScrollbar = false
) => {
  if (!element) return [0, 0];
  const n = Math.max(numColumns, 1);
  const parent = element.parentElement;
  const totalWidth = element.offsetWidth - (subtractScrollbar && scrollbarVisible(parent) ? scrollWidth : 0);
  const freeSpace = Math.max(totalWidth - fixedColumnWidths, 0);
  const baseWidth = Math.floor(freeSpace / n);
  const remaining = Math.floor(freeSpace % n);

  return [baseWidth, remaining];
};

/**
 * Calculates the column widths of the cells in rows.
 * @param {object} el - the element that is being used to calculate widths
 * @param {number} numColumns - number of columns to calculate width for
 * @param {number} usedSpace - total size in pixels of defined widths
 * @param {number} minColumnWidth - the min column width of each column
 * @param {boolean} subtractScrollbar - whether or not to subtract the scrollbar width when finding column width
 */
export const useCellResize = (
  el,
  numColumns,
  usedSpace,
  minColumnWidth = 0,
  subtractScrollbar = false
) => {
  const timeoutRef = useRef(null);
  const [pixelWidth, setPixelWidth] = useState(0);
  const resize = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      const [val] = calculateColumnWidth(el, numColumns, usedSpace, subtractScrollbar);
      const width = Math.max(val, minColumnWidth);
      if (pixelWidth !== width) {
        setPixelWidth(width);
      }
    }, 50);
  }, [timeoutRef, el, pixelWidth, numColumns, usedSpace, minColumnWidth, subtractScrollbar]);

  // effects
  // on resize re-calculate pixel width
  useEffect(() => {
    window.addEventListener("resize", resize);
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      window.removeEventListener("resize", resize);
    };
  }, [resize, timeoutRef]);

  useLayoutEffect(() => {
    if (!pixelWidth) {
      resize();
    }
  }, [pixelWidth, resize]);

  return pixelWidth;
};
