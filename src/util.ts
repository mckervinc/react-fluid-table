export const distribute = (rem: number, numColumns: number) => {
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

export const randomString = (num = 5): string =>
  Math.random()
    .toString(36)
    .substr(2, num);

export const findHeaderByUuid = (uuid: string): HTMLElement | null =>
  document.querySelector(`[data-header-key='${uuid}-header']`);

export const findRowByUuidAndKey = (uuid: string, key: string | number): HTMLElement | null =>
  document.querySelector(`[data-row-key='${uuid}-${key}']`);
