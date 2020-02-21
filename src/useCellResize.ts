import { useRef, useState, useCallback, useEffect, useLayoutEffect } from "react";

export const calculateColumnWidth = (element: HTMLElement, numColumns: number, fixedColumnWidths: number) : number => {
  if (!element) return 0;
  const n = Math.max(numColumns, 1);
  const freeSpace = Math.max(element.offsetWidth - fixedColumnWidths, 0);
  return Math.floor(freeSpace / n);
};

export const useCellResize = (el: HTMLElement, numColumns: number, usedSpace: number, minColumnWidth: number) : number => {
  const timeoutRef = useRef(0);
  const [pixelWidth, setPixelWidth] = useState(0);

  const updatePixelWidth = useCallback(() => {
    const val = calculateColumnWidth(el, numColumns, usedSpace);
    const width = Math.max(val, minColumnWidth);
    if (pixelWidth !== width) {
      setPixelWidth(width);
    }
  }, [el, pixelWidth, numColumns, usedSpace, minColumnWidth]);

  const resize = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(updatePixelWidth, 50);
  }, [timeoutRef, updatePixelWidth]);

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
    if (el && !pixelWidth) {
      updatePixelWidth();
    }
  }, [el, pixelWidth, updatePixelWidth]);

  return pixelWidth;
};
