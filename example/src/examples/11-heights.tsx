import { useEffect, useRef, useState } from "react";
import { ColumnProps, Table } from "react-fluid-table";
import { Button, Form, Icon, Input } from "semantic-ui-react";
import styled from "styled-components";
import { TestData, testData } from "../data";

const StyledTable = styled(Table)`
  margin-top: 10px;
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

const Example11 = () => {
  // hooks
  const ref = useRef(0);
  const [size, setSize] = useState(1);
  const [running, setRunning] = useState(false);
  const [tableHeight, setTableHeight] = useState(400);
  const [minTableHeight, setMinTableHeight] = useState(0);
  const [maxTableHeight, setMaxTableHeight] = useState(0);

  useEffect(() => {
    const m = ref.current;
    return () => {
      window.clearInterval(m);
    };
  }, []);

  return (
    <>
      <Form>
        <h4>Change height properties</h4>
        <Form.Field>
          <Input
            label="table height"
            placeholder="specify table height (<= 0 to disable)"
            type="number"
            value={tableHeight.toString()}
            onChange={e => {
              setTableHeight(/-?\d+/.test(e.target.value) ? parseInt(e.target.value) : 0);
            }}
          />
        </Form.Field>
        <Form.Field>
          <Input
            label="min table height"
            placeholder="specify min table height (<= 0 to disable)"
            type="number"
            value={minTableHeight.toString()}
            onChange={e => {
              setMinTableHeight(/-?\d+/.test(e.target.value) ? parseInt(e.target.value) : 0);
            }}
          />
        </Form.Field>
        <Form.Field>
          <Input
            label="max table height"
            placeholder="specify max table height (<= 0 to disable)"
            type="number"
            value={maxTableHeight.toString()}
            onChange={e => {
              setMaxTableHeight(/-?\d+/.test(e.target.value) ? parseInt(e.target.value) : 0);
            }}
          />
        </Form.Field>
        <div>
          <Button
            onClick={() => {
              window.clearInterval(ref.current);
              setSize(1);
              setRunning(true);
              ref.current = window.setInterval(() => {
                setSize(prev => prev + 1);
              }, 1000);
            }}
          >
            Start
          </Button>
          <Button
            onClick={() => {
              window.clearInterval(ref.current);
              setRunning(false);
            }}
          >
            Stop
          </Button>
          {running && <Icon loading name="spinner" />}
        </div>
      </Form>
      <StyledTable
        borders
        data={testData.slice(0, size)}
        columns={columns}
        tableHeight={tableHeight}
        minTableHeight={minTableHeight}
        maxTableHeight={maxTableHeight}
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

export { Example11, Source };
