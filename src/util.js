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

export const randomString = (num = 5) =>
  Math.random()
    .toString(36)
    .substr(2, num);

export const findHeaderByUuid = uuid =>
  document.querySelector(`[data-header-uuid='${uuid}-header']`);

export const findRowByUuidAndKey = (uuid, key) =>
  document.querySelector(`[data-row-uuid='${uuid}-${key}']`);
