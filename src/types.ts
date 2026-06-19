import React from 'react';

import type ColumnManager from './ColumnManager';

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
  TableHeaderRow?: React.ElementType;
  ExpandIcon?: React.ElementType;
  SortIndicator?: React.ElementType;
}

// ---------------------------------------------------------------------------
// Component prop interfaces
// ---------------------------------------------------------------------------

/** AutoResizer props */
export interface AutoResizerProps {
  className?: string;
  width?: number;
  height?: number;
  children: (size: { width: number; height: number }) => React.ReactNode;
  onResize?: (size: { width: number; height: number }) => void;
}

/** BaseTable props */
export interface BaseTableProps {
  classPrefix?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  columns?: ColumnShape[];
  data: RowData[];
  frozenData?: RowData[];
  rowKey: string | number;
  width: number;
  height?: number;
  maxHeight?: number;
  rowHeight?: number;
  estimatedRowHeight?: number | ((args: { rowData: RowData; rowIndex: number }) => number);
  headerHeight: number | number[];
  footerHeight?: number;
  fixed?: boolean;
  disabled?: boolean;
  overlayRenderer?: React.ComponentType<any> | React.ReactElement;
  emptyRenderer?: React.ComponentType<any> | React.ReactElement;
  footerRenderer?: React.ComponentType<any> | React.ReactElement;
  headerRenderer?: React.ComponentType<any> | React.ReactElement;
  rowRenderer?: React.ComponentType<any> | React.ReactElement;
  headerClassName?: string | ((args: { columns: ColumnShape[]; headerIndex: number }) => string);
  rowClassName?: string | ((args: { columns: ColumnShape[]; rowData: RowData; rowIndex: number }) => string);
  headerProps?: Record<string, any> | ((args: { columns: ColumnShape[]; headerIndex: number }) => Record<string, any>);
  headerCellProps?:
    | Record<string, any>
    | ((args: {
        columns: ColumnShape[];
        column: ColumnShape;
        columnIndex: number;
        headerIndex: number;
      }) => Record<string, any>);
  rowProps?:
    | Record<string, any>
    | ((args: { columns: ColumnShape[]; rowData: RowData; rowIndex: number }) => Record<string, any>);
  cellProps?:
    | Record<string, any>
    | ((args: {
        columns: ColumnShape[];
        column: ColumnShape;
        columnIndex: number;
        rowData: RowData;
        rowIndex: number;
      }) => Record<string, any>);
  expandIconProps?:
    | Record<string, any>
    | ((args: {
        rowData: RowData;
        rowIndex: number;
        depth: number;
        expandable: boolean;
        expanded: boolean;
      }) => Record<string, any>);
  expandColumnKey?: string;
  defaultExpandedRowKeys?: RowKey[];
  expandedRowKeys?: RowKey[];
  onRowExpand?: (args: { expanded: boolean; rowData: RowData; rowIndex: number; rowKey: RowKey }) => void;
  onExpandedRowsChange?: (expandedRowKeys: RowKey[]) => void;
  sortBy?: SortByShape;
  sortState?: SortState;
  onColumnSort?: (args: { column: ColumnShape; key: string; order: string }) => void;
  onColumnResize?: (args: { column: ColumnShape; width: number }) => void;
  onColumnResizeEnd?: (args: { column: ColumnShape; width: number }) => void;
  useIsScrolling?: boolean;
  overscanRowCount?: number;
  getScrollbarSize?: () => number;
  onScroll?: (args: ScrollArgs) => void;
  onEndReached?: (args: { distanceFromEnd: number }) => void;
  onEndReachedThreshold?: number;
  onRowsRendered?: (args: RowsRenderedArgs) => void;
  onScrollbarPresenceChange?: (args: { size: number; horizontal: boolean; vertical: boolean }) => void;
  rowEventHandlers?: RowEventHandlers;
  ignoreFunctionInColumnCompare?: boolean;
  components?: TableComponents;
}

/** BaseTable imperative handle */
export interface BaseTableHandle {
  getDOMNode: () => HTMLDivElement | null;
  getColumnManager: () => ColumnManager;
  getExpandedRowKeys: () => RowKey[];
  getExpandedState: () => {
    expandedData: RowData[];
    expandedRowKeys: RowKey[];
    expandedDepthMap: Record<string, number>;
  };
  getTotalRowsHeight: () => number;
  getTotalColumnsWidth: () => number;
  forceUpdateTable: () => void;
  resetAfterRowIndex: (rowIndex?: number, shouldForceUpdate?: boolean) => void;
  resetRowHeightCache: () => void;
  scrollToPosition: (offset: { scrollLeft: number; scrollTop: number }) => void;
  scrollToTop: (scrollTop: number) => void;
  scrollToLeft: (scrollLeft: number) => void;
  scrollToRow: (rowIndex?: number, align?: string) => void;
  setExpandedRowKeys: (expandedRowKeys: RowKey[]) => void;
}

/** ColumnResizer props */
export interface ColumnResizerProps extends React.HTMLAttributes<HTMLDivElement> {
  column?: ColumnShape;
  onResizeStart?: (column: ColumnShape) => void;
  onResize?: (column: ColumnShape, width: number) => void;
  onResizeStop?: (column: ColumnShape) => void;
  minWidth?: number;
}

