import React from "react";
import { areEqual } from "react-window";
import Row from "./Row";

interface Props {
  index: number;
  data: any;
}

const RowWrapper = React.memo(({ data, index, ...rest }: Props) => {
  const dataIndex = index - 1; // the header is at index 0

  const { rows, ...metaData } = data;
  const row = rows[dataIndex];

  
 

  return !row ? null : <Row row={row} index={dataIndex} {...rest} {...metaData} />;
}, areEqual);

export default RowWrapper;
