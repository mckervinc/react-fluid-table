import React, { createContext, useReducer, useRef, useEffect } from "react";
import { ColumnProps, Generic } from "../index";

type SortFunction = (col: string | null, dir: string | null) => void;
type DispatchFunction = (x: Action) => void;

interface ProviderProps {
  children: any;
  initialState: any;
}

interface State {
  expanded: Generic;
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

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "updateSortedColumn":
      return { ...state, sortColumn: action.col, sortDirection: action.dir };
    case "updateExpanded":
      return {
        ...state,
        expanded: { ...state.expanded, [action.key]: !state.expanded[action.key] }
      };
    case "refresh":
      return {
        ...state,
        ...action.initialState
      };
    default:
      return state;
  }
};

const TableContextProvider = ({ children, initialState }: ProviderProps) => {
  const initialized = useRef(false);
  const [state, dispatch] = useReducer(reducer, {
    ...baseState,
    ...initialState,
    ...findColumnWidthConstants(initialState.columns)
  });

  // if certain props change, update throughout package.
  // allows the user to control props such as sortColumn,
  // columns, etc.
  useEffect(() => {
    if (initialized.current) {
      const refreshed = {
        ...initialState,
        ...findColumnWidthConstants(initialState.columns)
      };

      dispatch({ type: "refresh", initialState: refreshed });
    }
    initialized.current = true;
  }, [initialState]);

  return <TableContext.Provider value={{ state, dispatch }}>{children}</TableContext.Provider>;
};

export { TableContext, TableContextProvider };
