/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  randCatchPhrase,
  randCity,
  randCountryCode,
  randEmail,
  randFirstName,
  randImg,
  randLastName,
  randParagraph,
  randSentence,
  randStateAbbr,
  randStreetAddress,
  randZipCode
} from "@ngneat/falso";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { ColumnProps, SortDirection, Table } from "react-fluid-table";
import { Checkbox, Form, Grid } from "semantic-ui-react";
import styled from "styled-components";
import { TestData, testData } from "../data";

const StyledTable = styled(Table)`
  margin-top: 10px;
`;

const Background = styled.div`
  background: rgb(39, 40, 34);
  border-radius: 5px;
  padding: 5px 10px;
  color: rgb(248, 248, 242);
`;

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

const testData2: TestData[] = _.range(3000).map(i => ({
  id: i + 1,
  firstName: randFirstName(),
  lastName: randLastName(),
  email: randEmail(),
  avatar: randImg({ width: 20, height: 20 }),
  country: randCountryCode().toLowerCase(),
  words: randCatchPhrase(),
  sentence: randSentence(),
  lorem: randParagraph(),
  address: randStreetAddress(),
  city: randCity(),
  state: randStateAbbr(),
  zipCode: randZipCode()
}));

interface ControlledProps {
  data: TestData[];
  height: number;
  columns: ColumnProps<TestData>[];
}

const Controlled = ({ data, height, columns: variableColumns }: ControlledProps) => {
  const [rows, setRows] = useState<TestData[]>([]);

  const onSort = (col: string | null, dir: SortDirection) => {
    if (!col || !dir) {
      setRows(data);
    } else {
      const direction = dir === "ASC" ? "asc" : "desc";
      setRows(_.orderBy(rows, [col], [direction]));
    }
  };

  useEffect(() => {
    setRows(_.orderBy(data, ["firstName"], ["asc"]));
  }, [data]);

  return (
    <StyledTable
      data={rows}
      columns={variableColumns}
      tableHeight={height}
      rowHeight={35}
      onSort={onSort}
      sortColumn="firstName"
      sortDirection="ASC"
    />
  );
};

const viewableTypes = new Set(["string", "number", "boolean"]);

const Example7 = () => {
  // hooks
  const [toggles, setToggles] = useState({
    data: false,
    height: false,
    columns: false
  });

  // variables
  const keys = Object.keys(toggles);
  const props = {
    data: toggles.data ? testData2 : testData,
    height: toggles.height ? 200 : 400,
    columns: toggles.columns
      ? [...columns, { key: "address", header: "Address", sortable: true }]
      : columns
  };

  // functions
  const onToggle = (key: string) => {
    if (key === "data" || key === "height" || key === "columns") {
      setToggles({
        ...toggles,
        [key]: !toggles[key]
      });
    }
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
                  label="height - changes tableHeight"
                  value={toggles.height.toString()}
                  checked={toggles.height}
                  onChange={() => onToggle("height")}
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
                  // @ts-ignore
                  const val = viewableTypes.has(typeof props[key]);
                  let color = "rgb(166, 226, 46)";
                  // @ts-ignore
                  if (typeof props[key] === "number") {
                    color = "rgb(174, 129, 255)";
                    // @ts-ignore
                  } else if (typeof props[key] === "boolean") {
                    color = "rgb(102, 217, 239)";
                  }
                  return (
                    <React.Fragment key={key}>
                      {`  ${key}: `}
                      <span style={{ color }}>
                        {/* @ts-ignore */}
                        {val ? props[key] : toggles[key] ? '"altered"' : '"original"'}
                      </span>
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
      const direction = dir === "ASC" ? "asc" : "desc";
      setRows(_.orderBy(rows, [col], [direction]));
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
`;

export { Example7, Source };
