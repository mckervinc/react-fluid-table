import React from "react";
import styled from "styled-components";
import { Table as BaseTable } from "react-fluid-table";
import { Icon, Divider, Header, List } from "semantic-ui-react";
import { InlineCode } from "./shared/styles";
import ColumnPropsTable from "./props/ColumnProps";
import { Snippet } from "./shared/Snippet";

const Container = styled.div`
  padding: 1em;
  background-color: white;
  height: 100%;
  overflow: auto;
`;

const Table = styled(BaseTable)`
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

const columns = [
  {
    key: "prop",
    header: "Prop",
    width: 170,
    content: ({ row }) => <code>{row.prop}</code>
  },
  {
    key: "type",
    header: "Type",
    width: 120,
    content: ({ row }) => <code>{row.type}</code>
  },
  {
    key: "required",
    header: "Required",
    width: 100,
    content: ({ row }) => (
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
    content: ({ row }) => (row.default ? <code>{row.default}</code> : null)
  },
  {
    key: "description",
    header: "Description",
    content: ({ row }) => row.description
  }
];

const data = [
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
    type: 'string | "ASC" | "DESC" ',
    description: "The direction of the sorted column (can be controlled)"
  },
  {
    prop: "onSort",
    type: "function",
    expandedType: () => <code>function(col: string, dir: string) => void</code>,
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
    default: "true"
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
    prop: "rowStyle",
    type: "object | (index: number) => object",
    description:
      "Add custom css styles to each row element. One can also pass in a function that takes in the row number in order to provide custom styling for particular rows."
  },
  {
    prop: "subComponent",
    type: "Element",
    description: "The element that is rendered on a table with row expansion"
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

  return <Accordion label={label} options={options} onChange={onChange} />;
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
    <Table data={data} columns={columns} tableHeight={500} />
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
        <Snippet copy={false} edit={false} code={headerSnippet} />
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
        <Snippet copy={false} edit={false} code={cellSnippet} />
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
        <Snippet copy={false} edit={false} code={expanderSnippet} />
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
  </Container>
);

export default Props;
