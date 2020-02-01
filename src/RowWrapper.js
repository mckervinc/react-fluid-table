import React from "react";
import PropTypes from "prop-types";
import { areEqual } from "react-window";
import Row from "./Row";

const RowWrapper = React.memo(({ data, index, ...rest }) => {
  const dataIndex = index - 1; // the header is at index 0

  const { rows, ...metaData } = data;
  const row = rows[dataIndex];

  return !row ? null : <Row row={row} index={dataIndex} {...rest} {...metaData} />;
}, areEqual);

RowWrapper.propTypes = {
  index: PropTypes.number,
  data: PropTypes.object
};

export default RowWrapper;
