import { Component } from "react";

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
  /**
   * A list of rows that are to be displayed in the table.
   */
  data: Generic[];
  /**
   * This property determines how each cell is going to be rendered.
   */
  columns: ColumnProps[];

  // default props
  estimatedRowHeight: number;

  // optional props

  /**
   * The id of the table
   */
  id?: string;
  /**
   * Optional className to override CSS styles.
   */
  className?: string;
  /**
   * Function that is called when a header cell is sorted.
   */
  onSort?: SortFn;
  /**
   * The column that is sorted by default.
   */
  sortColumn?: string;
  /**
   * The direction that is sorted by default.
   */
  sortDirection?: string;
  /**
   * Specify the height of the table in pixels.
   */
  tableHeight?: number;
  /**
   * Specify the width of the table in pixels.
   */
  tableWidth?: number;
  /**
   * Specify the minimum width of any column.
   */
  minColumnWidth?: number;
  /**
   * The fixed height of each row in pixels. If a subComponent is specified, then this will be the fixed height
   * of the portion of the row that is NOT the subComponent.
   */
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

export class Table extends Component<TableProps> {}
