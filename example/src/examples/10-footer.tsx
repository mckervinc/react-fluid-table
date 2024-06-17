/* eslint-disable @typescript-eslint/no-explicit-any */
import { Col } from "@/components/ui/col";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Row } from "@/components/ui/row";
import { Switch } from "@/components/ui/switch";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { ColumnProps, FooterProps, Table } from "react-fluid-table";
import { TestData, testData } from "../data";
import { useSource, useTitle } from "@/hooks/useTitle";

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
    <button type="button" onClick={() => setLoading(true)}>
      {loading ? <FontAwesomeIcon spin icon={faSpinner} /> : "Click Me"}
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
              const width = widths[i];
              const style: React.CSSProperties = {
                width,
                minWidth: width,
                padding: "8px",
                position: c.frozen ? "sticky" : undefined,
                left: c.frozen ? widths.slice(0, i).reduce((pv, c) => pv + c, 0) : undefined
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

type Footers = "column" | "basic" | "complex";

const Example10 = () => {
  // hooks
  useTitle("Footer");
  useSource(Source);
  const [sticky, setSticky] = useState(true);
  const [footerType, setFooterType] = useState<Footers>("column");

  // constants
  const InnerFooter =
    footerType !== "column"
      ? ({ widths }: FooterProps<TestData>) => (
          <div className="bg-white">
            {footerType === "basic" ? (
              "Hello, World"
            ) : (
              <div style={{ display: "flex" }}>
                {columns.map((c, i) => {
                  const width = widths[i];
                  const style: React.CSSProperties = {
                    width,
                    minWidth: width,
                    padding: "8px",
                    position: c.frozen ? "sticky" : undefined,
                    left: c.frozen ? widths.slice(0, i).reduce((pv, c) => pv + c, 0) : undefined
                  };
                  return (
                    <div key={c.key} style={style}>
                      Footer Cell
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )
      : undefined;

  return (
    <>
      <Row>
        <Col md={6}>
          <form className="mb-4">
            <h4>Change footer properties</h4>
            <div className="flex items-end gap-x-2">
              <div>
                <Switch checked={sticky} onCheckedChange={setSticky} />
              </div>
              <div>change footer sticky value</div>
            </div>
            <div className="mb-4">
              Selected value: <b>{footerType}</b>
            </div>
            <RadioGroup value={footerType} onValueChange={v => setFooterType(v as Footers)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="column" id="column" />
                <Label htmlFor="column">set footer type to column-derived</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="basic" id="basic" />
                <Label htmlFor="basic">set footer type to basic</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="complex" id="complex" />
                <Label htmlFor="complex">set footer type to complex</Label>
              </div>
            </RadioGroup>
          </form>
        </Col>
        <Col md={6}>
          <h4>Controlled Props:</h4>
          <div className="rounded bg-[#272822] px-2 py-1 text-[#f8f8f2]">
            <pre>
              {"{\n  footerType: "}
              <span style={{ color: "rgb(166, 226, 46)" }}>{`"${footerType}"`}</span>
              {",\n  stickyFooter: "}
              <span style={{ color: "rgb(102, 217, 239)" }}>{sticky.toString()}</span>
              {"\n}"}
            </pre>
          </div>
        </Col>
      </Row>
      <Table
        borders
        data={testData.slice(0, 30)}
        columns={columns as unknown as any[]}
        stickyFooter={sticky}
        tableHeight={400}
        className="border border-solid border-[#ececec]"
        headerClassname="bg-[#dedede]"
        footerStyle={{ backgroundColor: "white" }}
        footerComponent={InnerFooter as unknown as any}
      />
    </>
  );
};

export { Example10, Source };
