import { ColumnProps, Table } from "react-fluid-table";
import { TestData, testData } from "../data";
import { useSource, useTitle } from "@/hooks/useTitle";

const columns: ColumnProps<TestData>[] = [
  {
    key: "id",
    header: "ID",
    width: 50,
    frozen: true
  },
  {
    key: "firstName",
    header: "First",
    width: 120,
    frozen: true
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

const Source = `
const data = [/* ... */];

const columns: ColumnProps<TestData>[] = [
  { key: "id", header: "ID", width: 50, frozen: true },
  { key: "firstName", header: "First", width: 120, frozen: true },
  { key: "lastName", header: "Last", width: 120 },
  { key: "email", header: "Email", width: 250 }
];

const Example = () => <Table data={data} columns={columns} tableWidth={400} />;
`;

const Example12 = () => {
  // hooks
  useTitle("Frozen");
  useSource(Source);

  return <Table data={testData} columns={columns} tableWidth={400} />;
};

export { Example12, Source };
