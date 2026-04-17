import React from 'react';

/** Enum-like constants */
export type SortOrderValue = 'asc' | 'desc';
export type AlignmentValue = 'left' | 'center' | 'right';
export type FrozenDirectionValue = 'left' | 'right' | true | false;

/** Row data */
export type RowKey = string | number;
export interface RowData {
  [key: string]: any;
  children?: RowData[];
}

/** Column shape */
export interface ColumnShape {
  /** Unique identifier for the column */
  key: string;
  /** Class name for the column cell, could be a callback to return the class name */
  className?: string | ((args: CellRendererProps) => string);
  /** Class name for the column header, could be a callback to return the class name */
  headerClassName?: string | ((args: HeaderRendererProps) => string);
  /** Custom style for the column cell, including the header cells */
  style?: React.CSSProperties;
  /** Title for the column header */
  title?: React.ReactNode;
  /** Data key for the column cell, could be "a.b.c" */
  dataKey?: string;
  /** Custom cell data getter */
  dataGetter?: (args: {
    columns: ColumnShape[];
    column: ColumnShape;
    columnIndex: number;
    rowData: RowData;
    rowIndex: number;
  }) => any;
  /** Alignment of the column cell */
  align?: AlignmentValue;
  /** Flex grow style, defaults to 0 */
  flexGrow?: number;
  /** Flex shrink style, defaults to 1 for flexible table and 0 for fixed table */
  flexShrink?: number;
  /** The width of the column, gutter width is not included */
  width: number;
  /** Maximum width of the column, used if the column is resizable */
  maxWidth?: number;
  /** Minimum width of the column, used if the column is resizable */
  minWidth?: number;
  /** Whether the column is frozen and what's the frozen side */
  frozen?: FrozenDirectionValue;
  /** Whether the column is hidden */
  hidden?: boolean;
  /** Whether the column is resizable, defaults to false */
  resizable?: boolean;
  /** Whether the column is sortable, defaults to false */
  sortable?: boolean;
  /** Custom column cell renderer */
  cellRenderer?: React.ComponentType<CellRendererProps> | React.ReactElement;
  /** Custom column header renderer */
  headerRenderer?: React.ComponentType<HeaderRendererProps> | React.ReactElement;
  /** Additional props for the column */
  [key: string]: any;
}

/** Cell renderer props */
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

/** Header renderer props */
export interface HeaderRendererProps {
  columns: ColumnShape[];
  column: ColumnShape;
  columnIndex: number;
  headerIndex: number;
  container?: any;
}

/** Row renderer props */
export interface RowRendererProps {
  isScrolling?: boolean;
  cells: React.ReactNode;
  columns: ColumnShape[];
  rowData: RowData;
  rowIndex: number;
  depth: number;
}

/** Row event handler parameters */
export interface RowEventHandlerParams {
  rowData: RowData;
  rowIndex: number;
  rowKey: RowKey;
  event: React.SyntheticEvent;
}

export type RowEventHandlers = Record<string, (params: RowEventHandlerParams) => void>;

/** Utility type: value or function returning value */
export type CallOrReturn<T, Args extends any[] = any[]> = T | ((...args: Args) => T);

/** Scroll event */
export interface ScrollArgs {
  scrollLeft: number;
  scrollTop: number;
  horizontalScrollDirection?: 'forward' | 'backward';
  verticalScrollDirection?: 'forward' | 'backward';
  scrollUpdateWasRequested?: boolean;
}

/** Rows rendered event */
export interface RowsRenderedArgs {
  overscanStartIndex: number;
  overscanStopIndex: number;
  startIndex: number;
  stopIndex: number;
}

/** Sort by shape */
export interface SortByShape {
  key?: string;
  order?: SortOrderValue;
}

export type SortState = Record<string, SortOrderValue>;

/** Components override */
export interface TableComponents {
  TableCell?: React.ElementType;
  TableHeaderCell?: React.ElementType;
  ExpandIcon?: React.ElementType;
  SortIndicator?: React.ElementType;
}
