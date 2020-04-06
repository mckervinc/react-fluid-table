import React, { useState, useEffect } from "react";
import { Table } from "react-fluid-table";
import _ from "lodash";
import faker from "faker";
import { Grid, Form, Checkbox } from "semantic-ui-react";
import styled from "styled-components";
import { testData } from "../data";

const StyledTable = styled(Table)`
  margin-top: 10px;
`;

const Background = styled.div`
  background: rgb(39, 40, 34);
  border-radius: 5px;
  padding: 5px 10px;
  color: rgb(248, 248, 242);
`;

const Span = styled.span`
  color: rgb(166, 226, 46);
`;

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

const testData2 = _.range(3000).map(i => ({
  id: i + 1,
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email(),
  avatar: faker.image.avatar(),
  country: faker.address.countryCode().toLowerCase(),
  words: faker.lorem.words(),
  sentence: faker.lorem.sentences(),
  address: faker.address.streetAddress(),
  city: faker.address.city(),
  state: faker.address.stateAbbr(),
  zipCode: faker.address.zipCode()
}));

const Controlled = ({ data, columns: variableColumns }) => {
  const [rows, setRows] = useState([]);

  const onSort = (col, dir) => {
    if (!col || !dir) {
      setRows(data);
    } else {
      setRows(_.orderBy(rows, [col], [dir.toLowerCase()]));
    }
  };

  useEffect(() => {
    setRows(_.orderBy(data, ["firstName"], ["asc"]));
  }, [data]);

  return (
    <StyledTable
      data={rows}
      columns={variableColumns}
      tableHeight={400}
      rowHeight={35}
      onSort={onSort}
      sortColumn="firstName"
      sortDirection="ASC"
    />
  );
};

const Example7 = () => {
  // hooks
  const [toggles, setToggles] = useState({
    data: false,
    columns: false
  });

  // variables
  const keys = Object.keys(toggles);
  const props = {
    data: toggles.data ? testData2 : testData,
    columns: toggles.columns
      ? [...columns, { key: "address", header: "Address", sortable: true }]
      : columns
  };

  // functions
  const onToggle = key => {
    setToggles({
      ...toggles,
      [key]: !toggles[key]
    });
  };

  return (
    <>
      <Grid stackable columns={2}>
        <Grid.Row>
          <Grid.Column width={8}>
            <Form>
              <h4>Select properties to control</h4>
              <Form.Field>
                <Checkbox
                  toggle
                  label="data - changes data source"
                  value={toggles.data.toString()}
                  checked={toggles.data}
                  onChange={() => onToggle("data")}
                />
              </Form.Field>
              <Form.Field>
                <Checkbox
                  toggle
                  label="columns - adds an address column"
                  checked={toggles.columns}
                  onChange={() => onToggle("columns")}
                />
              </Form.Field>
            </Form>
          </Grid.Column>
          <Grid.Column width={8}>
            <h4>Controlled Props:</h4>
            <Background>
              <pre>
                {"{\n"}
                {keys.map((key, index) => {
                  const ending = index !== keys.length - 1 ? ",\n" : "\n";
                  return (
                    <React.Fragment key={key}>
                      {`  ${key}: `}
                      <Span>"{toggles[key] ? "altered" : "original"}"</Span>
                      {ending}
                    </React.Fragment>
                  );
                })}
                {"}"}
              </pre>
            </Background>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Controlled {...props} />
    </>
  );
};

const Source = `
const Controlled = ({ data, columns: variableColumns }) => {
  const [rows, setRows] = useState([]);

  const onSort = (col, dir) => {
    if (!col || !dir) {
      setRows(data);
    } else {
      setRows(_.orderBy(rows, [col], [dir.toLowerCase()]));
    }
  };

  useEffect(() => {
    setRows(_.orderBy(data, ["firstName"], ["asc"]));
  }, [data]);

  return (
    <StyledTable
      data={rows}
      columns={variableColumns}
      tableHeight={400}
      rowHeight={35}
      onSort={onSort}
      sortColumn="firstName"
      sortDirection="ASC"
    />
  );
};
`.trim();

export { Example7, Source };
