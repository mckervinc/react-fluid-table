import { CSSProperties, JSX, ReactNode } from "react";

export type SortDirection = "ASC" | "DESC";

export type ScrollAlignment = "start" | "center" | "end" | "auto";

export type ExpanderProps<T> = {
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
  sortDirection: SortDirection | null;
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
};

export type FooterProps<T> = {
  /**
   * exposes the widths of each column to the footer
   */
  widths: number[];
  /**
   * the rows in the table
   */
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
   * specify a custom className for the header. If `header` is NOT a string, this is ignored.
   */
  headerClassname?: string;
  /**
   * specify a custom style for the header. If `header` is NOT a string, this is ignored.
   */
  headerStyle?: CSSProperties;
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
  expander?: boolean | ((props: ExpanderProps<T>) => ReactNode);
  /**
   * Used to render custom content inside of a cell. This is useful for rendering different
   * things inside of the react-fluid-table cell container.
   */
  content?: string | number | ((props: CellProps<T>) => ReactNode | JSX.Element);
  /**
   * specify a custom className for the content. If `cell` is specified, this is ignored.
   */
  contentClassname?: string | ((props: { row: T; index: number }) => string | undefined);
  /**
   * specify a custom style for the content. If `cell` is specified, this is ignored.
   */
  contentStyle?: CSSProperties | ((props: { row: T; index: number }) => CSSProperties | undefined);
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
  /**
   * scrolls to a specific pixel offset
   * @param scrollOffset pixel offset
   */
  scrollTo: (scrollOffset: number) => void;
  /**
   *
   * @param index the index of the row to scroll to
   * @param align where to align the row after scrolling
   * @returns
   */
  scrollToItem: (index: number, align?: ScrollAlignment) => void;
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
  onSort?: (col: string, dir: SortDirection | null) => void;
  /**
   * The column that is sorted by default.
   */
  sortColumn?: string;
  /**
   * The direction that is sorted by default.
   */
  sortDirection?: SortDirection | null;
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
   * The estimated height of each row in pixels. This can be used to help mitigate any
   * "jank" in initial renders, as well as help calculate the table height when
   * `tableHeight` is not specified.
   */
  estimatedRowHeight?: number;
  /**
   * specify a fixed header height
   */
  headerHeight?: number;
  /**
   * specify a fixed footer height
   */
  footerHeight?: number;
  /**
   * React styles used for customizing the table.
   */
  style?: CSSProperties;
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
   * a function that takes the index or the row and returns an object.
   */
  rowStyle?: CSSProperties | ((value: { row: T; index: number }) => CSSProperties | undefined);
  /**
   * React className used for customizing each row. Could be an object or
   * a function that takes the index or the row and returns an object.
   */
  rowClassname?: string | ((value: { row: T; index: number }) => string);
  /**
   * React styles used for customizing the footer.
   */
  footerStyle?: CSSProperties;
  /**
   * a className used to customize the footer
   */
  footerClassname?: string;
  /**
   * an object that contains the expanded rows. can also be a function that takes the index
   * or row and returns a boolean.
   */
  expandedRows?:
    | { [x: string | number]: boolean }
    | ((value: { row: T; index: number }) => boolean);
  /**
   * called when a row is expanded
   * @param value information about the row that is expanded/shrunk
   * @returns
   */
  onExpandRow?: (value: {
    row: T;
    index: number;
    isExpanded: boolean;
    event?: React.MouseEvent<Element, MouseEvent>;
  }) => void;
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
  onRowClick?: (data: {
    row: T;
    index: number;
    event?: React.MouseEvent<Element, MouseEvent>;
  }) => void;
};

/**
 * A virtualized table built on top of `@tanstack/react-virtual`.
 */
export const Table: <T>(
  props: TableProps<T> & { ref?: React.RefObject<TableRef | null> }
) => JSX.Element;
