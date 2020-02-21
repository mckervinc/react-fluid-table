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
    key: "words",
    header: "Words",
    width: 100
  },
  {
    key: "sentence",
    header: "Sentences"
  },
  {
    key: "lorem",
    header: "Lorem",
    cell: () => "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  }
];

const Example5 = () => <Table data={testData} columns={columns} tableHeight={400} estimatedRowHeight={150}/>;

const Source = `
const data = [/* ... */];

const columns = [
  { key: "id", header: "ID", width: 50 },
  { key: "words", header: "Words", width: 100 },
  { key: "sentence", header: "Sentences" },
  { key: "lorem", header: "Lorem", cell: () => "Lorem ipsum..." }
];

const Example = () => (
  <Table
    data={data}
    columns={columns}
    tableHeight={400}
    estimatedRowHeight={150}
  />
);
`.trim()

export { Example5, Source };
