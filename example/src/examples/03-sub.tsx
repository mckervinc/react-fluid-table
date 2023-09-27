import _ from "lodash";
import { useState } from "react";
import { SortDirection, SubComponentProps, Table } from "react-fluid-table";
import styled from "styled-components";
import { TestData, testData } from "../data";

const columns = [
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

const SubComponentStyle = styled.div`
  height: 100px;
  background-color: lightblue;
`;

const SubComponent = ({ row }: SubComponentProps<TestData>) => (
  <SubComponentStyle>{`Row ${row.id} is expanded`}</SubComponentStyle>
);

const Example3 = () => {
  const [data, setData] = useState(testData);

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
      tableHeight={400}
      rowHeight={35}
      itemKey={row => row.id}
      onSort={onSort}
      subComponent={SubComponent}
      sortColumn="id"
      sortDirection="ASC"
    />
  );
};

const Source = `
const testData = [/* ... */];

const columns = [
  { key: "", width: 40, expander: true },
  { key: "id", header: "ID", width: 50, sortable: true, },
  { key: "firstName", header: "First", width: 120, sortable: true, },
  { key: "lastName", header: "Last", width: 120, sortable: true, },
  { key: "email", header: "Email", width: 250, sortable: true, }
];

const SubComponent = ({ row }) => (
  <SubComponentStyle>{\`Row \${row.id} is expanded\`}</SubComponentStyle>
);

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
      data={data}
      columns={columns}
      tableHeight={400}
      rowHeight={35}
      itemKey={row => row.id}
      onSort={onSort}
      subComponent={SubComponent}
      sortColumn="id"
      sortDirection="ASC"
    />
  );
};
`;

export { Example3, Source };
