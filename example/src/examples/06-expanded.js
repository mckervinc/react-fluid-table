import React, { useState, useLayoutEffect } from "react";
import { Table } from "react-fluid-table";
import styled from "styled-components";
import { Segment, Accordion, Icon } from "semantic-ui-react";
import { testData } from "../data";

const columns = [
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

const Wrapper = styled(Segment)`
  &&& {
    padding: 0;
  }
`;

const StyledAccordian = styled(Accordion)`
  &&& {
    border-radius: 0;
    background: #1b1c1d;
  }
`;

let context = {};

const SubComponent = ({ row, index, clearSizeCache }) => {
  const [activeIndex, setActiveIndex] = useState(context[index]);
  const onClick = (e, { index: selected }) => {
    const result = activeIndex === selected ? null : selected;
    context[index] = result;
    setActiveIndex(result);
  };

  useLayoutEffect(() => {
    clearSizeCache(index, true);
  }, [activeIndex, index, clearSizeCache]);

  return (
    <Wrapper inverted>
      <StyledAccordian styled fluid inverted>
        <Accordion.Title active={activeIndex === 0} index={0} onClick={onClick}>
          <Icon name="dropdown" />
          What is the address for this user?
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
          <p>{`${row.address}, ${row.city}, ${row.state} ${row.zipCode}`}</p>
        </Accordion.Content>
        <Accordion.Title active={activeIndex === 1} index={1} onClick={onClick}>
          <Icon name="dropdown" />
          What are the random sentences when you select this option?
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 1}>
          <p>{row.sentence}</p>
        </Accordion.Content>
        <Accordion.Title active={activeIndex === 2} index={2} onClick={onClick}>
          <Icon name="dropdown" />
          What famous poem was included in Breaking Bad that referenced a king?
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 2}>
          <p>
            The poem is called <b>Ozymandias</b> by <b>Percy Bryce Shelley</b>. You can find the
            poem below:
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
        </Accordion.Content>
      </StyledAccordian>
    </Wrapper>
  );
};

const Example6 = () => (
  <Table data={testData} columns={columns} tableHeight={400} subComponent={SubComponent} />
);

const Source = `
const data = [/* ... */];

const columns = [
  { key: "", width: 40, expander: true },
  { key: "id", header: "ID", width: 50 },
  { key: "firstName", header: "First", width: 120 },
  { key: "lastName", header: "Last", width: 120 },
  { key: "email", header: "Email", width: 250 }
];

const SubComponent = ({ row, index, clearSizeCache }) => {
  const [activeIndex, setActiveIndex] = useState(context[index]);
  const onClick = (e, { index: selected }) => {
    const result = activeIndex === selected ? null : selected;
    context[index] = result;
    setActiveIndex(result);
  };

  useLayoutEffect(() => {
    clearSizeCache(index, true);
  }, [activeIndex, index, clearSizeCache]);

  return (
    <Wrapper inverted>
      <StyledAccordian styled fluid inverted>
        <Accordion.Title active={activeIndex === 0} index={0} onClick={onClick}>
          <Icon name="dropdown" />
          What is the address for this user?
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
          <p>{\`\${row.address}, \${row.city}, \${row.state} \${row.zipCode}\`}</p>
        </Accordion.Content>
        <Accordion.Title active={activeIndex === 1} index={1} onClick={onClick}>
          <Icon name="dropdown" />
          What are the random sentences when you select this option?
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 1}>
          <p>{row.sentence}</p>
        </Accordion.Content>
        <Accordion.Title active={activeIndex === 2} index={2} onClick={onClick}>
          <Icon name="dropdown" />
          What famous poem was included in Breaking Bad that referenced a king?
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 2}>
          <p>
            The poem is called <b>Ozymandias</b> by <b>Percy Bryce Shelley</b>. You can find the
            poem below:
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
        </Accordion.Content>
      </StyledAccordian>
    </Wrapper>
  );
};

const Example = () => (
  <Table
    data={data}
    columns={columns}
    subComponent={SubComponent}
    tableHeight={400}
  />
);
`.trim();

export { Example6, Source };
