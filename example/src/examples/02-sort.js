import React, { useState } from "react";
import { Table } from "react-fluid-table";
import _ from "lodash";
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

  const onSort = (col, dir) => {
    if (!col || !dir) {
      setData(testData);
    } else {
      setData(_.orderBy(data, [col], [dir.toLowerCase()]));
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
