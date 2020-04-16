import React from "react";
import { areEqual } from "react-window";
import Row from "./Row";

interface Props {
  index: number;
  data: any;
  customRowContainer: React.FC;
}

const RowWrapper = React.memo(({ data, index, customRowContainer, ...rest }: Props) => {
  const dataIndex = index - 1; // the header is at index 0

  console.log('updated once more', data, index, customRowContainer);

  const { rows, ...metaData } = data;
  const row = rows[dataIndex];

  return !row ? null : <Row row={row} customRowContainer={customRowContainer} index={dataIndex} {...rest} {...metaData} />;
}, areEqual);

export default RowWrapper;
