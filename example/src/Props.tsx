import React from "react";
import { Table as BaseTable, ColumnProps } from "react-fluid-table";
import { Divider, Header, Icon, List } from "semantic-ui-react";
import styled from "styled-components";
import ColumnPropsTable from "./ColumnProps";
import { Snippet } from "./Snippet";
import { InlineCode } from "./components/library/InlineCode";

const Container = styled.div`
  padding: 1em;
  background-color: white;
  height: 100%;
  overflow: auto;
`;

const Table = styled(BaseTable)`
  border: 1px solid #ececec;

  .react-fluid-table-header {
    background-color: #282a36;
  }

  .cell,
  .header-cell {
    border-right: 1px solid #ececec;

    :last-child {
      border-right: none;
    }
  }

  .header-cell-text {
    color: #ff79c5;
  }
`;

const Item = styled(List.Item)`
  width: 100%;
`;

interface PropData {
  prop: string;
  type: string;
  description: string;
  required?: boolean;
  content?: () => React.ReactNode;
  expandedType?: () => React.ReactNode;
  default?: string | number;
}

const columns: ColumnProps<PropData>[] = [
  {
    key: "prop",
    header: "Prop",
    width: 170,
    content: ({ row }: { row: PropData }) => <code>{row.prop}</code>
  },
  {
    key: "type",
    header: "Type",
    minWidth: 120,
    maxWidth: 170,
    content: ({ row }: { row: PropData }) => <code>{row.type}</code>
  },
  {
    key: "required",
    header: "Required",
    width: 100,
    content: ({ row }: { row: PropData }) => (
      <Icon
        name={`${row.required ? "check" : "times"} circle`}
        color={row.required ? "green" : "grey"}
      />
    )
  },
  {
    key: "default",
    header: "Default",
    width: 100,
    content: ({ row }: { row: PropData }) => (row.default ? <code>{row.default}</code> : null)
  },
  {
    key: "description",
    header: "Description",
    content: ({ row }: { row: PropData }) => row.description
  }
];

const data: PropData[] = [
  {
    prop: "data",
    type: "object[]",
    required: true,
    description: "The array of items that are going to be displayed.",
    content: () => (
      <p>
        This is an array of objects that you want to display in a table. The items in this list must
        be defined and cannot be <InlineCode>null</InlineCode>, <InlineCode>undefined</InlineCode>,
        or any other primitives or classes.
      </p>
    )
  },
  {
    prop: "columns",
    type: "object[]",
    required: true,
    description: "The list of columns",
    content: () => (
      <>
        <p>Each column object must satisfy the conditions layed out in the table below.</p>
        <ColumnPropsTable />
      </>
    )
  },
  {
    prop: "className",
    type: "string",
    description: "additional classNames"
  },
  {
    prop: "tableHeight",
    type: "number",
    description:
      "The height of the table in pixels. If no height is specified, this will try to fill the height of the parent. If the parent node does not have a height specified, a height for the table will be calculated based on the default header height and the rowHeight or the defaultRowHeight (37)."
  },
  {
    prop: "minTableHeight",
    type: "number",
    description: "The min height of the table in pixels."
  },
  {
    prop: "maxTableHeight",
    type: "number",
    description:
      "The max height of the table in pixels. If tableHeight is specified, this is ignored."
  },
  {
    prop: "tableWidth",
    type: "number",
    description: "The width of the table in pixels"
  },
  {
    prop: "rowHeight",
    type: "number",
    description:
      "This is a fixed height of each row. Subcomponents will not be affected by this value"
  },
  {
    prop: "headerHeight",
    type: "number",
    description: "This is an optional fixed height of the header"
  },
  {
    prop: "footerHeight",
    type: "number",
    description: "This is an optional fixed height of the footer"
  },
  {
    prop: "minColumnWidth",
    type: "number",
    description: "The default column width for the entire table",
    default: 80
  },
  {
    prop: "sortColumn",
    type: "string",
    description: "The column that is sorted by default (can be controlled)"
  },
  {
    prop: "sortDirection",
    type: '"ASC" | "DESC" | null',
    description: "The direction of the sorted column (can be controlled)"
  },
  {
    prop: "onSort",
    type: "function",
    expandedType: () => <code>{"function(col: string, dir: string) => void"}</code>,
    description: "The callback function when a sortable column is clicked",
    content: () => (
      <div>
        The arguments <InlineCode>col</InlineCode> and <InlineCode>dir</InlineCode> are the clicked
        column and the new sortDirection. These values are <code>null</code> after a descending
        column is clicked.
      </div>
    )
  },
  {
    prop: "borders",
    type: "boolean",
    description: "Controls whether or not there is a bottom border for each row",
    default: "false"
  },
  {
    prop: "tableStyle",
    type: "object",
    description: "Add custom css styles to the outer table element"
  },
  {
    prop: "headerStyle",
    type: "object",
    description: "Add custom css styles to the table header"
  },
  {
    prop: "headerClassname",
    type: "string",
    description: "Add custom css className to the table header"
  },
  {
    prop: "rowStyle",
    type: "object | (index: number) => object",
    description:
      "Add custom css styles to each row element. One can also pass in a function that takes in the row number in order to provide custom styling for particular rows."
  },
  {
    prop: "rowClassname",
    type: "string | (index: number) => string",
    description:
      "Add custom css className to each row element. One can also pass in a function that takes in the row number in order to provide custom styling for particular rows."
  },
  {
    prop: "subComponent",
    type: "Element",
    description: "The element that is rendered on a table with row expansion"
  },
  {
    prop: "onRowClick",
    type: "(e: Event, { index: number }) => void",
    description: "optional click handler for the rows in the table"
  },
  {
    prop: "rowRenderer",
    type: "(props: CellElement) => Element",
    description:
      "A custom element used to wrap an entire row. This provides another way of customizing each row of the table"
  },
  {
    prop: "footerComponent",
    type: "(props: FooterProps) => Element",
    description: "You can provide an optional footer"
  },
  {
    prop: "footerStyle",
    type: "object",
    description: "Add custom css styles to the table footer"
  },
  {
    prop: "footerClassname",
    type: "string",
    description: "Add custom css className to the table footer"
  },
  {
    prop: "stickyFooter",
    type: "boolean",
    description:
      "Controls whether or not the footer is sticky. This does nothing if footerComponent is not specified.",
    default: "false"
  }
];

