import React from "react";
import { Table } from "react-fluid-table";
import { testData } from "../data";

const columns = [
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

const Name = "Basic Table";

const Example1 = () => <Table data={testData} columns={columns} tableHeight={400} rowHeight={35} />;

export { Name, Example1 };
