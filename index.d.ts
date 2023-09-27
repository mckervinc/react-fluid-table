import { CSSProperties, ElementType, ReactNode } from "react";

declare module "*.svg" {
  const content: string;
  export default content;
}

export type Text = string | number;
export type SortDirection = "ASC" | "DESC";

type CacheFunction = (dataIndex: number, forceUpdate?: boolean) => void;
type HeightFunction = (
  queryParam: number | HTMLElement | null,
  optionalDataIndex?: number | null
) => number;
type GenKeyFunction = (row: Generic, defaultValue: number) => Text;
type ClickFunction = (
  event: React.MouseEvent<HTMLElement, MouseEvent>,
  data: { index: number }
) => void;

export interface Generic {
  [key: string]: any;
}

export interface ExpanderProps {
  isExpanded: boolean;
  onClick: Function;
  style: CSSProperties;
}

export interface CellProps<T> {
  row: T;
  index: number;
  clearSizeCache: CacheFunction;
  style?: CSSProperties;
}

export interface HeaderProps {
  onClick: (e: React.MouseEvent<Element, MouseEvent>) => void;
  style: React.CSSProperties;
  sortDirection: SortDirection | null;
}

export interface ColumnProps<T> {
  /**
   * The unique identifier for a particular column. This is also used as an index
   * to get the particular value out of the row in order to display.
   */
  key: string;
  /**
   * The name of the header column, or a component to return a customized header cell.
   */
  header?: string | ElementType<HeaderProps>;
  /**
   * The width of a column in pixels. If this is set, the column will not resize.
   */
  width?: number;
  /**
   * The minimum width of a column in pixels. On resize, the column will never
   * dip below this width.
   */
  minWidth?: number;
  /**
   * The maximum width of a column in pixels. On resize, the column will never
   * grow beyond this width.
   */
  maxWidth?: number;
  /**
   * Determines whether or not a column is sortable.
   */
  sortable?: boolean;
  /**
   * Marks this cell as an expansion cell. The style is pre-determined, and does the
   * functionalitty of collapsing/expanding a row.
   */
  expander?: boolean | ElementType<ExpanderProps>;
  /**
   * Used to render custom content inside of a cell. This is useful for rendering different
   * things inside of the react-fluid-table cell container.
   */
  content?: string | number | ElementType<CellProps<T>> | ((props: CellProps<T>) => React.ReactNode);
  /**
   * An advanced feature, this is used to render an entire cell, including the cell container.
   * The `content` prop is ignored if this property is enabled.
   */
  cell?: ElementType<CellProps<T>>;
}

export interface RowRenderProps {
  row: Generic;
  index: number;
  style: CSSProperties;
  children: ReactNode;
}

export interface RowProps<T> {
  row: T;
  index: number;
  style: CSSProperties;
  borders: boolean;
  rowHeight: number;
  rowStyle: CSSProperties | ((index: number) => CSSProperties);
  pixelWidths: number[];
  useRowWidth: boolean;
  clearSizeCache: CacheFunction;
  calculateHeight: HeightFunction;
  generateKeyFromRow: GenKeyFunction;
  onRowClick: ClickFunction;
  subComponent: ElementType<SubComponentProps<T>>;
  rowRenderer: ElementType<RowRenderProps>;
}

export interface SubComponentProps<T> {
  row: T;
  index: number;
  isExpanded: boolean;
  clearSizeCache: CacheFunction;
}

export interface ListProps<T> {
  height: number;
  width: number;
  data: T[];
  borders?: boolean;
  className?: string;
  rowHeight?: number;
  rowStyle?: CSSProperties | ((index: number) => CSSProperties);
  itemKey?: (row: T) => Text;
  subComponent?: ElementType<SubComponentProps<T>>;
  onRowClick?: ClickFunction;
  [key: string]: any;
}

export interface TableProps<T> {
  // required props
  /**
   * A list of rows that are to be displayed in the table.
   */
  data: T[];
  /**
   * This property determines how each cell is going to be rendered.
   */
  columns: ColumnProps<T>[];

  // optional props
  /**
   * The id of the table.
   */
  id?: string;
  /**
   * Optional className to override CSS styles.
   */
  className?: string;
  /**
   * Function that is called when a header cell is sorted.
   */
  onSort?: (col: string | null, dir: SortDirection | null) => void;
  /**
   * The column that is sorted by default.
   */
  sortColumn?: string;
  /**
   * The direction that is sorted by default.
   */
  sortDirection?: SortDirection;
  /**
   * Specify the height of the table in pixels.
   */
  tableHeight?: number;
  /**
   * Specify the width of the table in pixels.
   */
  tableWidth?: number;
  /**
   * Specify the minimum width of any column. Default: `80`.
   */
  minColumnWidth?: number;
  /**
   * Enable or disable row borders. Default: `true`.
   */
  borders?: boolean;
  /**
   * The fixed height of each row in pixels. If `subComponent` is specified,
   * then this will be the fixed height of the portion of the row that is
   * NOT the subComponent.
   */
  rowHeight?: number;
  /**
   * React styles used for customizing the table.
   */
  tableStyle?: CSSProperties;
  /**
   * React styles used for customizing the header.
   */
  headerStyle?: CSSProperties;
  /**
   * React styles used for customizing each row. Could be an object or
   * a function that takes the index of the row and returns an object.
   */
  rowStyle?: CSSProperties | ((index: number) => CSSProperties);
  /**
   * generates a unique identifier for the row
   * @param row the row
   * @returns string or number representing the item key
   */
  itemKey?: (row: T) => Text;
  /**
   * When a column has `expander`, this component will be rendered under the row.
   */
  subComponent?: (props: SubComponentProps<T>) => JSX.Element;
  /**
   * The callback that gets called every time a row is clicked.
   */
  onRowClick?: ClickFunction;
  /**
   * Custom component to wrap a table row. This provides another way of providing
   * more row customization options.
   */
  rowRenderer?: ElementType<RowRenderProps>;
  /**
   * a ref for specific table functions
   */
  ref?: React.ForwardedRef<TableRef>;
}

export interface TableRef {
  scrollTo: (scrollOffset: number) => void;
  scrollToItem: (index: number, align?: string) => void;
}

/**
 * A virtualized table build on top of `react-window`.
 */
export const Table: <T>(props: TableProps<T>) => JSX.Element;
