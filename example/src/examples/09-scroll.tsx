import { Button } from "@/components/ui/button";
import { Col } from "@/components/ui/col";
import { Input } from "@/components/ui/input";
import { Row } from "@/components/ui/row";
import { useCallback, useRef, useState } from "react";
import { ColumnProps, Table, TableRef } from "react-fluid-table";
import { TestData, testData } from "../data";
import { useSource, useTitle } from "@/hooks/useTitle";

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

const Source = `
const data = [/* ... */];
const columns = [/* ... */];

const Example = () => {
  const ref = useRef(null);
  const [scrollToOffset, setScrollToOffset] = useState("");
  const [scrollToNumber, setScrollToNumber] = useState("");
  const scrollToIndex = useCallback(() => {
    ref.current.scrollToItem(Number(scrollToNumber));
  }, [scrollToNumber]);
  const scrollToPixel = useCallback(() => {
    ref.current.scrollTo(Number(scrollToOffset));
  }, [scrollToOffset]);

  return (
    <>
      <Wrapper>
        <Form onSubmit={scrollToIndex}>
          <Group>
            <Form.Input
              label="scroll to row number"
              control="input"
              type="number"
              value={scrollToNumber}
              onChange={e => setScrollToNumber(e.target.value)}
            />
            <Form.Button onClick={scrollToIndex}>Scroll to Number</Form.Button>
          </Group>
        </Form>
        <Form onSubmit={scrollToPixel}>
          <Group>
            <Form.Input
              label="scroll to pixel offset"
              control="input"
              type="number"
              value={scrollToOffset}
              onChange={e => setScrollToOffset(e.target.value)}
            />
            <Form.Button onClick={scrollToPixel}>Scroll to Offset</Form.Button>
          </Group>
        </Form>
      </Wrapper>
      <Table tableHeight={400} ref={ref} data={data} columns={columns} />
    </>
  );
};
`;

const Example9 = () => {
  // hooks
  useTitle("Methods");
  useSource(Source);
  const ref = useRef<TableRef | null>(null);
  const [scrollToOffset, setScrollToOffset] = useState("");
  const [scrollToNumber, setScrollToNumber] = useState("");

  // functions
  const scrollToIndex = useCallback(() => {
    ref.current?.scrollToItem(Number(scrollToNumber));
  }, [scrollToNumber]);
  const scrollToPixel = useCallback(() => {
    ref.current?.scrollTo(Number(scrollToOffset));
  }, [scrollToOffset]);

  return (
    <>
      <Row>
        <Col md={6}>
          <form onSubmit={scrollToIndex} className="mb-4">
            <div className="flex items-end gap-x-2">
              <div>
                <label className="block font-bold">scroll to row number</label>
                <Input type="number" value={scrollToNumber} onChange={e => setScrollToNumber(e.target.value)} />
              </div>
              <Button type="button" onClick={scrollToIndex}>
                Scroll to Number
              </Button>
            </div>
          </form>
        </Col>
        <Col md={6}>
          <form onSubmit={scrollToPixel} className="mb-4">
            <div className="flex items-end gap-x-2">
              <div>
                <label className="block font-bold">scroll to pixel offset</label>
                <Input type="number" value={scrollToOffset} onChange={e => setScrollToOffset(e.target.value)} />
              </div>
              <Button type="button" onClick={scrollToPixel}>
                Scroll to Offset
              </Button>
            </div>
          </form>
        </Col>
      </Row>
      <Table ref={ref} data={testData} columns={columns} tableHeight={400} />
    </>
  );
};

export { Example9, Source };
