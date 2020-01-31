import React from "react";
import _ from "lodash";
import faker from "faker";
import styled from "styled-components";

import { Table } from "react-fluid-table";

const TextStyle = styled.div`
  font-family: Helvetica;
  font-size: 14px;
  font-weight: 300;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #000;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SubStyle = styled.div`
  height: 76px;
  background-color: green;
`;

const SubComponent = () => <SubStyle>SubComponent content</SubStyle>;

const data = _.range(1, 3100).map(i => ({
  id: i,
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email()
}));

const columns = [
  {
    key: "",
    width: 50,
    expander: true
  },
  {
    key: "firstName",
    name: "First",
    width: 120,
    cell: row => <TextStyle>{row.firstName}</TextStyle>
  },
  {
    key: "lastName",
    name: "Last",
    width: 120,
    cell: row => <TextStyle>{row.lastName}</TextStyle>
  },
  {
    key: "email",
    name: "Email",
    width: 250,
    cell: row => <TextStyle>{row.email}</TextStyle>
  },
  {
    key: "streetAddress",
    name: "Street",
    cell: () => <input />
  }
];

const App = () => {
  return (
    <Table
      data={data}
      columns={columns}
      tableHeight={400}
      rowCount={data.length}
      itemKey={row => row.id}
      subComponent={SubComponent}
    />
  );
};
export default App;
