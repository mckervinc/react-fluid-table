import React, { createContext, useEffect, useReducer, useRef } from "react";
import { ColumnProps, FooterProps, SortDirection } from "../index";

type InitialState<T> = Omit<TableState<T>, "dispatch">;

type Action<T> = {
  type: string;
  col?: string | null;
  dir?: SortDirection;
  key?: string | number;
  widths?: number[];
  initialState?: Partial<InitialState<T>>;
  rows?: T[];
};

type TableState<T> = {
  dispatch: React.Dispatch<Action<T>>;
  rows: T[];
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
};

const baseState: TableState<any> = {
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

const fields: (keyof InitialState<any>)[] = [
  "sortColumn",
  "sortDirection",
  "minColumnWidth",
  "onSort",
  "columns",
  "expanded",
  "tableStyle",
  "headerStyle",
  "headerClassname",
  "footerStyle",
  "footerClassname",
  "stickyFooter",
  "footerComponent"
];

const TableContext = createContext(baseState);

function findColumnWidthConstants<T>(columns: ColumnProps<T>[]) {
  return columns.reduce(
    (pv, c) => ({
      fixedWidth: pv.fixedWidth + (c.width || 0),
      remainingCols: pv.remainingCols + (c.width === undefined ? 1 : 0)
    }),
    { fixedWidth: 0, remainingCols: 0 }
  );
}

function reducer<T>(state: TableState<T>, action: Action<T>): TableState<T> {
  // instance
  const { type, col = null, dir = null, key = "", widths = [], rows = [], initialState } = action;

  // switch
  switch (type) {
    case "updateSortedColumn":
      return { ...state, sortColumn: col, sortDirection: dir };
    case "updateExpanded":
      return {
        ...state,
        expanded: { ...state.expanded, [key]: !state.expanded[key] }
      };
    case "updatePixelWidths":
      return { ...state, pixelWidths: widths };
    case "updateRows":
      return { ...state, rows };
    case "refresh":
      return {
        ...state,
        ...initialState
      };
    default:
      return state;
  }
}

function getChangedFields<T>(
  prevState: Partial<InitialState<T>>,
  currState: Partial<InitialState<T>>
) {
  const changedFields = new Set<keyof InitialState<T>>();
  fields.forEach(field => {
    if (prevState[field] !== currState[field]) {
      changedFields.add(field);
    }
  });

  return changedFields;
}

type ProviderProps<T> = {
  children: React.ReactNode;
  initialState: Partial<InitialState<T>>;
};

function TableContextProvider<T>({ children, initialState }: ProviderProps<T>) {
  // hooks
  const _stateOnMount = useRef(initialState);
  const [state, dispatch] = useReducer(reducer, {
    ...baseState,
    ...initialState,
    ...findColumnWidthConstants(initialState.columns as ColumnProps<T>[])
  });

  // if certain props change, update throughout package.
  // allows the user to control props such as sortColumn,
  // columns, etc.
  useEffect(() => {
    const changedFields = getChangedFields(_stateOnMount.current, initialState);
    if (changedFields.size) {
      const refreshed = [...changedFields].reduce(
        (pv, c) => ({ ...pv, [c]: initialState[c] }),
        {}
      ) as InitialState<T>;

      if (refreshed.columns) {
        const { fixedWidth, remainingCols } = findColumnWidthConstants(refreshed.columns);
        refreshed.fixedWidth = fixedWidth;
        refreshed.remainingCols = remainingCols;
      }
      _stateOnMount.current = initialState;
      dispatch({ type: "refresh", initialState: refreshed });
    }
  }, [initialState]);

  return <TableContext.Provider value={{ ...state, dispatch }}>{children}</TableContext.Provider>;
}

export { TableContext, TableContextProvider };
