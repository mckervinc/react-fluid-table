import { useRef, useState, useCallback, useEffect, useLayoutEffect } from "react";
import { ColumnProps } from "..";
import { arraysMatch } from "./util";

export const calculateColumnWidths = (
  element: HTMLElement,
  numColumns: number,
  fixedColumnWidths: number,
  minColumnWidth: number,
  columns: ColumnProps[]
): number[] => {
  if (!element) return columns.map(() => minColumnWidth);
  const offsetWidth = element.offsetWidth;
  let n = Math.max(numColumns, 1);
  let usedSpace = fixedColumnWidths;
  let freeSpace = Math.max(offsetWidth - usedSpace, 0);
  let width = Math.max(minColumnWidth, Math.floor(freeSpace / n));

  return columns.map((c: ColumnProps) => {
    if (c.width) {
      return c.width;
    }

    if (c.maxWidth) {
      const diff = width - c.maxWidth;
      if (diff > 0) {
        n = Math.max(n - 1, 1);
        usedSpace += c.maxWidth;
        freeSpace = Math.max(offsetWidth - usedSpace, 0);
        width = Math.max(minColumnWidth, Math.floor(freeSpace / n));
        return c.maxWidth;
      }
    }

    if (c.minWidth) {
      const diff = c.minWidth - width;
      if (diff > 0) {
        n = Math.max(n - 1, 1);
        usedSpace += c.minWidth;
        freeSpace = Math.max(offsetWidth - usedSpace, 0);
        width = Math.max(minColumnWidth, Math.floor(freeSpace / n));
        return c.minWidth;
      }
    }
    return width;
  });
};

export const useCellResize = (
  el: HTMLElement,
  numColumns: number,
  usedSpace: number,
  minColumnWidth: number,
  columns: ColumnProps[]
): number[] => {
  const timeoutRef = useRef(0);
  const [pixelWidths, setPixelWidths] = useState<number[]>([]);

  const updatepixelWidths = useCallback(() => {
    const widths = calculateColumnWidths(el, numColumns, usedSpace, minColumnWidth, columns);
    if (!arraysMatch(widths, pixelWidths)) {
      setPixelWidths(widths);
    }
  }, [el, pixelWidths, numColumns, usedSpace, minColumnWidth]);

  const resize = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(updatepixelWidths, 50);
  }, [timeoutRef, updatepixelWidths]);

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
    if (el && !pixelWidths) {
      updatepixelWidths();
    }
  }, [el, pixelWidths, updatepixelWidths]);

  return pixelWidths;
};
