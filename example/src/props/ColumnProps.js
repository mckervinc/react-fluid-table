import React from "react";
import styled from "styled-components";
import { Table } from "react-fluid-table";
import { InlineCode } from "../shared/styles";

const StyledTable = styled(Table)`
  .react-fluid-table-header {
    background-color: #282a36;
  }

  .cell,
  .header-cell {
    border-right: 1px solid #ececec;

    :last-child {
      border-right: none;
    }
  }

  .header-cell-text {
    color: #ff79c5;
  }
`;

const columns = [
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
    content: ({ row }) => row.description
  }
];

const data = [
  {
    prop: "key",
    type: "string",
    description:
      "The key in the data object that has the value. Is also used as the key for the cell."
  },
  {
    prop: "header",
    type: "string | HeaderElement",
    description: (
      <div>
        This is the name of the header. By passing a string, the name of the header is displayed.
        You can also provided a custom element to render the header any way you like. See below for details
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
    prop: "expander",
    type: "boolean | ExpanderElement",
    description: (
      <div>
        If set to <InlineCode>true</InlineCode>, this will render a <code>div</code> with an icon
        that, open click, will expand/collapse the row. When a row is expanded, the{" "}
        <code>subComponent</code>, if provided as a prop on the table, will display for that
        particular row. You can also provide an element to customize the expander icon. See below for details
      </div>
    )
  },
  {
    prop: "cell",
    type: "CellElement",
    description: (
      <div>
        This is a custom cell renderer. If this is specified, the element here will be rendered for
        that cell at the particular row.
      </div>
    )
  }
];

const ColumnPropsTable = () => <StyledTable data={data} columns={columns} tableHeight={400} />;

export default ColumnPropsTable;