const required = data.filter(i => i.required);
const optional = data.filter(i => !i.required);

const headerSnippet = `
const CustomHeader = ({ name, ...props}) => {
  // props contains at least: style, onClick, sortDirection
  return (
    <div {...props}>{name}</div>
  );
}

const columns = [{
  key: "ID",
  width: 100,
  header: props => <CustomHeader name="ID" {...props} />
}];

const Example = () => <Table data={data} columns={columns} />;
`;

const cellSnippet = `
const Contact = ({ row, index, style, clearSizeCache }) => {
  const mounted = useRef(false);
  const [showInfo, setShowInfo] = useState(false);

  const label = \`\${showInfo ? "hide" : "show"} contact info\`;
  const options = [
    { key: "email", value: row.email },
    { key: "address", value: row.address }
  ];

  const onChange = () => setShowInfo(!showInfo);

  // after something that might cause the row height to change,
  // you should call this function to get the new row height.
  useLayoutEffect(() => {
    if (mounted.current) {
      clearSizeCache(index, true);
    }
    mounted.current = true;
  }, [showInfo]);

  return <Accordion style={style} label={label} options={options} onChange={onChange} />;
};

const columns = [{
  key: "contact",
  width: 100,
  header: "Contact",
  content: Contact
}];

const Example = () => <Table data={data} columns={columns} />;
`;

const expanderSnippet = `
const Expander = ({ isExpanded, onClick }) => {
  const icon = \`chevron \${isExpanded ? "up" : "down"}\`;
  return <Icon name={icon} onClick={onClick} />
};

const columns = [
  { key: "", width: 40, expander: Expander },
  { key: "firstName", width: 100, header: "First" }
];

const Example = () => <Table data={data} columns={columns} subComponent={SubComponent} />;
`;

