import { useEffect, useRef, useState } from "react";
import { ColumnProps, FooterProps, Table } from "react-fluid-table";
import { Checkbox, Form, Grid, Icon, Input, Radio } from "semantic-ui-react";
import styled from "styled-components";
import { TestData, testData } from "../data";

const StyledTable = styled(Table)`
  margin-top: 10px;
  border: 1px solid #ececec;

  .react-fluid-table-header {
    background-color: #dedede;
  }
`;

const Background = styled.div`
  background: rgb(39, 40, 34);
  border-radius: 5px;
  padding: 5px 10px;
  color: rgb(248, 248, 242);
`;

const TestButton = () => {
  // hooks
  const ref = useRef(0);
  const [loading, setLoading] = useState(false);

  // effects
  useEffect(() => {
    window.clearTimeout(ref.current);
    if (loading) {
      ref.current = window.setTimeout(() => {
        setLoading(false);
      }, 3000);
    }
  }, [loading]);

  useEffect(() => {
    return () => {
      window.clearTimeout(ref.current);
    };
  }, []);

  return (
    <button onClick={() => setLoading(true)}>
      {loading ? <Icon loading name="spinner" /> : "Click Me"}
    </button>
  );
};

const columns: ColumnProps<TestData>[] = [
  {
    key: "id",
    header: "ID",
    width: 50,
    footer: ({ rows }) => `sum: ${rows.reduce((pv, c) => pv + c.id, 0)}`
  },
  {
    key: "firstName",
    header: "First",
    width: 120,
    footer: () => <b>firstName</b>
  },
  {
    key: "lastName",
    header: "Last",
    width: 120,
    footer: TestButton
  },
  {
    key: "email",
    header: "Email",
    width: 250,
    footer: () => <Input placeholder="type here" />
  }
];

const Footer = styled.div`
  background-color: white;
`;

const getFooterType = (num: number) => {
  switch (num) {
    case 0:
      return "column";
    case 1:
      return "basic";
    default:
      return "complex";
  }
};

const Example10 = () => {
  // hooks
  const [sticky, setSticky] = useState(true);
  const [footerType, setFooterType] = useState(0);

  // constants
  const footerValueText = getFooterType(footerType);

  const InnerFooter =
    footerType > 0
      ? ({ widths }: FooterProps<TestData>) => (
          <Footer>
            {footerType === 1 ? (
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
        )
      : undefined;

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
                  label="change footer sticky value"
                  value={sticky.toString()}
                  checked={sticky}
                  onChange={() => setSticky(prev => !prev)}
                />
              </Form.Field>
              <Form.Field>
                Selected value: <b>{footerValueText}</b>
              </Form.Field>
              <Form.Field>
                <Radio
                  label="set footer type to column-derived"
                  name="radioGroup"
                  value={footerValueText}
                  checked={footerType === 0}
                  onChange={() => setFooterType(0)}
                />
              </Form.Field>
              <Form.Field>
                <Radio
                  label="set footer type to basic"
                  name="radioGroup"
                  value={footerValueText}
                  checked={footerType === 1}
                  onChange={() => setFooterType(1)}
                />
              </Form.Field>
              <Form.Field>
                <Radio
                  label="set footer type to complex"
                  name="radioGroup"
                  value={footerValueText}
                  checked={footerType > 1}
                  onChange={() => setFooterType(2)}
                />
              </Form.Field>
            </Form>
          </Grid.Column>
          <Grid.Column width={8}>
            <h4>Controlled Props:</h4>
            <Background>
              <pre>
                {"{\n  footerType: "}
                <span style={{ color: "rgb(166, 226, 46)" }}>{`"${footerValueText}"`}</span>
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
        footerComponent={InnerFooter}
      />
    </>
  );
};

const Source = `
const data = [/* ... */];

const TestButton = () => {
  const ref = useRef(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.clearTimeout(ref.current);
    if (loading) {
      ref.current = window.setTimeout(() => {
        setLoading(false);
      }, 3000);
    }
  }, [loading]);

  return (
    <button onClick={() => setLoading(true)}>
      {loading ? <Icon loading name="spinner" /> : "Click Me"}
    </button>
  );
};

const columns: ColumnProps<TestData>[] = [
  {
    key: "id",
    header: "ID",
    width: 50,
    footer: ({ rows }) => \`sum: \${rows.reduce((pv, c) => pv + c.id, 0)}\`
  },
  {
    key: "firstName",
    header: "First",
    width: 120,
    footer: () => <b>firstName</b>
  },
  {
    key: "lastName",
    header: "Last",
    width: 120,
    footer: TestButton
  },
  {
    key: "email",
    header: "Email",
    width: 250,
    footer: () => <Input placeholder="type here" />
  }
];

const Footer = ({ children }) => (
  <div style={{ backgroundColor: "white" }}>
    {children}
  </div>
);

const FooterFromColumn = ({ stickyFooter }) => {
  return (
    <StyledTable
      borders
      data={data}
      columns={columns}
      tableHeight={400}
      stickyFooter={stickyFooter}
      footerStyle={{ backgroundColor: "white" }}
    />
  );
};

const BasicFooter = ({ stickyFooter }) => {
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
