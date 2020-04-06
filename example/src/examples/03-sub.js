import React from "react";
import { Table } from "react-fluid-table";
import styled from "styled-components";
import { testData } from "../data";

const columns = [
  {
    key: "",
    width: 40,
    expander: true
  },
  {
    key: "id",
    header: "ID",
    width: 50
  },
  {
    key: "firstName",
    header: "First",
    width: 120
  },
  {
    key: "lastName",
    header: "Last",
    width: 120
  },
  {
    key: "email",
    header: "Email",
    width: 250
  }
];

const SubComponentStyle = styled.div`
  height: 100px;
  background-color: lightblue;
`;

const SubComponent = ({ row }) => (
  <SubComponentStyle>{`Row ${row.id} is expanded`}</SubComponentStyle>
);

const Example3 = () => (
  <Table
    data={testData}
    columns={columns}
    tableHeight={400}
    rowHeight={35}
    subComponent={SubComponent}
  />
);

const Source = `
const data = [/* ... */];

const columns = [
  { key: "", width: 40, expander: true },
  { key: "id", header: "ID", width: 50 },
  { key: "firstName", header: "First", width: 120 },
  { key: "lastName", header: "Last", width: 120 },
  { key: "email", header: "Email", width: 250 }
];

const SubComponent = ({ row }) => (
  <SubComponentStyle>{\`Row \${row.id} is expanded\`}</SubComponentStyle>
);

const Example = () => (
  <Table
    data={data}
    columns={columns}
    subComponent={SubComponent}
    rowHeight={35}
    tableHeight={400}
  />
);
`;

export { Example3, Source };
