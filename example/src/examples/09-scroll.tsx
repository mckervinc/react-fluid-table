import { useCallback, useRef, useState } from "react";
import { ColumnProps, Table, TableRef } from "react-fluid-table";
import { Form as BaseForm } from "semantic-ui-react";
import styled from "styled-components";
import { TestData, testData } from "../data";

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

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Form = styled(BaseForm)`
  margin-bottom: 1rem;
`;

const Group = styled(Form.Group)`
  align-items: flex-end;
`;

const Example9 = () => {
  const ref = useRef<TableRef | null>(null);
  const [scrollToOffset, setScrollToOffset] = useState("");
  const [scrollToNumber, setScrollToNumber] = useState("");
  const scrollToIndex = useCallback(() => {
    ref.current?.scrollToItem(parseInt(scrollToNumber));
  }, [scrollToNumber]);
  const scrollToPixel = useCallback(() => {
    ref.current?.scrollTo(parseInt(scrollToOffset));
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
      <Table ref={ref} data={testData} columns={columns} tableHeight={400} />
    </>
  );
};

const Source = `
const data = [/* ... */];
const columns = [/* ... */];

const Example = () => {
  const ref = useRef(null);
  const [scrollToOffset, setScrollToOffset] = useState("");
  const [scrollToNumber, setScrollToNumber] = useState("");
  const scrollToIndex = useCallback(() => {
    ref.current.scrollToItem(parseInt(scrollToNumber));
  }, [scrollToNumber]);
  const scrollToPixel = useCallback(() => {
    ref.current.scrollTo(parseInt(scrollToOffset));
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

export { Example9, Source };
