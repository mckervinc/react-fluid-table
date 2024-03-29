import React, { createContext, useEffect, useReducer, useRef } from "react";
import { ColumnProps, FooterProps, SortDirection } from "../index";

interface Action {
  type: string;
  col?: string | null;
  dir?: SortDirection;
  key?: string | number;
  widths?: number[];
  initialState?: TableState;
  rows?: any[];
}

interface ReactContext {
  dispatch: React.Dispatch<Action>;
}

interface TableState extends ReactContext {
  rows: any[];
  pixelWidths: number[];
  uuid: string;
  minColumnWidth: number;
  columns: ColumnProps<any>[];
  fixedWidth: number;
  remainingCols: number;
  sortColumn: string | null;
  sortDirection: SortDirection;
  stickyFooter: boolean;
  footerComponent?: (props: FooterProps<any>) => React.ReactNode;
  expanded: {
    [key: string | number]: boolean;
  };
  id?: string;
  onSort?: (col: string | null, dir: SortDirection) => void;
  tableStyle?: React.CSSProperties;
  headerStyle?: React.CSSProperties;
  headerClassname?: string;
  footerStyle?: React.CSSProperties;
  footerClassname?: string;
}

const baseState: TableState = {
  dispatch: () => {},
  expanded: {},
  columns: [],
  pixelWidths: [],
  rows: [],
  uuid: "",
  minColumnWidth: 80,
  fixedWidth: 0,
  remainingCols: 0,
  sortColumn: null,
  sortDirection: null,
  stickyFooter: false
};

type TableStateKey = keyof Omit<TableState, "dispatch">;

const fields: TableStateKey[] = [
  "sortColumn",
  "sortDirection",
  "minColumnWidth",
  "onSort",
  "columns",
  "tableStyle",
  "headerStyle",
  "headerClassname",
  "footerStyle",
  "footerClassname",
  "stickyFooter",
  "footerComponent"
];

const TableContext = createContext<TableState>(baseState);

function findColumnWidthConstants<T>(columns: ColumnProps<T>[]) {
  return columns.reduce(
    (pv, c) => ({
      fixedWidth: pv.fixedWidth + (c.width || 0),
      remainingCols: pv.remainingCols + (c.width === undefined ? 1 : 0)
    }),
    { fixedWidth: 0, remainingCols: 0 }
  );
}

const reducer = (state: TableState, action: Action): TableState => {
  switch (action.type) {
    case "updateSortedColumn":
      return { ...state, sortColumn: action.col || null, sortDirection: action.dir || null };
    case "updateExpanded":
      const key = action.key || "";
      return {
        ...state,
        expanded: { ...state.expanded, [key]: !state.expanded[key] }
      };
    case "updatePixelWidths":
      return { ...state, pixelWidths: action.widths || [] };
    case "updateRows":
      return { ...state, rows: action.rows || [] };
    case "refresh":
      return {
        ...state,
        ...action.initialState
      };
    default:
      return state;
  }
};

const getChangedFields = (
  prevState: Omit<TableState, "dispatch">,
  currState: Omit<TableState, "dispatch">
) => {
  const changedFields = new Set<string>();
  fields.forEach(field => {
    if (prevState[field] !== currState[field]) {
      changedFields.add(field);
    }
  });

  return changedFields;
};

interface ProviderProps {
  children: React.ReactNode;
  initialState: any;
}

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
        // @ts-ignore
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
  }, [initialState]);

  return <TableContext.Provider value={{ ...state, dispatch }}>{children}</TableContext.Provider>;
};

export { TableContext, TableContextProvider };
