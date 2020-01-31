const scrollbarVisible = elem => {
  const el = typeof elem === "string" ? document.getElementById(elem) : elem;
  return Boolean(el) && el.scrollHeight > el.clientHeight;
};

export const calculateColumnWidth = (
  element,
  numColumns,
  fixedColumnWidths = 0,
  subtractScrollbar = false
) => {
  if (!element) return [0, 0];
  const n = Math.max(numColumns, 1);
  const parent = element.parentElement;
  const totalWidth = element.offsetWidth - (subtractScrollbar && scrollbarVisible(parent) ? 15 : 0);
  const freeSpace = Math.max(totalWidth - fixedColumnWidths, 0);
  const baseWidth = Math.floor(freeSpace / n);
  const remaining = Math.floor(freeSpace % n);

  return [baseWidth, remaining];
};

export const distribute = (rem, numColumns) => {
  const n = Math.max(numColumns, 1);
  const result = [...Array(n)].fill(0);
  const inc = Math.ceil(rem / n);
  let dec = rem;
  let i = 0;
  while (dec > 0 && i < n) {
    result[i] += inc;
    dec -= inc;
    i++;
  }

  return result.reverse();
};

export const findColumnWidthConstants = columns => {
  return columns.reduce(
    (pv, c) => ({
      fixedWidth: pv.fixedWidth + (c.width || 0),
      remainingCols: pv.remainingCols + (c.width === undefined ? 1 : 0)
    }),
    { fixedWidth: 0, remainingCols: 0 }
  );
};

export const randomString = (num = 5) =>
  Math.random()
    .toString(36)
    .substr(2, num);

export const findTableByUuid = uuid => document.querySelector(`[data-uuid='${uuid}']`);

export const findRowByUuidAndKey = (uuid, key) =>
  document.querySelector(`[data-row-uuid='${uuid}-${key}']`);
