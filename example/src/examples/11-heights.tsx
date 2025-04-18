import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSource, useTitle } from "@/hooks/useTitle";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { ColumnProps, Table } from "react-fluid-table";
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

const Source = `
const data = [/* ... */];

const AdjustableHeightTable = ({ tableHeight, minTableHeight, maxTableHeignt }) => {
  return (
    <Table
      data={testData}
      columns={columns}
      tableHeight={tableHeight}
      minTableHeight={minTableHeight}
      maxTableHeight={maxTableHeight}
      className="border border-solid border-[#ececec]"
      headerClassname="bg-[#dedede]"
    />
  );
};
`;

const Example11 = () => {
  // hooks
  useTitle("Table Heights");
  useSource(Source);
  const ref = useRef(0);
  const [size, setSize] = useState(1);
  const [running, setRunning] = useState(false);
  const [tableHeight, setTableHeight] = useState(0);
  const [minTableHeight, setMinTableHeight] = useState(0);
  const [maxTableHeight, setMaxTableHeight] = useState(400);

  useEffect(() => {
    const m = ref.current;
    return () => {
      window.clearInterval(m);
    };
  }, []);

  return (
    <>
      <form className="mb-2.5">
        <h4>Change height properties</h4>
        <div>
          <Label>{"table height"}</Label>
          <Input
            placeholder="specify table height (<= 0 to disable)"
            type="number"
            value={tableHeight.toString()}
            onChange={e => {
              setTableHeight(/-?\d+/.test(e.target.value) ? Number(e.target.value) : 0);
            }}
          />
        </div>
        <div>
          <Label>{"min table height"}</Label>
          <Input
            placeholder="specify min table height (<= 0 to disable)"
            type="number"
            value={minTableHeight.toString()}
            onChange={e => {
              setMinTableHeight(/-?\d+/.test(e.target.value) ? Number(e.target.value) : 0);
            }}
          />
        </div>
        <div>
          <Label>{"max table height"}</Label>
          <Input
            placeholder="specify max table height (<= 0 to disable)"
            type="number"
            value={maxTableHeight.toString()}
            onChange={e => {
              setMaxTableHeight(/-?\d+/.test(e.target.value) ? Number(e.target.value) : 0);
            }}
          />
        </div>
        <div>
          <Button
            type="button"
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
            type="button"
            onClick={() => {
              window.clearInterval(ref.current);
              setRunning(false);
            }}
          >
            Stop
          </Button>
          {running && <FontAwesomeIcon spin icon={faSpinner} />}
        </div>
      </form>
      <Table
        data={testData.slice(0, size)}
        columns={columns}
        tableHeight={tableHeight}
        minTableHeight={minTableHeight}
        maxTableHeight={maxTableHeight}
        className="border border-solid border-[#ececec]"
        headerClassname="bg-[#dedede]"
      />
    </>
  );
};

export { Example11, Source };
