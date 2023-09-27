import _ from "lodash";
import React, { useState } from "react";
import { ColumnProps, HeaderProps, SortDirection, Table } from "react-fluid-table";
import { Icon } from "semantic-ui-react";
import styled from "styled-components";
import { TestData, testData } from "../data";

const Arrow = styled(Icon)`
  color: #50f97a;
  margin-left: 0.25rem !important;
`;

interface HeaderCellProps extends HeaderProps {
  name?: string;
}

const HeaderCell = ({ name, sortDirection, style, onClick }: HeaderCellProps) => {
  const icon = !sortDirection ? null : (
    <Arrow size="small" name={`chevron ${sortDirection === "ASC" ? "up" : "down"}`} />
  );

  const cellStyle = {
    background: sortDirection ? "rgb(39, 40, 34)" : undefined,
    ...style
  };

  const textStyle = { color: sortDirection ? "rgb(249, 38, 114)" : "black" };

  return (
    <div className="header-cell" onClick={onClick} style={cellStyle}>
      <div className="header-cell-text" style={textStyle}>
        {name}
      </div>
      {icon}
    </div>
  );
};

const columns: ColumnProps<TestData>[] = [
  { key: "id", header: "ID", sortable: true, width: 50 },
  { key: "firstName", header: "First", sortable: true, width: 120 },
  { key: "lastName", header: "Last", sortable: true, width: 120 },
  { key: "email", header: "Email", sortable: true, width: 250 }
].map(c => ({
  ...c,
  header: props => <HeaderCell name={c.header} {...props} />
}));

const Example8 = () => {
  const [data, setData] = useState(_.orderBy(testData, ["firstName"], ["asc"]));

  const onSort = (col: string | null, dir: SortDirection) => {
    if (!col || !dir) {
      setData(testData);
    } else {
      const direction = dir === "ASC" ? "asc" : "desc";
      setData(_.orderBy(data, [col], [direction]));
    }
  };

  const rowStyle = (index: number): React.CSSProperties => ({
    backgroundColor: index % 2 === 0 ? "#33be54" : "#21ba49"
  });

  return (
    <Table
      data={data}
      columns={columns}
      tableHeight={400}
      rowHeight={35}
      onSort={onSort}
      sortColumn="firstName"
      sortDirection="ASC"
      rowStyle={rowStyle}
      tableStyle={{ backgroundColor: "#33be54" }}
      headerStyle={{ backgroundColor: "#1e9f3f" }}
    />
  );
};

const Source = `
/**
 * \`props\` contains \`style\`, \`onClick\`, and \`sortDirection.\`
*/
const HeaderCell = ({ name, sortDirection, style, onClick }) => {
  const icon = !sortDirection ? null : (
    <Arrow size="small" name={\`chevron \${sortDirection === "ASC" ? "up" : "down"}\`} />
  );

  const cellStyle = {
    background: !!sortDirection ? "rgb(39, 40, 34)" : undefined,
    ...style
  };

  const textStyle = { color: !!sortDirection ? "rgb(249, 38, 114)" : "black" };

  return (
    <div className="header-cell" onClick={onClick} style={cellStyle}>
      <div className="header-cell-text" style={textStyle}>
        {name}
      </div>
      {icon}
    </div>
  );
};

const columns: ColumnProps<TestData>[] = [
  { key: "id", header: "ID", sortable: true, width: 50 },
  { key: "firstName", header: "First", sortable: true, width: 120 },
  { key: "lastName", header: "Last", sortable: true, width: 120 },
  { key: "email", header: "Email", sortable: true, width: 250 }
].map(c => ({
  ...c,
  header: props => <HeaderCell name={c.header} {...props} />
}));

const Example = () => {
  const [data, setData] = useState(_.orderBy(testData, ["firstName"], ["asc"]));

  const onSort = (col, dir) => {
    if (!col || !dir) {
      setData(testData);
    } else {
      setData(_.orderBy(data, [col], [dir.toLowerCase()]));
    }
  };

  const rowStyle = index => ({
    backgroundColor: index % 2 === 0 ? "#33be54" : "#21ba49"
  });

  return (
    <Table
      data={data}
      columns={columns}
      tableHeight={400}
      rowHeight={35}
      onSort={onSort}
      sortColumn="firstName"
      sortDirection="ASC"
      rowStyle={rowStyle}
      tableStyle={{ backgroundColor: "#33be54" }}
      headerStyle={{ backgroundColor: "#1e9f3f" }}
    />
  );
};
`;

export { Example8, Source };
