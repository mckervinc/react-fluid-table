import React from "react";
import styled from "styled-components";
import { Table as BaseTable } from "react-fluid-table";
import { Icon, Divider, Header, List } from "semantic-ui-react";
import { InlineCode } from "./shared/styles";
import ColumnPropsTable from "./tables/ColumnProps";

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
    cell: ({ row }) => <code>{row.prop}</code>
  },
  {
    key: "type",
    header: "Type",
    width: 120,
    cell: ({ row }) => <code>{row.type}</code>
  },
  {
    key: "required",
    header: "Required",
    width: 100,
    cell: ({ row }) => (
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
    cell: ({ row }) => (row.default ? <code>{row.default}</code> : null)
  },
  {
    key: "description",
    header: "Description",
    cell: ({ row }) => row.description
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
    description: "The height of the table in pixels"
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
    prop: "estimatedRowHeight",
    type: "number",
    description: "The default height of the row. Rows will have this height while scrolling",
    default: 37
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
    prop: "subComponent",
    type: "Element",
    description: "The element that is rendered on a table with row expansion"
  }
];

const required = data.filter(i => i.required);
const optional = data.filter(i => !i.required);

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
