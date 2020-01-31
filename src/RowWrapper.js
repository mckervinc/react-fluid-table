import React from "react";
import PropTypes from "prop-types";
import { areEqual } from "react-window";
import Row from "./Row";

const RowWrapper = React.memo(({ data, index, style }) => {
  const dataIndex = index - 1; // the header is at index 0

  const { rows, ...metaData } = data;
  const row = rows[dataIndex] || {};

  return !rows[dataIndex] ? null : <Row row={row} index={dataIndex} style={style} {...metaData} />;
}, areEqual);

RowWrapper.propTypes = {
  index: PropTypes.number,
  style: PropTypes.object,
  data: PropTypes.object
};

export default RowWrapper;
