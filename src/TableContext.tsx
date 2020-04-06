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

const getChangedFields = (prevState: any, currState: any) => {
  const changedFields = new Set<string>();
  if (prevState.sortColumn !== currState.sortColumn) {
    changedFields.add("sortColumn");
  }

  if (prevState.sortDirection !== currState.sortDirection) {
    changedFields.add("sortDirection");
  }

  if (prevState.minColumnWidth !== currState.minColumnWidth) {
    changedFields.add("minColumnWidth");
  }

  if (prevState.onSort !== currState.onSort) {
    changedFields.add("onSort");
  }

  if (prevState.columns !== currState.columns) {
    changedFields.add("columns");
  }

  return changedFields;
};

const TableContextProvider = ({ children, initialState }: ProviderProps) => {
  const _stateOnMount = useRef(initialState);
  const [state, dispatch] = useReducer(reducer, {
    ...baseState,
    ...initialState,
    ...findColumnWidthConstants(initialState.columns)
  });

  // if certain props change, update throughout package.
  // allows the user to control props such as sortColumn,
  // columns, etc.
  useEffect(() => {
    const changedFields = getChangedFields(_stateOnMount.current, initialState);
    if (changedFields.size) {
      let refreshed: any = {};
      changedFields.forEach(field => {
        refreshed[field] = initialState[field];
      });

      if (refreshed.columns) {
        refreshed = {
          ...refreshed,
          ...findColumnWidthConstants(refreshed.columns)
        };
      }
      _stateOnMount.current = initialState;
      dispatch({ type: "refresh", initialState: refreshed });
    }
  }, [_stateOnMount, initialState]);

  return <TableContext.Provider value={{ state, dispatch }}>{children}</TableContext.Provider>;
};

export { TableContext, TableContextProvider };
