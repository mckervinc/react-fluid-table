import { useState } from "react";
import { ColumnProps, Table } from "react-fluid-table";
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

const Footer = styled.div`
  background-color: white;
  padding: 8px;
`;

const Example10 = () => {
  // hooks
  const [sticky, setSticky] = useState(true);

  return (
    <>
      <Grid stackable columns={2}>
        <Grid.Row>
          <Grid.Column width={8}>
            <Form>
              <h4>Change footer stickyness</h4>
              <Form.Field>
                <Checkbox
                  toggle
                  label="sticky - change footer stick value"
                  value={sticky.toString()}
                  checked={sticky}
                  onChange={() => setSticky(prev => !prev)}
                />
              </Form.Field>
            </Form>
          </Grid.Column>
          <Grid.Column width={8}>
            <h4>Controlled Props:</h4>
            <Background>
              <pre>
                {"{\n  stickyFooter: "}
                <span style={{ color: "rgb(102, 217, 239)" }}>{sticky.toString()}</span>
                {"\n}"}
              </pre>
            </Background>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <StyledTable
        borders
        data={testData.slice(0, 30)}
        columns={columns}
        stickyFooter={sticky}
        tableHeight={400}
        footerComponent={() => <Footer>Footer content</Footer>}
      />
    </>
  );
};

const Source = `
const data = [/* ... */];

const Footer = styled.div\`
  background-color: white;
  padding: 8px;
\`;

const Controlled = ({ stickyFooter }) => {
  return (
    <StyledTable
      borders
      data={data}
      columns={columns}
      tableHeight={400}
      stickyFooter={stickyFooter}
      footerComponent={() => <Footer>Footer content</Footer>}
    />
  );
};
`;

export { Example10, Source };
