export const arraysMatch = (arr1: any[], arr2: any[]) => {
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

export const randomString = (num = 5): string =>
  Math.random()
    .toString(36)
    .substr(2, num);

export const findHeaderByUuid = (uuid: string): HTMLElement | null =>
  document.querySelector(`[data-header-key='${uuid}-header']`);

export const findRowByUuidAndKey = (uuid: string, key: string | number): HTMLElement | null =>
  document.querySelector(`[data-row-key='${uuid}-${key}']`);
