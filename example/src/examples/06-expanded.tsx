import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useSource, useTitle } from "@/hooks/useTitle";
import { useState } from "react";
import { ColumnProps, SubComponentProps, Table } from "react-fluid-table";
import { TestData, testData } from "../data";

const columns: ColumnProps<TestData>[] = [
  {
    key: "",
    width: 40,
    expander: true
  },
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

const SubComponent = ({ row }: SubComponentProps<TestData>) => {
  // hooks
  const [value, setValue] = useState("");

  return (
    <div className="bg-[#1b1c1d] px-3.5 py-2.5 text-white">
      <Accordion type="single" collapsible value={value} onValueChange={setValue}>
        <AccordionItem value="item-1">
          <AccordionTrigger>What is the address for this user?</AccordionTrigger>
          <AccordionContent>{`${row.address}, ${row.city}, ${row.state} ${row.zipCode}`}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>What are the random sentences when you select this option?</AccordionTrigger>
          <AccordionContent>{row.sentence}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>What famous poem was included in Breaking Bad that referenced a king?</AccordionTrigger>
          <AccordionContent>
            <p>
              The poem is called <b>Ozymandias</b> by <b>Percy Bryce Shelley</b>. You can find the poem below:
            </p>
            <div>I met a traveller from an antique land,</div>
            <div>Who said—“Two vast and trunkless legs of stone</div>
            <div>Stand in the desert. . . . Near them, on the sand,</div>
            <div>Half sunk a shattered visage lies, whose frown,</div>
            <div>And wrinkled lip, and sneer of cold command,</div>
            <div>Tell that its sculptor well those passions read</div>
            <div>Which yet survive, stamped on these lifeless things,</div>
            <div>The hand that mocked them, and the heart that fed;</div>
            <div>And on the pedestal, these words appear:</div>
            <div>My name is Ozymandias, King of Kings;</div>
            <div>Look on my Works, ye Mighty, and despair!</div>
            <div>Nothing beside remains. Round the decay</div>
            <div>Of that colossal Wreck, boundless and bare</div>
            <div>The lone and level sands stretch far away.”</div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

const Source = `
const data = [/* ... */];

const columns: ColumnProps<TestData>[] = [
  { key: "", width: 40, expander: true },
  { key: "id", header: "ID", width: 50 },
  { key: "firstName", header: "First", width: 120 },
  { key: "lastName", header: "Last", width: 120 },
  { key: "email", header: "Email", width: 250 }
];

const SubComponent = ({ row }: SubComponentProps<TestData>) => {
  // hooks
  const [value, setValue] = useState("");

  return (
    <div className="bg-[#1b1c1d] px-3.5 py-2.5 text-white">
      <Accordion
        type="single"
        collapsible
        value={value}
        onValueChange={setValue}
      >
        <AccordionItem value="item-1">
          <AccordionTrigger>
            What is the address for this user?
          </AccordionTrigger>
          <AccordionContent>
            {\`\${row.address}, \${row.city}, \${row.state} \${row.zipCode}\`}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>
            What are the random sentences when you select this option?
          </AccordionTrigger>
          <AccordionContent>{row.sentence}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>
            What famous poem was included in Breaking Bad that referenced a
            king?
          </AccordionTrigger>
          <AccordionContent>
            <p>
              The poem is called <b>Ozymandias</b> by <b>Percy Bryce Shelley</b>
              . You can find the poem below:
            </p>
            <div>I met a traveller from an antique land,</div>
            <div>Who said—“Two vast and trunkless legs of stone</div>
            <div>Stand in the desert. . . . Near them, on the sand,</div>
            <div>Half sunk a shattered visage lies, whose frown,</div>
            <div>And wrinkled lip, and sneer of cold command,</div>
            <div>Tell that its sculptor well those passions read</div>
            <div>Which yet survive, stamped on these lifeless things,</div>
            <div>The hand that mocked them, and the heart that fed;</div>
            <div>And on the pedestal, these words appear:</div>
            <div>My name is Ozymandias, King of Kings;</div>
            <div>Look on my Works, ye Mighty, and despair!</div>
            <div>Nothing beside remains. Round the decay</div>
            <div>Of that colossal Wreck, boundless and bare</div>
            <div>The lone and level sands stretch far away.”</div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

const Example = () => (
  <Table
    borders
    data={data}
    columns={columns}
    subComponent={SubComponent}
    tableHeight={400}
  />
);
`;

const Example6 = () => {
  useTitle("Expanded Row Height");
  useSource(Source);
  return <Table borders data={testData} columns={columns} tableHeight={400} subComponent={SubComponent} />;
};

export { Example6, Source };
