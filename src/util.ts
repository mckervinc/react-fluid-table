import { ColumnProps } from "..";
import { DEFAULT_HEADER_HEIGHT, DEFAULT_ROW_HEIGHT } from "./constants";

export const arraysMatch = <T>(arr1: T[], arr2: T[]) => {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (var i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
};

export const randomString = (num = 5) => Math.random().toString(36).substr(2, num);

export const findHeaderByUuid = (uuid: string): HTMLElement | null =>
  document.querySelector(`[data-header-key='${uuid}-header']`);

export const findRowByUuidAndKey = (uuid: string, key: string | number): HTMLElement | null =>
  document.querySelector(`[data-row-key='${uuid}-${key}']`);

// table utilities
export const guessTableHeight = (rowHeight?: number) => {
  const height = Math.max(rowHeight || DEFAULT_ROW_HEIGHT, 10);
  return height * 10 + DEFAULT_HEADER_HEIGHT;
};

export const calculateColumnWidths = (
  element: HTMLElement | null,
  numColumns: number,
  fixedColumnWidths: number,
  minColumnWidth: number,
  columns: ColumnProps<any>[]
) => {
  if (!element) return columns.map(() => minColumnWidth);
  const offsetWidth = element.offsetWidth;
  let n = Math.max(numColumns, 1);
  let usedSpace = fixedColumnWidths;
  let freeSpace = Math.max(offsetWidth - usedSpace, 0);
  let width = Math.max(minColumnWidth, Math.floor(freeSpace / n));

  return columns.map(c => {
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