/** ExpandIcon props */
export interface ExpandIconProps extends React.HTMLAttributes<HTMLDivElement> {
  expandable?: boolean;
  expanded?: boolean;
  indentSize?: number;
  depth?: number;
  onExpand?: (expanded: boolean) => void;
}

/** GridTable props */
export interface GridTableProps {
  containerStyle?: React.CSSProperties;
  classPrefix?: string;
  className?: string;
  width: number;
  height: number;
  headerHeight: number | number[];
  headerWidth: number;
  bodyWidth: number;
  rowHeight: number;
  estimatedRowHeight?: number | ((args: { rowData: RowData; rowIndex: number }) => number);
  getRowHeight?: (rowIndex: number) => number;
  columns: ColumnShape[];
  data: RowData[];
  frozenData?: RowData[];
  rowKey: string | number;
  useIsScrolling?: boolean;
  overscanRowCount?: number;
  hoveredRowKey?: RowKey | null;
  style?: React.CSSProperties;
  onScrollbarPresenceChange?: (...args: any[]) => void;
  onScroll?: (...args: any[]) => void;
  onRowsRendered?: (args: any) => void;
  headerRenderer: (args: any) => React.ReactNode;
  rowRenderer: (args: any) => React.ReactNode;
  /** Allow pass-through props forwarded to the underlying Grid component */
  [key: string]: any;
}

/** GridTable imperative handle */
export interface GridTableHandle {
  resetAfterRowIndex: (rowIndex?: number, shouldForceUpdate?: boolean) => void;
  forceUpdateTable: () => void;
  scrollToPosition: (args: { scrollLeft?: number; scrollTop?: number }) => void;
  scrollToTop: (scrollTop: number) => void;
  scrollToLeft: (scrollLeft: number) => void;
  scrollToRow: (rowIndex?: number, align?: string) => void;
  getTotalRowsHeight: () => number;
}

/** SortIndicator props */
export interface SortIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  sortOrder?: SortOrderValue;
}

/** TableCell props */
export interface TableCellProps {
  className?: string;
  cellData?: any;
  column?: ColumnShape;
  columnIndex?: number;
  rowData?: RowData;
  rowIndex?: number;
}

/** TableHeader props */
export interface TableHeaderProps {
  className?: string;
  width: number;
  height: number;
  headerHeight: number | number[];
  rowWidth: number;
  rowHeight: number;
  columns: ColumnShape[];
  data: RowData[];
  frozenData?: RowData[];
  headerRenderer: (args: {
    style: React.CSSProperties;
    columns: ColumnShape[];
    headerIndex: number;
  }) => React.ReactNode;
  rowRenderer: (args: {
    style: React.CSSProperties;
    columns: ColumnShape[];
    rowData: RowData;
    rowIndex: number;
  }) => React.ReactNode;
  hoveredRowKey?: string | number | null;
}

/** TableHeader imperative handle */
export interface TableHeaderHandle {
  scrollTo: (offset: number) => void;
  forceUpdate: () => void;
}

/** TableHeaderCell props */
export interface TableHeaderCellProps {
  className?: string;
  column?: ColumnShape;
  columnIndex?: number;
}

/** TableHeaderRow props */
export interface TableHeaderRowProps {
  isScrolling?: boolean;
  className?: string;
  style?: React.CSSProperties;
  columns: ColumnShape[];
  headerIndex?: number;
  cellRenderer?: (args: any) => React.ReactNode;
  headerRenderer?: React.ComponentType<any> | React.ReactElement | ((props: any) => React.ReactNode);
  expandColumnKey?: string;
  expandIcon?: React.ComponentType<any>;
  tagName?: React.ElementType;
  /** Allow pass-through props forwarded to the tag element */
  [key: string]: any;
}

/** TableRow props */
export interface TableRowProps {
  isScrolling?: boolean;
  className?: string;
  style?: React.CSSProperties;
  columns: ColumnShape[];
  rowData: RowData;
  rowIndex: number;
  rowKey?: RowKey;
  expandColumnKey?: string;
  depth?: number;
  rowEventHandlers?: RowEventHandlers;
  rowRenderer?: React.ComponentType<any> | React.ReactElement | ((props: any) => React.ReactNode);
  cellRenderer?: (args: any) => React.ReactNode;
  expandIconRenderer?: (args: any) => React.ReactNode;
  estimatedRowHeight?: number | ((args: { rowData: RowData; rowIndex: number }) => number);
  getIsResetting?: () => boolean;
  onRowHover?: (args: {
    hovered: boolean;
    rowData: RowData;
    rowIndex: number;
    rowKey: RowKey;
    event: React.SyntheticEvent;
  }) => void;
  onRowExpand?: (args: { expanded: boolean; rowData: RowData; rowIndex: number; rowKey: RowKey }) => void;
  onRowHeightChange?: (rowKey: RowKey, height: number, rowIndex: number, frozen?: any) => void;
  tagName?: React.ElementType;
  /** Allow pass-through props forwarded to the tag element */
  [key: string]: any;
}
