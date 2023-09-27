import _ from "lodash";
import { useState } from "react";
import { SortDirection, Table } from "react-fluid-table";
import { testData } from "../data";

const columns = [
  {
    key: "id",
    header: "ID",
    sortable: true,
    width: 50
  },
  {
    key: "firstName",
    header: "First",
    sortable: true,
    width: 120
  },
  {
    key: "lastName",
    header: "Last",
    sortable: true,
    width: 120
  },
  {
    key: "email",
    header: "Email",
    sortable: true,
    width: 250
  }
];

const Example2 = () => {
  const [data, setData] = useState(_.orderBy(testData, ["firstName"], ["asc"]));

  const onSort = (col: string | null, dir: SortDirection | null) => {
    if (!col || !dir) {
      setData(testData);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setData(_.orderBy(data, [col], [dir.toLowerCase() as any]));
    }
  };

  return (
    <Table
      data={data}
      columns={columns}
      itemKey={row => row.id}
      rowHeight={35}
      tableHeight={400}
      onSort={onSort}
      sortColumn="firstName"
      sortDirection="ASC"
    />
  );
};

const Source = `
const testData = [/* ... */];

const columns = [
  { key: "id", header: "ID", sortable: true, width: 50 },
  { key: "firstName", header: "First", sortable: true, width: 120 },
  { key: "lastName", header: "Last", sortable: true, width: 120 },
  { key: "email", header: "Email", sortable: true, width: 250 }
];

const Example = () => {
  const [data, setData] = useState(_.orderBy(testData, ['firstName'], ['asc']));

  const onSort = (col, dir) => {
    setData(!col || !dir ? testData : _.orderBy(data, [col], [dir.toLowerCase()]));
  };

  return (
    <Table
      data={data}
      columns={columns}
      itemKey={row => row.id}
      rowHeight={35}
      tableHeight={400}
      onSort={onSort}
      sortColumn="firstName"
      sortDirection="ASC"
    />
  );
};
`;

export { Example2, Source };
