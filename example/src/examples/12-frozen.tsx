import { ColumnProps, Table } from "react-fluid-table";
import { TestData, testData } from "../data";

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

const Example12 = () => <Table data={testData} columns={columns} tableWidth={400} />;

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

export { Example12, Source };