const Props = () => (
  <Container>
    <Header size="large">
      <Icon name="react" color="blue" />
      <Header.Content>
        <code>{"<Table>"}</code> Props
        <Header.Subheader>
          All the props for the <code>{"<Table>"}</code> component
        </Header.Subheader>
      </Header.Content>
    </Header>
    <Table borders data={data} columns={columns} tableHeight={500} />
    <Divider section />
    <Header dividing color="red">
      Required Props
    </Header>
    <List divided>
      {required.map(d => (
        <Item key={d.prop}>
          <List.Header>
            <code>{d.prop}</code>: <code>{d.type}</code>
          </List.Header>
          {!d.content ? null : typeof d.content === "string" ? d.content : d.content()}
        </Item>
      ))}
    </List>
    <Header dividing size="small" color="grey">
      HeaderElement, CellElement, and ExpanderElement
    </Header>
    <List divided>
      <Item>
        <List.Header>
          <code>HeaderElement</code>:{" "}
          <code>
            {
              "({ style: object, onClick: Function, sortDirection: string | null }) => React.Element"
            }
          </code>
        </List.Header>
        <List.Content>
          The HeaderElement is an element that takes in props that contains a style, onclick, and
          sortDirection. See below for an example:
        </List.Content>
        <Snippet copy={false} code={headerSnippet} />
      </Item>
      <Item>
        <List.Header>
          <code>CellElement</code>:{" "}
          <code>
            {
              "({ row: object, index: number, style?: React.CSSProperties, clearSizeCache: (index: number, forceUpdate?: boolean = false) => void }) => React.Element"
            }
          </code>
        </List.Header>
        <List.Content>
          The CellElement is an element that takes in props that contains the row object itself, the
          index in the data array, and a function to reset the rowHeight (if needed). See below for
          an example:
        </List.Content>
        <Snippet copy={false} code={cellSnippet} />
      </Item>
      <Item>
        <List.Header>
          <code>ExpanderElement</code>:{" "}
          <code>{"({ isExpanded: boolean, onClick: () => void }) => React.Element"}</code>
        </List.Header>
        <List.Content>
          The ExpandedElement is an element that takes in props that contains whether or not the row
          is expanded, as well as a function to toggle the row expansion. See below for an example:
        </List.Content>
        <Snippet copy={false} code={expanderSnippet} />
      </Item>
    </List>
    <Header dividing size="small" color="grey">
      Optional Props
    </Header>
    <List divided>
      {optional.map(d => (
        <Item key={d.prop}>
          <List.Header>
            <code>{d.prop}</code>: {d.expandedType ? d.expandedType() : <code>{d.type}</code>}
          </List.Header>
          {!d.content ? (
            <p>{d.description}</p>
          ) : typeof d.content === "string" ? (
            d.content
          ) : (
            d.content()
          )}
        </Item>
      ))}
    </List>
    <Header dividing size="small" color="grey">
      Interfaces
    </Header>
    <Snippet
      code={`import { CSSProperties, ForwardedRef, ReactNode } from "react";

type SortDirection = "ASC" | "DESC" | null;

interface ExpanderProps {
  /**
   * whether or not the row is expanded
   */
  isExpanded: boolean;
  /**
   * handler for clicking the expansion button
   */
  onClick: (event?: React.MouseEvent<Element, MouseEvent>) => void;
  /**
   * required style for the expander
   */
  style: CSSProperties;
}

interface CellProps<T> {
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
  clearSizeCache: (dataIndex: number, forceUpdate?: boolean) => void;
  /**
   * optional custom styles for each cell
   */
  style?: CSSProperties;
}

interface HeaderProps {
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
}

interface RowRenderProps<T> {
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
}

interface SubComponentProps<T> {
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
  clearSizeCache: (dataIndex: number, forceUpdate?: boolean) => void;
}

interface FooterProps<T> {
  /**
   * exposes the widths of each column to the footer
   */
  widths: number[];
  rows: T[];
}

interface FooterCellProps<T> {
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
}

interface ColumnProps<T> {
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
   * Marks this cell as an expansion cell. The style is pre-determined, and does the
   * functionalitty of collapsing/expanding a row.
   */
  expander?: boolean | ((props: ExpanderProps) => ReactNode);
  /**
   * Used to render custom content inside of a cell. This is useful for rendering different
   * things inside of the react-fluid-table cell container.
   */
  content?: string | number | ((props: CellProps<T>) => ReactNode);
  /**
   * An advanced feature, this is used to render an entire cell, including the cell container.
   * The \`content\` prop is ignored if this property is enabled.
   */
  cell?: (props: CellProps<T>) => JSX.Element;
  /**
   * specifies whether or not to display a footer cell
   */
  footer?: (props: FooterCellProps<T>) => ReactNode;
}

interface TableRef {
  scrollTo: (scrollOffset: number) => void;
  scrollToItem: (index: number, align?: string) => void;
}

interface TableProps<T> {
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
   * Specify the minimum width of any column. Default: \`80\`.
   */
  minColumnWidth?: number;
  /**
   * The fixed height of each row in pixels. If \`subComponent\` is specified,
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
   * Enable or disable row borders. Default: \`false\`.
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
   * \`footerComponent\` is specified.
   */
  stickyFooter?: boolean;
  /**
   * optionally add a footer. NOTE: this overrides the \`footer\` prop of a
   * column, so use wisely. This gives the user more control over how the
   * footer is rendered. Can return any value.
   */
  footerComponent?: (props: FooterProps<T>) => ReactNode;
  /**
   * When a column has \`expander\`, this component will be rendered under the row.
   */
  subComponent?: (props: SubComponentProps<T>) => ReactNode;
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
}
`}
    />
  </Container>
);

export default Props;
