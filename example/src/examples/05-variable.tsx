import { ColumnProps, Table } from "react-fluid-table";
import { TestData, testData } from "../data";
import { useSource, useTitle } from "@/hooks/useTitle";

const columns: ColumnProps<TestData>[] = [
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

const Source = `
const data = [/* ... */];

const columns: ColumnProps<TestData>[] = [
  { key: "id", header: "ID", width: 50 },
  { key: "words", header: "Words", width: 100 },
  { key: "sentence", header: "Sentences" },
  { key: "lorem", header: "Lorem" }
];

const Example = () => (
  <Table
    borders
    data={data}
    columns={columns}
    tableHeight={400}
  />
);
`;

const Example5 = () => {
  useTitle("Variable Row Size");
  useSource(Source);
  return <Table borders data={testData} columns={columns} tableHeight={400} />;
};

export { Example5 };
