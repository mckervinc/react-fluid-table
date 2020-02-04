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

const SubComponent = ({ row }) => <SubComponentStyle>{`Row ${row.id} is expanded`}</SubComponentStyle>

const Name = "Table with Subcomponent";

const Example3 = () => (
  <Table
    data={testData}
    columns={columns}
    tableHeight={400}
    rowHeight={35}
    subComponent={SubComponent}
  />
);

export { Name, Example3 };
