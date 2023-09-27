import React from "react";
import { ListChildComponentProps, areEqual } from "react-window";
import Row from "./Row";

interface Props<T> extends Omit<ListChildComponentProps<T>, "data"> {
  data: any;
}

function InnerRowWrapper<T>({ data, index, ...rest }: Props<T>) {
  const dataIndex = index - 1; // the header is at index 0

  const { rows, ...metaData } = data;
  const row: T = rows[dataIndex];

  return !row ? null : <Row row={row} index={dataIndex} {...rest} {...metaData} />;
}

const RowWrapper = React.memo(InnerRowWrapper, areEqual);

RowWrapper.displayName = "RowWrapper";

export default RowWrapper;
