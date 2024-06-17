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

const Source = `
type TestData = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};

const data: TestData[] = _.range(3000).map(i => ({
  id: i + 1,
  firstName: randFirstName(),
  lastName: randLastName(),
  email: randEmail()
}));

const columns: ColumnProps<TestData>[] = [
  { key: "id", header: "ID", width: 50 },
  { key: "firstName", header: "First", width: 120 },
  { key: "lastName", header: "Last", width: 120 },
  { key: "email", header: "Email", width: 250 }
];

const Example = () => <Table data={data} columns={columns} />;
`;

const Example1 = () => {
  useTitle("Basic Table");
  useSource(Source);
  return <Table data={testData} columns={columns} />;
};

export { Example1 };
