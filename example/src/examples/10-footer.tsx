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
    width: 50
  },
  {
    key: "firstName",
    header: "First",
    width: 120
  },
  {
    key: "lastName",
    header: "Last",
    width: 120
  },
  {
    key: "email",
    header: "Email",
    width: 250
  }
];

const Footer = styled.div`
  background-color: white;
`;

const Example10 = () => {
  // hooks
  const [sticky, setSticky] = useState(true);
  const [simple, setSimple] = useState(true);

  return (
    <>
      <Grid stackable columns={2}>
        <Grid.Row>
          <Grid.Column width={8}>
            <Form>
              <h4>Change footer properties</h4>
              <Form.Field>
                <Checkbox
                  toggle
                  label="change footer type"
                  value={simple.toString()}
                  checked={simple}
                  onChange={() => setSimple(prev => !prev)}
                />
              </Form.Field>
              <Form.Field>
                <Checkbox
                  toggle
                  label="change footer sticky value"
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
                {"{\n  simpleFooter: "}
                <span style={{ color: "rgb(102, 217, 239)" }}>{simple.toString()}</span>
                {",\n  stickyFooter: "}
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
        footerStyle={{ backgroundColor: "white" }}
        footerComponent={({ widths }) => (
          <Footer>
            {simple ? (
              "Hello, World"
            ) : (
              <div style={{ display: "flex" }}>
                {columns.map((c, i) => {
                  const width = `${widths[i]}px`;
                  const style: React.CSSProperties = {
                    width,
                    minWidth: width,
                    padding: "8px"
                  };
                  return (
                    <div key={c.key} style={style}>
                      Footer Cell
                    </div>
                  );
                })}
              </div>
            )}
          </Footer>
        )}
      />
    </>
  );
};

const Source = `
const data = [/* ... */];

const Footer = ({ children }) => (
  <div style={{ backgroundColor: "white" }}>
    {children}
  </div>
);

const SimpleFooter = ({ stickyFooter }) => {
  return (
    <StyledTable
      borders
      data={data}
      columns={columns}
      tableHeight={400}
      stickyFooter={stickyFooter}
      footerStyle={{ backgroundColor: "white" }}
      footerComponent={() => <Footer>Hello, World</Footer>}
    />
  );
};

const ComplexFooter = ({ stickyFooter }) => {
  return (
    <StyledTable
      borders
      data={data}
      columns={columns}
      tableHeight={400}
      stickyFooter={stickyFooter}
      footerStyle={{ backgroundColor: "white" }}
      footerComponent={({ widths }) => (
        <Footer>
          <div style={{ display: "flex" }}>
            {columns.map((c, i) => {
              const width = \`\${widths[i]}px\`;
              const style: React.CSSProperties = {
                width,
                minWidth: width,
                padding: "8px"
              };
              return (
                <div key={c.key} style={style}>
                  Footer Cell
                </div>
              );
            })}
          </div>
        </Footer>
      )}
    />
  );
};
`;

export { Example10, Source };
