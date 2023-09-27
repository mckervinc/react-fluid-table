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

const Example1 = () => <Table data={testData} columns={columns} />;

const Source = `
const data = _.range(3000).map(i => ({
  id: i + 1,
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email()
}));

const columns = [
  { key: "id", header: "ID", width: 50 },
  { key: "firstName", header: "First", width: 120 },
  { key: "lastName", header: "Last", width: 120 },
  { key: "email", header: "Email", width: 250 }
];

const Example = () => <Table data={data} columns={columns} />;
`;

export { Example1, Source };
