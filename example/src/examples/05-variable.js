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
    header: "Lorem"
  }
];

const Example5 = () => <Table data={testData} columns={columns} tableHeight={400} />;

const Source = `
const data = [/* ... */];

const columns = [
  { key: "id", header: "ID", width: 50 },
  { key: "words", header: "Words", width: 100 },
  { key: "sentence", header: "Sentences" },
  { key: "lorem", header: "Lorem" }
];

const Example = () => (
  <Table
    data={data}
    columns={columns}
    tableHeight={400}
  />
);
`

export { Example5, Source };
