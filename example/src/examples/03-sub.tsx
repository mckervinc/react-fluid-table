import _ from "lodash";
import { useState } from "react";
import { ColumnProps, SortDirection, Table } from "react-fluid-table";
import styled from "styled-components";
import { TestData, testData } from "../data";

const columns: ColumnProps<TestData>[] = [
  {
    key: "",
    width: 40,
    expander: true
  },
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

const Custom = styled.div`
  height: 100px;
  background-color: lightblue;
`;

const Example3 = () => {
  const [data, setData] = useState(testData);

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
      tableHeight={400}
      rowHeight={35}
      itemKey={row => row.id}
      onSort={onSort}
      subComponent={({ row }) => <Custom>{`Row ${row.id} is expanded`}</Custom>}
      sortColumn="id"
      sortDirection="ASC"
    />
  );
};

const Source = `
const testData = [/* ... */];

const columns: ColumnProps<TestData>[] = [
  { key: "", width: 40, expander: true },
  { key: "id", header: "ID", width: 50, sortable: true, },
  { key: "firstName", header: "First", width: 120, sortable: true, },
  { key: "lastName", header: "Last", width: 120, sortable: true, },
  { key: "email", header: "Email", width: 250, sortable: true, }
];

const Example = () => {
  const [data, setData] = useState(testData);

  const onSort = (col, dir) => {
    if (!col || !dir) {
      setData(testData);
    } else {
      setData(_.orderBy(data, [col], [dir.toLowerCase()]));
    }
  };

  return (
    <Table
      borders
      data={data}
      columns={columns}
      tableHeight={400}
      rowHeight={35}
      itemKey={row => row.id}
      onSort={onSort}
      subComponent={({ row }) => <Custom>{\`Row \${row.id} is expanded\`}</Custom>}
      sortColumn="id"
      sortDirection="ASC"
    />
  );
};
`;

export { Example3, Source };
