import { useSource, useTitle } from "@/hooks/useTitle";
import { faReact } from "@fortawesome/free-brands-svg-icons";
import { faCheckCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { ColumnProps, Table } from "react-fluid-table";
import typeString from "react-fluid-table/index.d.ts?raw";
import ColumnPropsTable from "./ColumnProps";
import { Snippet } from "./components/Snippet";
import { InlineCode } from "./components/library/InlineCode";

type PropData = {
  prop: string;
  type: string;
  description: string;
  required?: boolean;
  content?: () => React.ReactNode;
  expandedType?: () => React.ReactNode;
  default?: string | number;
};

const columns: ColumnProps<PropData>[] = [
  {
    key: "prop",
    header: "Prop",
    width: 170,
    content: ({ row }: { row: PropData }) => <code>{row.prop}</code>
  },
  {
    key: "type",
    header: "Type",
    minWidth: 120,
    maxWidth: 170,
    content: ({ row }: { row: PropData }) => <code>{row.type}</code>
  },
  {
    key: "required",
    header: "Required",
    width: 100,
    content: ({ row }: { row: PropData }) => (
      <FontAwesomeIcon
        icon={row.required ? faCheckCircle : faTimesCircle}
        color={row.required ? "#21ba45" : "#767676"}
      />
    )
  },
  {
    key: "default",
    header: "Default",
    width: 100,
    content: ({ row }) => (row.default ? <code>{row.default}</code> : null)
  },
  {
    key: "description",
    header: "Description",
    content: ({ row }: { row: PropData }) => row.description
  }
];

const data: PropData[] = [
  {
    prop: "data",
    type: "object[]",
    required: true,
    description: "The array of items that are going to be displayed.",
    content: () => (
      <p>
        This is an array of objects that you want to display in a table. The items in this list must be defined and
        cannot be <InlineCode>null</InlineCode>, <InlineCode>undefined</InlineCode>, or any other primitives or classes.
      </p>
    )
  },
  {
    prop: "columns",
    type: "object[]",
    required: true,
    description: "The list of columns",
    content: () => (
      <>
        <p>Each column object must satisfy the conditions layed out in the table below.</p>
        <ColumnPropsTable />
      </>
    )
  },
  {
    prop: "className",
    type: "string",
    description: "additional classNames"
  },
  {
    prop: "tableHeight",
    type: "number",
    description:
      "The height of the table in pixels. If no height is specified, this will try to fill the height of the parent. If the parent node does not have a height specified, a height for the table will be calculated based on the default header height and the rowHeight or the defaultRowHeight (37)."
  },
  {
    prop: "minTableHeight",
    type: "number",
    description: "The min height of the table in pixels."
  },
  {
    prop: "maxTableHeight",
    type: "number",
    description: "The max height of the table in pixels. If tableHeight is specified, this is ignored."
  },
  {
    prop: "tableWidth",
    type: "number",
    description: "The width of the table in pixels"
  },
  {
    prop: "rowHeight",
    type: "number",
    description: "This is a fixed height of each row. Subcomponents will not be affected by this value"
  },
  {
    prop: "headerHeight",
    type: "number",
    description: "This is an optional fixed height of the header"
  },
  {
    prop: "footerHeight",
    type: "number",
    description: "This is an optional fixed height of the footer"
  },
  {
    prop: "minColumnWidth",
    type: "number",
    description: "The default column width for the entire table",
    default: 80
  },
  {
    prop: "sortColumn",
    type: "string",
    description: "The column that is sorted by default (can be controlled)"
  },
  {
    prop: "sortDirection",
    type: '"ASC" | "DESC" | null',
    description: "The direction of the sorted column (can be controlled)"
  },
  {
    prop: "onSort",
    type: "function",
    expandedType: () => <code>{"function(col: string, dir: string) => void"}</code>,
    description: "The callback function when a sortable column is clicked",
    content: () => (
      <div>
        The arguments <InlineCode>col</InlineCode> and <InlineCode>dir</InlineCode> are the clicked column and the new
        sortDirection. These values are <code>null</code> after a descending column is clicked.
      </div>
    )
  },
  {
    prop: "style",
    type: "object",
    description: "Add custom css styles to the outer table element"
  },
  {
    prop: "headerStyle",
    type: "object",
    description: "Add custom css styles to the table header"
  },
  {
    prop: "headerClassname",
    type: "string",
    description: "Add custom css className to the table header"
  },
  {
    prop: "rowStyle",
    type: "object | (index: number) => object",
    description:
      "Add custom css styles to each row element. One can also pass in a function that takes in the row number in order to provide custom styling for particular rows."
  },
  {
    prop: "rowClassname",
    type: "string | (index: number) => string",
    description:
      "Add custom css className to each row element. One can also pass in a function that takes in the row number in order to provide custom styling for particular rows."
  },
  {
    prop: "rowContainerStyle",
    type: "object | (index: number) => object",
    description:
      "Add custom css styles to each row container element. One can also pass in a function that takes in the row number in order to provide custom styling for particular rows."
  },
  {
    prop: "rowContainerClassname",
    type: "string | (index: number) => string",
    description:
      "Add custom css className to each row container element. One can also pass in a function that takes in the row number in order to provide custom styling for particular rows."
  },
  {
    prop: "subComponent",
    type: "Element",
    description: "The element that is rendered on a table with row expansion"
  },
  {
    prop: "onRowClick",
    type: "(e: Event, { index: number }) => void",
    description: "optional click handler for the rows in the table"
  },
  {
    prop: "rowRenderer",
    type: "(props: CellElement) => Element",
    description:
      "A custom element used to wrap an entire row. This provides another way of customizing each row of the table"
  },
  {
    prop: "footerComponent",
    type: "(props: FooterProps) => Element",
    description: "You can provide an optional footer"
  },
  {
    prop: "footerStyle",
    type: "object",
    description: "Add custom css styles to the table footer"
  },
  {
    prop: "footerClassname",
    type: "string",
    description: "Add custom css className to the table footer"
  },
  {
    prop: "stickyFooter",
    type: "boolean",
    description: "Controls whether or not the footer is sticky. This does nothing if footerComponent is not specified.",
    default: "false"
  }
];

const required = data.filter(i => i.required);
const optional = data.filter(i => !i.required);

const headerSnippet = `
const CustomHeader = ({ name, ...props}) => {
  // props contains at least: style, onClick, sortDirection
  return (
    <div {...props}>{name}</div>
  );
}

const columns = [{
  key: "ID",
  width: 100,
  header: props => <CustomHeader name="ID" {...props} />
}];

const Example = () => <Table data={data} columns={columns} />;
`;

const cellSnippet = `
const Contact = ({ row, style }) => {
  const [showInfo, setShowInfo] = useState(false);

  const label = \`\${showInfo ? "hide" : "show"} contact info\`;
  const options = [
    { key: "email", value: row.email },
    { key: "address", value: row.address }
  ];

  const onChange = () => setShowInfo(!showInfo);

  return <Accordion style={style} label={label} options={options} onChange={onChange} />;
};

const columns = [{
  key: "contact",
  width: 100,
  header: "Contact",
  content: Contact
}];

const Example = () => <Table data={data} columns={columns} />;
`;

const expanderSnippet = `
const Expander = ({ isExpanded, onClick }) => {
  const icon = \`chevron \${isExpanded ? "up" : "down"}\`;
  return <Icon name={icon} onClick={onClick} />
};

const columns = [
  { key: "", width: 40, expander: Expander },
  { key: "firstName", width: 100, header: "First" }
];

const Example = () => <Table data={data} columns={columns} subComponent={SubComponent} />;
`;

const Props = () => {
  useTitle("");
  useSource("");
  return (
    <div className="h-full overflow-auto bg-white p-4">
      <div className="mb-3.5 flex items-end">
        <FontAwesomeIcon icon={faReact} color="#2185d0" size="4x" />
        <div className="text-xl font-bold">
          <code>{"<Table>"}</code> Props
          <div className="text-sm font-normal">
            All the props for the <code>{"<Table>"}</code> component
          </div>
        </div>
      </div>
      <Table
        data={data}
        columns={columns}
        tableHeight={500}
        className="border border-solid border-[#ececec] [&_.rft-cell:last]:border-none [&_.rft-cell]:border-r [&_.rft-cell]:border-solid [&_.rft-cell]:border-r-[#ececec] [&_.rft-header-cell-text]:text-[#ff79c5] [&_.rft-header-cell:last]:border-none [&_.rft-header-cell]:border-r [&_.rft-header-cell]:border-solid [&_.rft-header-cell]:border-r-[#ececec] [&_.rft-header]:bg-[#282a36]"
      />
      <div className="my-8 border-b border-t border-solid border-b-[rgba(255,255,255,.1)] border-t-[rgba(34,36,38,.15)]" />
      <div className="mb-3.5 mt-6 border-b-2 border-solid border-[#db2828] pb-1 text-lg font-bold leading-[1.28571429em] text-[#db2828]">
        Required Props
      </div>
      <div role="list" className="my-4">
        {required.map(d => (
          <div
            key={d.prop}
            role="listitem"
            className="list-item w-full table-fixed list-none border-t border-solid border-[rgba(34,36,38,.15)] py-[.21428571em] leading-[1.14285714em] first:border-t-0 first:pt-0"
          >
            <div className="font-bold text-[rgba(0,0,0,.87)]">
              <code>{d.prop}</code>: <code>{d.type}</code>
            </div>
            {!d.content ? null : typeof d.content === "string" ? d.content : d.content()}
          </div>
        ))}
      </div>
      <div className="mb-3.5 mt-6 border-b-2 border-solid border-[#767676] pb-1 text-[0.9375rem] text-lg font-bold leading-[1.28571429em] text-[#767676]">
        HeaderElement, CellElement, and ExpanderElement
      </div>
      <div role="list" className="my-4">
        <div
          role="listitem"
          className="list-item w-full table-fixed list-none border-t border-solid border-[rgba(34,36,38,.15)] py-[.21428571em] leading-[1.14285714em] first:border-t-0 first:pt-0"
        >
          <div className="font-bold text-[rgba(0,0,0,.87)]">
            <code>HeaderElement</code>:{" "}
            <code>{"({ style: object, onClick: Function, sortDirection: string | null }) => React.Element"}</code>
          </div>
          <div className="leading-[1.14285714em]">
            The HeaderElement is an element that takes in props that contains a style, onclick, and sortDirection. See
            below for an example:
          </div>
          <Snippet copy={false} code={headerSnippet} />
        </div>
        <div
          role="listitem"
          className="list-item w-full table-fixed list-none border-t border-solid border-[rgba(34,36,38,.15)] py-[.21428571em] leading-[1.14285714em] first:border-t-0 first:pt-0"
        >
          <div className="font-bold text-[rgba(0,0,0,.87)]">
            <code>CellElement</code>: <code>{"({ row: object, index: number, style?: React.CSSProperties"}</code>
          </div>
          <div className="leading-[1.14285714em]">
            The CellElement is an element that takes in props that contains the row object itself, the index in the data
            array, and a function to reset the rowHeight (if needed). See below for an example:
          </div>
          <Snippet copy={false} code={cellSnippet} />
        </div>
        <div
          role="listitem"
          className="list-item w-full table-fixed list-none border-t border-solid border-[rgba(34,36,38,.15)] py-[.21428571em] leading-[1.14285714em] first:border-t-0 first:pt-0"
        >
          <div className="font-bold text-[rgba(0,0,0,.87)]">
            <code>ExpanderElement</code>:{" "}
            <code>{"({ isExpanded: boolean, onClick: () => void }) => React.Element"}</code>
          </div>
          <div className="leading-[1.14285714em]">
            The ExpandedElement is an element that takes in props that contains whether or not the row is expanded, as
            well as a function to toggle the row expansion. See below for an example:
          </div>
          <Snippet copy={false} code={expanderSnippet} />
        </div>
      </div>
      <div className="mb-3.5 mt-6 border-b-2 border-solid border-[#767676] pb-1 text-[0.9375rem] text-lg font-bold leading-[1.28571429em] text-[#767676]">
        Optional Props
      </div>
      <div role="list" className="my-4">
        {optional.map(d => (
          <div
            key={d.prop}
            role="listitem"
            className="list-item w-full table-fixed list-none border-t border-solid border-[rgba(34,36,38,.15)] py-[.21428571em] leading-[1.14285714em] first:border-t-0 first:pt-0"
          >
            <div className="font-bold text-[rgba(0,0,0,.87)]">
              <code>{d.prop}</code>: {d.expandedType ? d.expandedType() : <code>{d.type}</code>}
            </div>
            {!d.content ? <p>{d.description}</p> : typeof d.content === "string" ? d.content : d.content()}
          </div>
        ))}
      </div>
      <div className="mb-3.5 mt-6 border-b-2 border-solid border-[#767676] pb-1 text-[0.9375rem] text-lg font-bold leading-[1.28571429em] text-[#767676]">
        Types & Interfaces
      </div>
      <Snippet copy={false} code={typeString} />
    </div>
  );
};

export default Props;
