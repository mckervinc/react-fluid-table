import React, { createContext, useReducer } from "react";
import PropTypes from "prop-types";

const TableContext = createContext();

const baseState = {
  expanded: {}
};

const TableContextProvider = ({ children, initialState }) => {
  const reducer = (state, action) => {
    switch (action.type) {
      case "updateSortedColumn":
        return { ...state, sortColumn: action.col, sortDirection: action.dir };
      case "updateExpanded":
        return { ...state, expanded: { ...state.expanded, [action.key]: !state.expanded[action.key] } };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, { ...baseState, ...initialState });

  return <TableContext.Provider value={{ state, dispatch }}>{children}</TableContext.Provider>;
};

TableContextProvider.propTypes = {
  children: PropTypes.any,
  initialState: PropTypes.object
};

export { TableContext, TableContextProvider };
