import { ColumnProps, Table } from "react-fluid-table";
import { generateTestData, TestData } from "../data";
import { useSource, useTitle } from "@/hooks/useTitle";
import { useCallback, useState } from "react";

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
type TestData = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};

const generateTestData = (rows: number) => {
  return _.range(rows).map(i => ({
    id: i + 1,
    firstName: randFirstName(),
    // ...
  }));
};

const columns: ColumnProps<TestData>[] = [
  { key: "id", header: "ID", width: 50 },
  { key: "firstName", header: "First", width: 120 },
  { key: "lastName", header: "Last", width: 120 },
  { key: "email", header: "Email", width: 250 }
];

const Example = () => {
  const [multiplier, setMultiplier] = useState(1);
  const [data, setData] = useState(generateTestData(NUM_ROWS));

  const fetchData = useCallback(async () => {
    await new Promise(r => window.setTimeout(r, 50000));

    setMultiplier(prev => prev + 1);
    setData(generateTestData((multiplier + 1) * NUM_ROWS));
  }, [multiplier]);

  return <Table data={data} columns={columns} onLoadRows={() => fetchData()} />;
};
`;

const NUM_ROWS = 50;

const Example13 = () => {
  useTitle("Infinite Table");
  useSource(Source);
  const [multiplier, setMultiplier] = useState(1);
  const [data, setData] = useState(generateTestData(NUM_ROWS));

  const fetchData = useCallback(async () => {
    await new Promise(r => window.setTimeout(r, 500));

    setMultiplier(prev => prev + 1);
    setData(generateTestData((multiplier + 1) * NUM_ROWS));
  }, [multiplier]);

  return <Table data={data} columns={columns} onLoadRows={() => fetchData()} />;
};

export { Example13 };
