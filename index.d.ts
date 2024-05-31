import { CSSProperties, ForwardedRef, ReactNode } from "react";

export type SortDirection = "ASC" | "DESC" | null;

type CacheFunction = (dataIndex: number, forceUpdate?: boolean) => void;

export type ExpanderProps = {
  /**
   * whether or not the row is expanded
   */
  isExpanded: boolean;
  /**
   * handler for clicking the expansion button
   * @param event mouse event
   * @returns void
   */
  onClick: (event?: React.MouseEvent<Element, MouseEvent>) => void;
  /**
   * required style for the expander
   */
  style: CSSProperties;
};

export type CellProps<T> = {
  /**
   * the data for the row
   */
  row: T;
  /**
   * the index of the row
   */
  index: number;
  /**
   * an optional function that can be used to clear the size cache
   */
  clearSizeCache: CacheFunction;
  /**
   * optional custom styles for each cell
   */
  style?: CSSProperties;
};

export type HeaderProps = {
  /**
   * the onclick handler for the header cell
   * @param e mouse event
   * @returns void
   */
  onClick: (e: React.MouseEvent<Element, MouseEvent>) => void;
  /**
   * required style for the header
   */
  style: CSSProperties;
  /**
   * the direction of the sort, if applicable
   */
  sortDirection: SortDirection;
};

export type RowRenderProps<T> = {
  /**
   * the data for the row
   */
  row: T;
  /**
   * the index of the row
   */
  index: number;
  /**
   * required row position styles
   */
  style: CSSProperties;
  /**
   * the cells for the row
   */
  children: ReactNode;
  /**
   * the className for the row-renderer
   */
  className?: string;
};

export type SubComponentProps<T> = {
  /**
   * the data for the row
   */
  row: T;
  /**
   * the index of the row
   */
  index: number;
  /**
   * whether or not the row is expanded
   */
  isExpanded: boolean;
  /**
   * an optional function that can be used to clear the size cache
   */
  clearSizeCache: CacheFunction;
};

export type FooterProps<T> = {
  /**
   * exposes the widths of each column to the footer
   */
  widths: number[];
  rows: T[];
};

export type FooterCellProps<T> = {
  /**
   * the column that the current footer cell is pulling from
   */
  column: ColumnProps<T>;
  /**
   * the calculated width of the cell
   */
  width: number;
  /**
   * all the rows in the table. this can be useful for aggregation
   */
  rows: T[];
};

export type ColumnProps<T> = {
  /**
   * The unique identifier for a particular column. This is also used as an index
   * to get the particular value out of the row in order to display.
   */
  key: string;
  /**
   * The name of the header column, or a component to return a customized header cell.
   */
  header?: string | ((props: HeaderProps) => JSX.Element);
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
   * Determines whether or not the column is frozen during horizontal scrolling.
   */
  frozen?: boolean;
  /**
   * Marks this cell as an expansion cell. The style is pre-determined, and does the
   * functionalitty of collapsing/expanding a row.
   */
  expander?: boolean | ((props: ExpanderProps) => ReactNode);
  /**
   * Used to render custom content inside of a cell. This is useful for rendering different
   * things inside of the react-fluid-table cell container.
   */
  content?: string | number | ((props: CellProps<T>) => ReactNode | JSX.Element);
  /**
   * An advanced feature, this is used to render an entire cell, including the cell container.
   * The `content` prop is ignored if this property is enabled.
   */
  cell?: (props: CellProps<T>) => JSX.Element;
  /**
   * specifies whether or not to display a footer cell
   */
  footer?: (props: FooterCellProps<T>) => ReactNode | JSX.Element;
};

export type TableRef = {
  scrollTo: (scrollOffset: number) => void;
  scrollToItem: (index: number, align?: string) => void;
};

export type TableProps<T> = {
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
  onSort?: (col: string | null, dir: SortDirection) => void;
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
   * Specify the minimum height of the table in pixels.
   */
  minTableHeight?: number;
  /**
   * Specify the maximum height of the table in pixels.
   */
  maxTableHeight?: number;
  /**
   * Specify the width of the table in pixels.
   */
  tableWidth?: number;
  /**
   * Specify the minimum width of any column. Default: `80`.
   */
  minColumnWidth?: number;
  /**
   * The fixed height of each row in pixels. If `subComponent` is specified,
   * then this will be the fixed height of the portion of the row that is
   * NOT the subComponent.
   */
  rowHeight?: number;
  /**
   * specify a fixed header height
   */
  headerHeight?: number;
  /**
   * specify a fixed footer height
   */
  footerHeight?: number;
  /**
   * Enable or disable row borders. Default: `false`.
   */
  borders?: boolean;
  /**
   * React styles used for customizing the table.
   */
  tableStyle?: CSSProperties;
  /**
   * React styles used for customizing the header.
   */
  headerStyle?: CSSProperties;
  /**
   * a className used to customize the header
   */
  headerClassname?: string;
  /**
   * React styles used for customizing each row. Could be an object or
   * a function that takes the index of the row and returns an object.
   */
  rowStyle?: CSSProperties | ((index: number) => CSSProperties);
  /**
   * React className used for customizing each row. Could be an object or
   * a function that takes the index of the row and returns an object.
   */
  rowClassname?: string | ((index: number) => string);
  /**
   * React styles used for customizing each row container. Could be an object or
   * a function that takes the index of the row and returns an object.
   */
  rowContainerStyle?: CSSProperties | ((index: number) => CSSProperties);
  /**
   * React className used for customizing each row container. Could be an object or
   * a function that takes the index of the row and returns an object.
   */
  rowContainerClassname?: string | ((index: number) => string);
  /**
   * React styles used for customizing the footer.
   */
  footerStyle?: CSSProperties;
  /**
   * a className used to customize the footer
   */
  footerClassname?: string;
  /**
   * generates a unique identifier for the row
   * @param row the row
   * @returns string or number representing the item key
   */
  itemKey?: (row: T) => string | number;
  /**
   * controlls whether or not the footer is sticky. this is only used if
   * `footerComponent` is specified.
   */
  stickyFooter?: boolean;
  /**
   * optionally add a footer. NOTE: this overrides the `footer` prop of a
   * column, so use wisely. This gives the user more control over how the
   * footer is rendered. Can return any value.
   */
  footerComponent?: (props: FooterProps<T>) => ReactNode;
  /**
   * When a column has `expander`, this component will be rendered under the row.
   */
  subComponent?: (props: SubComponentProps<T>) => ReactNode | JSX.Element;
  /**
   * The callback that gets called every time a row is clicked.
   */
  onRowClick?: (event: React.MouseEvent<Element, MouseEvent>, data: { index: number }) => void;
  /**
   * Custom component to wrap a table row. This provides another way of providing
   * more row customization options.
   */
  rowRenderer?: (props: RowRenderProps<T>) => JSX.Element;
  /**
   * a ref for specific table functions
   */
  ref?: ForwardedRef<TableRef>;
};

/**
 * A virtualized table build on top of `react-window`.
 */
export const Table: <T>(props: TableProps<T>) => JSX.Element;
