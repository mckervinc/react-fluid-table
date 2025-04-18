import { Col } from "@/components/ui/col";
import { Row } from "@/components/ui/row";
import { Switch } from "@/components/ui/switch";
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
import { TestData, testData } from "../data";
import { useSource, useTitle } from "@/hooks/useTitle";

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

type ControlledProps = {
  data: TestData[];
  height: number;
  columns: ColumnProps<TestData>[];
};

const Controlled = ({ data, height, columns: variableColumns }: ControlledProps) => {
  const [rows, setRows] = useState<TestData[]>([]);

  const onSort = (col: string, dir: SortDirection | null) => {
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
    <Table
      data={rows}
      columns={variableColumns}
      tableHeight={height}
      rowHeight={35}
      onSort={onSort}
      sortColumn="firstName"
      sortDirection="ASC"
      className="border border-solid border-[#ececec]"
      headerClassname="bg-[#dedede]"
    />
  );
};

type ToggleType = {
  data: boolean;
  height: boolean;
  columns: boolean;
};

type DataType = {
  data: TestData[];
  height: number;
  columns: ColumnProps<TestData>[];
};

type keyM = keyof ToggleType;
type keyD = keyof DataType;

const viewableTypes = new Set(["string", "number", "boolean"]);

const Source = `
const Controlled = ({ data, columns: variableColumns }) => {
  const [rows, setRows] = useState([]);

  const onSort = (col, dir) => {
    if (!dir) {
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
    <Table
      data={rows}
      columns={variableColumns}
      tableHeight={400}
      rowHeight={35}
      onSort={onSort}
      sortColumn="firstName"
      sortDirection="ASC"
      className="border border-solid border-[#ececec]"
      headerClassname="bg-[#dedede]"
    />
  );
};
`;

const Example7 = () => {
  // hooks
  useTitle("Controlled Props");
  useSource(Source);
  const [toggles, setToggles] = useState<ToggleType>({
    data: false,
    height: false,
    columns: false
  });

  // variables
  const keys: keyM[] = ["data", "height", "columns"];
  const props: DataType = {
    data: toggles.data ? testData2 : testData,
    height: toggles.height ? 200 : 400,
    columns: toggles.columns ? [...columns, { key: "address", header: "Address", sortable: true }] : columns
  };

  return (
    <>
      <Row className="mb-2.5">
        <Col md={6}>
          <form>
            <div>Select properties to control</div>
            <div className="flex gap-x-4">
              <div>
                <Switch checked={toggles.data} onCheckedChange={v => setToggles(prev => ({ ...prev, data: v }))} />
              </div>
              <div>data - changes data source</div>
            </div>
            <div className="flex gap-x-4">
              <div>
                <Switch checked={toggles.height} onCheckedChange={v => setToggles(prev => ({ ...prev, height: v }))} />
              </div>
              <div>height - changes tableHeight</div>
            </div>
            <div className="flex gap-x-4">
              <div>
                <Switch
                  checked={toggles.columns}
                  onCheckedChange={v => setToggles(prev => ({ ...prev, columns: v }))}
                />
              </div>
              <div>columns - adds an address column</div>
            </div>
          </form>
        </Col>
        <Col md={6}>
          <h4>Controlled Props:</h4>
          <div className="bg-[#272822] px-2 py-1 text-[#f8f8f2]">
            <pre>
              {"{\n"}
              {keys.map((key, index) => {
                const ending = index !== keys.length - 1 ? ",\n" : "\n";
                const val = viewableTypes.has(typeof props[key]);
                let color = "rgb(166, 226, 46)";
                if (typeof props[key] === "number") {
                  color = "rgb(174, 129, 255)";
                } else if (typeof props[key] === "boolean") {
                  color = "rgb(102, 217, 239)";
                }
                return (
                  <React.Fragment key={key}>
                    {`  ${key}: `}
                    <span style={{ color }}>
                      {val ? (props[key as keyD] as string | number) : toggles[key] ? '"altered"' : '"original"'}
                    </span>
                    {ending}
                  </React.Fragment>
                );
              })}
              {"}"}
            </pre>
          </div>
        </Col>
      </Row>
      <Controlled {...props} />
    </>
  );
};

export { Example7, Source };
