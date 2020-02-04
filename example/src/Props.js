import React from "react";
import styled from "styled-components";
import { Table as BaseTable } from "react-fluid-table";
import { Icon } from "semantic-ui-react";

const Wrapper = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
`;

const Container = styled.div`
  position: relative;
  background-color: #fff;
  height: 250px;
  padding: 1em;
  -webkit-box-shadow: 0px -4px 5px 0px rgba(176, 176, 176, 0.75);
  -moz-box-shadow: 0px -4px 5px 0px rgba(176, 176, 176, 0.75);
  box-shadow: 0px -4px 5px 0px rgba(176, 176, 176, 0.75);
`;

const Table = styled(BaseTable)`
  border-bottom: none;
  border-right: none;
  border-left: none;

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
    width: 120,
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
  cell: row => row.default ? <code>{row.default}</code> : null
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
  }
];

const Props = () => (
  <Wrapper>
    <Container>
      <Table data={data} columns={columns} />
    </Container>
  </Wrapper>
);

export default Props;
