import { FC, ElementType, ReactNode } from "react";

declare module "*.svg" {
  const content: string;
  export default content;
}

export type Text = string | number;

type KeyFunction = (row: Generic) => Text;
type CacheFunction = (dataIndex: number, forceUpdate?: boolean) => void;
type HeightFunction = (
  queryParam: number | HTMLElement | null,
  optionalDataIndex?: number | null
) => number;
type GenKeyFunction = (row: Generic, defaultValue: number) => Text;

export interface Generic {
  [key: string]: any;
}

export interface ExpanderProps {
  isExpanded: boolean;
  onClick: Function;
}

export interface CellProps {
  row: Generic;
  index: number;
  clearSizeCache: CacheFunction;
}

export interface ColumnProps {
  key: string;
  header: string | Function;
  width?: number;
  minWidth?: number;
  sortable?: boolean;
  expander?: boolean | ElementType<ExpanderProps>;
  cell?: ElementType<CellProps>;
}

export interface RowProps {
  row: Generic;
  index: number;
  style: Generic;
  rowHeight: number;
  pixelWidth: number;
  useRowWidth: boolean;
  clearSizeCache: CacheFunction;
  calculateHeight: HeightFunction;
  generateKeyFromRow: GenKeyFunction;
  subComponent: ElementType<SubComponentProps>;
}

export interface SubComponentProps {
  row: Generic;
  index: number;
  isExpanded: boolean;
  clearSizeCache: CacheFunction;
}

export interface ListProps {
  height: number;
  width: number;
  data: Generic[];
  estimatedRowHeight: number;
  className?: string;
  rowHeight?: number;
  itemKey?: KeyFunction;
  subComponent?: ElementType<SubComponentProps>;
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
  /**
   * When scrolling through the table, this value is used to guess what the height of the
   * row will be before it renders. If `rowHeight` is specified, this value is ignored.
   */
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
  onSort?: (col: string | null, dir: string | null) => void;
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
   * The fixed height of each row in pixels. If `subComponent` is specified, then this will be the fixed height
   * of the portion of the row that is NOT the subComponent.
   */
  rowHeight?: number;
  /**
   * When a column has `expander`, this component will be rendered under the row.
   */
  subComponent?: ElementType<SubComponentProps>;
}

export const Table: FC<TableProps>;
