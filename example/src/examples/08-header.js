import React, { useState } from "react";
import _ from "lodash";
import styled from "styled-components";
import { Icon } from "semantic-ui-react";
import { Table } from "react-fluid-table";
import { testData } from "../data";

// NOTE: className header-cell is NOT required
const HeaderCell = styled.div.attrs(() => ({
  className: "header-cell"
}))`
  background: ${props => (props.sortDirection ? "rgb(39, 40, 34)" : undefined)};
`;

// NOTE: className header-cell-text is NOT required
const HeaderCellText = styled.div.attrs(() => ({
  className: "header-cell-text"
}))`
  color: ${props => (props.isSorted ? "rgb(249, 38, 114)" : "black")};
`;

const StyledTable = styled(Table)`
  .react-fluid-table-header {
    background-color: #bceb82;
  }
`;

const Arrow = styled(Icon)`
  color: #50f97a;
  margin-left: 0.25rem !important;
`;

const CustomHeader = ({ name, ...rest }) => {
  const { sortDirection } = rest;
  const icon = !sortDirection ? null : (
    <Arrow size="small" name={`chevron ${sortDirection === "ASC" ? "up" : "down"}`} />
  );
  return (
    <HeaderCell {...rest}>
      <HeaderCellText isSorted={Boolean(sortDirection)}>{name}</HeaderCellText>
      {icon}
    </HeaderCell>
  );
};

const columns = [
  { key: "id", header: "ID", sortable: true, width: 50 },
  { key: "firstName", header: "First", sortable: true, width: 120 },
  { key: "lastName", header: "Last", sortable: true, width: 120 },
  { key: "email", header: "Email", sortable: true, width: 250 }
].map(c => ({
  ...c,
  header: props => <CustomHeader name={c.header} {...props} />
}));

const Example8 = () => {
  const [data, setData] = useState(_.orderBy(testData, ["firstName"], ["asc"]));

  const onSort = (col, dir) => {
    if (!col || !dir) {
      setData(testData);
    } else {
      setData(_.orderBy(data, [col], [dir.toLowerCase()]));
    }
  };

  return (
    <StyledTable
      data={data}
      columns={columns}
      tableHeight={400}
      rowHeight={35}
      onSort={onSort}
      sortColumn="firstName"
      sortDirection="ASC"
    />
  );
};

const Source = `
const StyledTable = styled(Table)\`
  .react-fluid-table-header {
    background-color: #bceb82;
  }
\`;

// className header-cell is NOT required
const HeaderCell = styled.div.attrs(() => ({
  className: "header-cell"
}))\`
  background: \${props => (props.sortDirection ? "rgb(39, 40, 34)" : undefined)};
\`;

// className header-cell-text is NOT required
const HeaderCellText = styled.div.attrs(() => ({
  className: "header-cell-text"
}))\`
  color: \${props => (props.isSorted ? "rgb(249, 38, 114)" : "black")};
\`;

/**
 * \`rest\` contains \`style\`, \`onClick\`, and \`sortDirection.\`
*/
const CustomHeader = ({ name, ...rest }) => {
  const { sortDirection } = rest;
  const icon = !sortDirection ? null : (
    <Arrow size="small" name={\`chevron \${sortDirection === "ASC" ? "up" : "down"}\`} />
  );
  return (
    <HeaderCell {...rest}>
      <HeaderCellText isSorted={Boolean(sortDirection)}>{name}</HeaderCellText>
      {icon}
    </HeaderCell>
  );
};

const columns = [
  { key: "id", header: "ID", sortable: true, width: 50 },
  { key: "firstName", header: "First", sortable: true, width: 120 },
  { key: "lastName", header: "Last", sortable: true, width: 120 },
  { key: "email", header: "Email", sortable: true, width: 250 }
].map(c => ({
  ...c,
  header: props => <CustomHeader name={c.header} {...props} />
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

  return (
    <StyledTable
      data={data}
      columns={columns}
      tableHeight={400}
      rowHeight={35}
      onSort={onSort}
      sortColumn="firstName"
      sortDirection="ASC"
    />
  );
};
`;

export { Example8, Source };
