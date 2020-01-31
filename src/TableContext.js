import React, { createContext, useReducer } from "react";
import PropTypes from "prop-types";

const TableContext = createContext();

const baseState = {
  expanded: {}
};

const findColumnWidthConstants = columns => {
  return columns.reduce(
    (pv, c) => ({
      fixedWidth: pv.fixedWidth + (c.width || 0),
      remainingCols: pv.remainingCols + (c.width === undefined ? 1 : 0)
    }),
    { fixedWidth: 0, remainingCols: 0 }
  );
};

const TableContextProvider = ({ children, initialState }) => {
  const reducer = (state, action) => {
    switch (action.type) {
      case "updateSortedColumn":
        return { ...state, sortColumn: action.col, sortDirection: action.dir };
      case "updateExpanded":
        return {
          ...state,
          expanded: { ...state.expanded, [action.key]: !state.expanded[action.key] }
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, {
    ...baseState,
    ...initialState,
    ...findColumnWidthConstants(initialState.columns)
  });

  return <TableContext.Provider value={{ state, dispatch }}>{children}</TableContext.Provider>;
};

TableContextProvider.propTypes = {
  children: PropTypes.any,
  initialState: PropTypes.object
};

export { TableContext, TableContextProvider };
