import React from 'react';

// --- Enum-like constants ---

export type SortOrderValue = 'asc' | 'desc';

export type AlignmentValue = 'left' | 'center' | 'right';

export type FrozenDirectionValue = 'left' | 'right' | true | false;

// --- Row Data ---

export type RowKey = string | number;

export interface RowData {
  [key: string]: any;
  children?: RowData[];
}

// --- Column Shape ---

export interface ColumnShape {
  key: string;
  className?: string | ((args: CellRendererProps) => string);
  headerClassName?: string | ((args: HeaderRendererProps) => string);
  style?: React.CSSProperties;
  title?: React.ReactNode;
  dataKey?: string;
  dataGetter?: (args: {
    columns: ColumnShape[];
    column: ColumnShape;
    columnIndex: number;
    rowData: RowData;
    rowIndex: number;
  }) => any;
  align?: AlignmentValue;
  flexGrow?: number;
  flexShrink?: number;
  width: number;
  maxWidth?: number;
  minWidth?: number;
  frozen?: FrozenDirectionValue;
  hidden?: boolean;
  resizable?: boolean;
  sortable?: boolean;
  cellRenderer?: React.ComponentType<CellRendererProps> | React.ReactElement;
  headerRenderer?: React.ComponentType<HeaderRendererProps> | React.ReactElement;
  [key: string]: any;
}

// --- Callback / Renderer Props ---

export interface CellRendererProps {
  cellData?: any;
  columns: ColumnShape[];
  column: ColumnShape;
  columnIndex: number;
  rowData: RowData;
  rowIndex: number;
  container?: any;
  isScrolling?: boolean;
}

export interface HeaderRendererProps {
  columns: ColumnShape[];
  column: ColumnShape;
  columnIndex: number;
  headerIndex: number;
  container?: any;
}

export interface RowRendererProps {
  isScrolling?: boolean;
  cells: React.ReactNode;
  columns: ColumnShape[];
  rowData: RowData;
  rowIndex: number;
  depth: number;
}

export interface RowEventHandlerParams {
  rowData: RowData;
  rowIndex: number;
  rowKey: RowKey;
  event: React.SyntheticEvent;
}

export type RowEventHandlers = Record<string, (params: RowEventHandlerParams) => void>;

// --- Utility type: value or function returning value ---

export type CallOrReturn<T, Args extends any[] = any[]> = T | ((...args: Args) => T);

// --- Scroll event ---

export interface ScrollArgs {
  scrollLeft: number;
  scrollTop: number;
  horizontalScrollDirection?: 'forward' | 'backward';
  verticalScrollDirection?: 'forward' | 'backward';
  scrollUpdateWasRequested?: boolean;
}

// --- Rows rendered event ---

export interface RowsRenderedArgs {
  overscanStartIndex: number;
  overscanStopIndex: number;
  startIndex: number;
  stopIndex: number;
}

// --- Sort ---

export interface SortByShape {
  key?: string;
  order?: SortOrderValue;
}

export type SortState = Record<string, SortOrderValue>;

// --- Components override ---

export interface TableComponents {
  TableCell?: React.ElementType;
  TableHeaderCell?: React.ElementType;
  ExpandIcon?: React.ElementType;
  SortIndicator?: React.ElementType;
}
