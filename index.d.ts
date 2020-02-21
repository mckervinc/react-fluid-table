declare module "*.svg" {
  const content: string;
  export default content;
}

interface SortFn {
  (col: string, dir: string): void;
}

export type Text = string | number;

type KeyFunction = (row: Generic) => Text;

export interface Generic {
  [key: string]: any;
}

export interface TableProps {
  // required props
  data: Generic[];
  columns: ColumnProps[];

  // default props
  estimatedRowHeight: number;

  // optional props

  /**
   * The id of the table
   */
  id?: string;
  className?: string;
  onSort?: SortFn;
  sortColumn?: string;
  sortDirection?: string;
  tableHeight?: number;
  tableWidth?: number;
  minColumnWidth?: number;
  rowHeight?: number;
}

export interface ColumnProps {
  key: string;
  header: string | Function;
  width?: number;
  minWidth?: number;
  expander?: boolean;
  sortable?: boolean;
  cell?: Function;
}

export interface ListProps {
  height: number;
  width: number;
  data: Generic[];
  estimatedRowHeight: number;
  className?: string;
  rowHeight?: number;
  itemKey?: KeyFunction;
  [key: string]: any;
}
