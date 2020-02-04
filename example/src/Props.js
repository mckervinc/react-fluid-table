import React from "react";
import styled from "styled-components";
import { Table as BaseTable } from "react-fluid-table";
import { Icon, Divider, Header } from "semantic-ui-react";

const Container = styled.div`
  padding: 1em;
  background-color: white;
  height: 100%;
  overflow: auto;
`;

const Table = styled(BaseTable)`
  border-bottom: none;
  border-right: none;
  border-left: none;
  background-color: transparent;

  .react-fluid-table-header {
    background-color: #f3c9ef;
  }

  .cell,
  .header-cell {
    border-right: 1px solid #ececec;

    :last-child {
      border-right: none;
    }
  }
`;

const columns = [
  {
    key: "prop",
    header: "Prop",
    width: 140,
    cell: row => <code>{row.prop}</code>
  },
  {
    key: "type",
    header: "Type",
    width: 120,
    cell: row => <code>{row.type}</code>
  },
  {
    key: "required",
    header: "Required",
    width: 100,
    cell: row => (
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
    cell: row => (row.default ? <code>{row.default}</code> : null)
  },
  {
    key: "description",
    header: "Description"
  }
];

const data = [
  {
    prop: "data",
    type: "any[]",
    required: true,
    description: "The array of items that are going to be displayed."
  },
  {
    prop: "columns",
    type: "any[]",
    required: true,
    description: "The list of columns"
  },
  {
    prop: "className",
    type: "string",
    description: "optional className"
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
    description: "The callback function when a sortable column is clicked"
  },
  {
    prop: "subComponent",
    type: "Element",
    description: "The element that is rendered on a table with row expansion"
  }
];

const Props = () => (
  <Container>
    <Table data={data} columns={columns} tableHeight={500} />
    <Divider section />
    <Header dividing color="red">
      Required Props
    </Header>
    <Header size="small">
      <code>data</code>
    </Header>
  </Container>
);

export default Props;
