import { ColumnProps } from "..";

/**
 * combines multiple classNames conditionally
 * @param classes list of potential className strings
 * @returns a combined className string
 */
const cx = (...args: (string | number | null | boolean | undefined)[]) => {
  return args
    .flat()
    .filter((x): x is Exclude<typeof x, null | undefined> => !!x)
    .map(x => x.toString().trim())
    .join(" ");
};

const arraysMatch = <T>(arr1: T[] | null | undefined, arr2: T[] | null | undefined) => {
  if (arr1 == null && arr2 == null) {
    return true;
  }

  if (arr1 != null && arr2 != null) {
    if (arr1.length !== arr2.length) {
      return false;
    }

    for (var i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }

    return true;
  }

  return false;
};

const randomString = (num: number) => {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const length = characters.length;
  for (let i = 0; i < num; i++) {
    result += characters.charAt(Math.floor(Math.random() * length));
  }
  return result;
};

const findElementByValue = (value: string) => document.querySelector<HTMLElement>(value);

const findHeaderByUuid = (uuid: string) => findElementByValue(`[data-header-key='${uuid}-header']`);

const findFooterByUuid = (uuid: string) => findElementByValue(`[data-footer-key='${uuid}-footer']`);

// table utilities
const calculateColumnWidths = <T>(
  clientWidth: number,
  numColumns: number,
  fixedColumnWidths: number,
  minColumnWidth: number,
  columns: ColumnProps<T>[]
) => {
  let n = Math.max(numColumns, 1);
  let usedSpace = fixedColumnWidths;
  let freeSpace = Math.max(clientWidth - usedSpace, 0);
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
        freeSpace = Math.max(clientWidth - usedSpace, 0);
        width = Math.max(minColumnWidth, Math.floor(freeSpace / n));
        return c.maxWidth;
      }
    }

    if (c.minWidth) {
      const diff = c.minWidth - width;
      if (diff > 0) {
        n = Math.max(n - 1, 1);
        usedSpace += c.minWidth;
        freeSpace = Math.max(clientWidth - usedSpace, 0);
        width = Math.max(minColumnWidth, Math.floor(freeSpace / n));
        return c.minWidth;
      }
    }
    return width;
  });
};

const findColumnWidthConstants = <T>(columns: ColumnProps<T>[]) => {
  return columns.reduce(
    (pv, c) => ({
      fixedWidth: pv.fixedWidth + (c.width || 0),
      remainingCols: pv.remainingCols + (c.width === undefined ? 1 : 0)
    }),
    { fixedWidth: 0, remainingCols: 0 }
  );
};

export {
  arraysMatch,
  calculateColumnWidths,
  cx,
  findColumnWidthConstants,
  findFooterByUuid,
  findHeaderByUuid,
  randomString
};
