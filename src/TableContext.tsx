import React, { createContext, useReducer } from "react";
import { ColumnProps } from "../index";

type SortFunction = (x: string | null, y: string | null) => void;
type DispatchFunction = (x: Action) => void;

interface ProviderProps {
  children: any;
  initialState: any;
}

interface State {
  expanded: any;
  uuid: string;
  minColumnWidth: number;
  columns: ColumnProps[];
  fixedWidth: number;
  remainingCols: number;
  sortColumn: string | null;
  sortDirection: string | null;
  id?: string;
  onSort?: SortFunction;
}

interface Action {
  type: string;
  [key: string]: any;
}

interface A {
  state: State;
  dispatch: DispatchFunction;
}

const baseState = {
  expanded: {},
  columns: [],
  uuid: "",
  minColumnWidth: 80,
  fixedWidth: 0,
  remainingCols: 0,
  sortColumn: null,
  sortDirection: null
};

const TableContext = createContext<A>({ state: baseState, dispatch: () => {} });

const findColumnWidthConstants = (columns: ColumnProps[]) => {
  return columns.reduce(
    (pv, c) => ({
      fixedWidth: pv.fixedWidth + (c.width || 0),
      remainingCols: pv.remainingCols + (c.width === undefined ? 1 : 0)
    }),
    { fixedWidth: 0, remainingCols: 0 }
  );
};

const TableContextProvider = ({ children, initialState }: ProviderProps) => {
  const reducer = (state: State, action: Action) => {
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

export { TableContext, TableContextProvider };
