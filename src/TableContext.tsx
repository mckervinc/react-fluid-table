import React, { createContext, useEffect, useReducer, useRef } from "react";
import { ColumnProps, Generic, SortDirection } from "../index";

type SortFunction = (col: string | null, dir: string | null) => void;
type DispatchFunction = (x: Action) => void;

interface ProviderProps {
  children: any;
  initialState: any;
}

interface State {
  pixelWidths: number[];
  expanded: Generic;
  uuid: string;
  minColumnWidth: number;
  columns: ColumnProps<any>[];
  fixedWidth: number;
  remainingCols: number;
  sortColumn: string | null;
  sortDirection: SortDirection | null;
  id?: string;
  onSort?: SortFunction;
  tableStyle?: React.CSSProperties;
  headerStyle?: React.CSSProperties;
}

interface Action {
  type: string;
  [key: string]: any;
}

interface ReactContext {
  state: State;
  dispatch: DispatchFunction;
}

const baseState = {
  expanded: {},
  columns: [],
  pixelWidths: [],
  uuid: "",
  minColumnWidth: 80,
  fixedWidth: 0,
  remainingCols: 0,
  sortColumn: null,
  sortDirection: null
};

const fields = [
  "sortColumn",
  "sortDirection",
  "minColumnWidth",
  "onSort",
  "columns",
  "tableStyle",
  "headerStyle"
];

const TableContext = createContext<ReactContext>({ state: baseState, dispatch: () => {} });

function findColumnWidthConstants<T>(columns: ColumnProps<T>[]) {
  return columns.reduce(
    (pv, c) => ({
      fixedWidth: pv.fixedWidth + (c.width || 0),
      remainingCols: pv.remainingCols + (c.width === undefined ? 1 : 0)
    }),
    { fixedWidth: 0, remainingCols: 0 }
  );
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "updateSortedColumn":
      return { ...state, sortColumn: action.col, sortDirection: action.dir };
    case "updateExpanded":
      return {
        ...state,
        expanded: { ...state.expanded, [action.key]: !state.expanded[action.key] }
      };
    case "updatePixelWidths":
      return { ...state, pixelWidths: action.widths };
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
  fields.forEach(field => {
    if (prevState[field] !== currState[field]) {
      changedFields.add(field);
    }
  });

  return changedFields;
};

const TableContextProvider = ({ children, initialState }: ProviderProps) => {
  // hooks
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
