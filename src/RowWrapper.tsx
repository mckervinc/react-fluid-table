import React from "react";
import { areEqual } from "react-window";
import Row from "./Row";

interface Props {
  index: number;
  data: any;
  CustomRow: React.FC;
}

const RowWrapper = React.memo(({ data, index, CustomRow, ...rest }: Props) => {
  const dataIndex = index - 1; // the header is at index 0

  console.log(data, index);

  const { rows, ...metaData } = data;
  const row = rows[dataIndex];

  if (!row) return null;

  return CustomRow ? <CustomRow row={row} index={dataIndex} {...rest} {...metaData} /> : <Row row={row} index={dataIndex} {...rest} {...metaData} />;
}, areEqual);

export default RowWrapper;
