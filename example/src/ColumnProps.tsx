import React from "react";
import { ColumnProps, Table } from "react-fluid-table";
import { InlineCode } from "./components/library/InlineCode";

interface PropData {
  prop: string;
  type: string;
  description: React.ReactNode;
  required?: boolean;
  content?: () => React.ReactNode;
  expandedType?: () => React.ReactNode;
  default?: string | number;
}

const columns: ColumnProps<PropData>[] = [
  {
    key: "prop",
    header: "Prop",
    width: 140,
    content: ({ row }) => <code>{row.prop}</code>
  },
  {
    key: "type",
    header: "Type",
    width: 270,
    content: ({ row }) => <code>{row.type}</code>
  },
  {
    key: "description",
    header: "Description",
    content: ({ row }) => <>{row.description}</>
  }
];

const data: PropData[] = [
  {
    prop: "key",
    type: "string",
    description: "The key in the data object that has the value. Is also used as the key for the cell."
  },
  {
    prop: "header",
    type: "string | HeaderElement",
    description: (
      <div>
        This is the name of the header. By passing a string, the name of the header is displayed. You can also provided
        a custom element to render the header any way you like. See below for details
      </div>
    )
  },
  {
    prop: "width",
    type: "number",
    description:
      "This sets the pixel width of the column exactly. If no width is provided, this column will grow based on the remaining available horizontal space (in pixels) and the number of columns that have the width defined."
  },
  {
    prop: "minWidth",
    type: "number",
    description: "This sets the minimum pixel width of the column exactly"
  },
  {
    prop: "maxWidth",
    type: "number",
    description: "This sets the maximum pixel width of the column exactly"
  },
  {
    prop: "sortable",
    type: "boolean",
    description: "This determines if a column is sortable"
  },
  {
    prop: "frozen",
    type: "boolean",
    description: "This determines if a column is frozen"
  },
  {
    prop: "expander",
    type: "boolean | ExpanderElement",
    description: (
      <div>
        If set to <InlineCode>true</InlineCode>, this will render a <code>div</code> with an icon that, open click, will
        expand/collapse the row. When a row is expanded, the <code>subComponent</code>, if provided as a prop on the
        table, will display for that particular row. You can also provide an element to customize the expander icon. See
        below for details
      </div>
    )
  },
  {
    prop: "content",
    type: "CellElement",
    description: (
      <div>
        This property allows you to customize the content inside of a cell. The library will create a cell container for
        you with the proper column widths and resizability. If this field is defined, then this will get rendered inside
        of the cell container.
      </div>
    )
  },
  {
    prop: "cell",
    type: "CellElement",
    description: (
      <div>
        This is a custom cell renderer. If this is specified, the element here will be rendered for that cell at the
        particular row. This will be rendered in place of a cell container, so make sure to use the given{" "}
        <code>style</code> prop to get the calculated cell width. If this property is defined, then <code>content</code>{" "}
        will be igored.
      </div>
    )
  },
  {
    prop: "footer",
    type: "FooterElement",
    description: (
      <div>
        This property allows you to customize the content inside of a footer cell. The library will create a cell
        container for you with the proper column widths and resizability. If this field is defined, then this will get
        rendered inside of the cell container in the footer.
      </div>
    )
  }
];

const ColumnPropsTable = () => (
  <Table
    data={data}
    columns={columns}
    tableHeight={400}
    className="border border-solid border-[#ececec] [&_.rft-cell:last]:border-none [&_.rft-cell]:border-r [&_.rft-cell]:border-solid [&_.rft-cell]:border-r-[#ececec] [&_.rft-header-cell-text]:text-[#ff79c5] [&_.rft-header-cell:last]:border-none [&_.rft-header-cell]:border-r [&_.rft-header-cell]:border-solid [&_.rft-header-cell]:border-r-[#ececec] [&_.rft-header]:bg-[#282a36] [&_.rft-row-container]:border-b [&_.rft-row-container]:border-b-[#ececec] last:[&_.rft-row-container]:border-b-0"
  />
);

export default ColumnPropsTable;
