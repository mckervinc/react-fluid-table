import _ from "lodash";
import { useState } from "react";
import { ColumnProps, SortDirection, Table } from "react-fluid-table";
import { TestData, testData } from "../data";

const columns: ColumnProps<TestData>[] = [
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

  const onSort = (col: string | null, dir: SortDirection) => {
    if (!col || !dir) {
      setData(testData);
    } else {
      const direction = dir === "ASC" ? "asc" : "desc";
      setData(_.orderBy(data, [col], [direction]));
    }
  };

  return (
    <Table
      borders
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

const columns: ColumnProps<TestData>[] = [
  { key: "id", header: "ID", sortable: true, width: 50 },
  { key: "firstName", header: "First", sortable: true, width: 120 },
  { key: "lastName", header: "Last", sortable: true, width: 120 },
  { key: "email", header: "Email", sortable: true, width: 250 }
];

const Example = () => {
  const [data, setData] = useState(_.orderBy(testData, ['firstName'], ['asc']));

  const onSort = (col: string | null, dir: SortDirection) => {
    if (!col || !dir) {
      setData(testData);
    } else {
      const direction = dir === "ASC" ? "asc" : "desc";
      setData(_.orderBy(data, [col], [direction]));
    }
  };

  return (
    <Table
      borders
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
