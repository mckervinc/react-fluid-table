import React from 'react';

declare module 'react-fluid-table' {

  interface SortFn {
    (col: string, dir: string);
  }

  export interface ColumnProps {
    key: string;
    name: string;
    width?: number;
    expander?: boolean;
    cell?: function;
  }

  export interface TableProps {
    // required props
    data: object[];
    columns: ColumnProps[];
    tableHeight: number;

    // optional props
    id?: string;
    onSort?: SortFn;
    sortColumn?: string;
    sortDirection?: string;
    tableWidth?: number;
    minColumnWidth?: number;
    rowHeight?: number;
    defaultRowHeight: number;
  }

  declare const Table: React.FC<TableProps>;
  export default Table;
}
