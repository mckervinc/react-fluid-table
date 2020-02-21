declare module "*.svg" {
  const content: string;
  export default content;
}

interface SortFn {
  (col: string, dir: string) : void;
}

interface ListPropsRest {
  className: string;
  itemKey: Function;
  rowHeight: number;
  estimatedRowHeight: number;
  data: any;
  subComponent: any;
}

export interface TableProps {
  // required props
  data: object[];
  columns: ColumnProps[];

  // optional props
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
  [key: string]: any;
}
