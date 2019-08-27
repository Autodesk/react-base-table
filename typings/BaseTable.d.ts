import * as React from 'react';

import { SortOrderValue } from './SortOrder';
import Column from './Column';

export interface IBaseTableProps {
  /**
   * Prefix for table's inner className
   */
  classPrefix?: string;
  /**
   * Class name for the table
   */
  className?: string;
  /**
   * Custom style for the table
   */
  style?: React.CSSProperties;
  /**
   * A collection of Column
   */
  children?: React.ReactNode;
  /**
   * Columns for the table
   */
  columns?: any[];
  /**
   * The data for the table
   */
  data?: any[];
  /**
   * The data be frozen to top, `rowIndex` is negative and started from `-1`
   */
  frozenData?: any[];
  /**
   * The key field of each data item
   */
  rowKey?: string | number;
  /**
   * The width of the table
   */
  width: number;
  /**
   * The height of the table, will be ignored if `maxHeight` is set
   */
  height?: number;
  /**
   * The max height of the table, the table's height will auto change when data changes,
   * will turns to vertical scroll if reaches the max height
   */
  maxHeight?: number;
  /**
   * The height of each table row
   */
  rowHeight?: number;
  /**
   * The height of the table header, set to 0 to hide the header, could be an array to render multi headers.
   */
  headerHeight?: number | number[];
  /**
   * The height of the table footer
   */
  footerHeight?: number;
  /**
   * Whether the width of the columns are fixed or flexible
   */
  fixed?: boolean;
  /**
   * Whether the table is disabled
   */
  disabled?: boolean;
  /**
   * Custom renderer on top of the table component
   */
  overlayRenderer?: React.ReactNode | JSX.Element;
  /**
   * Custom renderer when the length of data is 0
   */
  emptyRenderer?: React.ReactNode | JSX.Element;
  /**
   * Custom footer renderer, available only if `footerHeight` is larger then 0
   */
  footerRenderer?: React.ReactNode | JSX.Element;
  /**
   * Custom header renderer
   * The renderer receives props `{ cells, columns, headerIndex }`
   */
  headerRenderer?: React.ReactNode | JSX.Element;
  /**
   * Custom row renderer
   * The renderer receives props `{ isScrolling, cells, columns, rowData, rowIndex, depth }`
   */
  rowRenderer?: React.ReactNode | JSX.Element;
  /**
   * Class name for the table header, could be a callback to return the class name
   * The callback is of the shape of `({ columns, headerIndex }) => string`
   */
  headerClassName?: string | ((args: { columns: any[]; headerIndex: number }) => string);
  /**
   * Class name for the table row, could be a callback to return the class name
   * The callback is of the shape of `({ columns, rowData, rowIndex }) => string`
   */
  rowClassName?: string | ((args: { columns: any[]; rowData: any; rowIndex: number }) => string);
  /**
   * Extra props applied to header element
   * The handler is of the shape of `({ columns, headerIndex }) object`
   */
  headerProps?: object | ((props: { columns: any[]; headerIndex: number }) => any);
  /**
   * Extra props applied to header cell element
   * The handler is of the shape of `({ columns, column, columnIndex, headerIndex }) => object`
   */
  headerCellProps?: object | ((props: { columns: any[]; column: any; headerIndex: number }) => any);
  /**
   * Extra props applied to row element
   * The handler is of the shape of `({ columns, rowData, rowIndex }) => object`
   */
  rowProps?: object | ((props: { columns: any[]; rowData: any; rowIndex: number }) => any);
  /**
   * Extra props applied to row cell element
   * The handler is of the shape of `({ columns, column, columnIndex, rowData, rowIndex }) => object`
   */
  cellProps?:
    | object
    | ((props: { columns: any[]; column: any; columnIndex: number; rowData: any; rowIndex: number }) => any);
  /**
   * Extra props applied to ExpandIcon component
   * The handler is of the shape of `({ rowData, rowIndex, depth, expandable, expanded }) => object`
   */
  expandIconProps?:
    | object
    | ((props: { rowData: any; rowIndex: number; depth: number; expandable: boolean; expanded: boolean }) => any);
  /**
   * The key for the expand column which render the expand icon if the data is a tree
   */
  expandColumnKey?: string;
  /**
   * Default expanded row keys when initialize the table
   */
  defaultExpandedRowKeys?: Array<string | number>;
  /**
   * Controlled expanded row keys
   */
  expandedRowKeys?: Array<string | number>;
  /**
   * A callback function when expand or collapse a tree node
   * The handler is of the shape of `({ expanded, rowData, rowIndex, rowKey }) => *`
   */
  onRowExpand?: (args: { expanded: boolean; rowData: any; rowIndex: number; rowKey: number | string }) => void;
  /**
   * A callback function when the expanded row keys changed
   * The handler is of the shape of `(expandedRowKeys) => *`
   */
  onExpandedRowsChange?: (expandedRowKeys: Array<string | number>) => void;
  /**
   * The sort state for the table, will be ignored if `sortState` is set
   */
  sortBy?: {
    /**
     * Sort key
     */
    key?: string;
    /**
     * Sort order
     */
    order?: SortOrderValue;
  };
  /**
   * Multiple columns sort state for the table
   *
   * example:
   * ```js
   * {
   *   'column-0': SortOrder.ASC,
   *   'column-1': SortOrder.DESC,
   * }
   * ```
   */
  sortState?: { [key: string]: SortOrderValue | null };
  /**
   * A callback function for the header cell click event
   * The handler is of the shape of `({ column, key, order }) => *`
   */
  onColumnSort?: (args: { column: any; key: number | string; order: SortOrderValue }) => void;
  /**
   * A callback function when resizing the column width
   * The handler is of the shape of `({ column, width }) => *`
   */
  onColumnResize?: (...args: any[]) => any;
  /**
   * Adds an additional isScrolling parameter to the row renderer.
   * This parameter can be used to show a placeholder row while scrolling.
   */
  useIsScrolling?: boolean;
  /**
   * Number of rows to render above/below the visible bounds of the list
   */
  overscanRowCount?: number;
  /**
   * Custom scrollbar size measurement
   */
  getScrollbarSize?: (...args: any[]) => any;
  /**
   * A callback function when scrolling the table
   * The handler is of the shape of `({ scrollLeft, scrollTop, horizontalScrollDirection, verticalScrollDirection, scrollUpdateWasRequested }) => *`
   *
   * `scrollLeft` and `scrollTop` are numbers.
   *
   * `horizontalDirection` and `verticalDirection` are either `forward` or `backward`.
   *
   * `scrollUpdateWasRequested` is a boolean. This value is true if the scroll was caused by `scrollTo*`,
   * and false if it was the result of a user interaction in the browser.
   */
  onScroll?: (...args: any[]) => any;
  /**
   * A callback function when scrolling the table within `onEndReachedThreshold` of the bottom
   * The handler is of the shape of `({ distanceFromEnd }) => *`
   */
  onEndReached?: (...args: any[]) => any;
  /**
   * Threshold in pixels for calling `onEndReached`.
   */
  onEndReachedThreshold?: number;
  /**
   * A callback function with information about the slice of rows that were just rendered
   * The handler is of the shape of `({ overscanStartIndex, overscanStopIndex, startIndex， stopIndex }) => *`
   */
  onRowsRendered?: (...args: any[]) => any;
  /**
   * A callback function when the scrollbar presence state changed
   * The handler is of the shape of `({ size, vertical, horizontal }) => *`
   */
  onScrollbarPresenceChange?: (...args: any[]) => any;
  /**
   * A object for the row event handlers
   * Each of the keys is row event name, like `onClick`, `onDoubleClick` and etc.
   * Each of the handlers is of the shape of `({ rowData, rowIndex, rowKey, event }) => object`
   */
  rowEventHandlers?: Record<
    string,
    (args: { rowData: any; rowIndex: number; rowKey: number | string; event: any }) => any
  >;
  /**
   * A object for the custom components, like `ExpandIcon` and `SortIndicator`
   */
  components?: {
    TableCell?: (...args: any[]) => any;
    TableHeaderCell?: (...args: any[]) => any;
    ExpandIcon?: (...args: any[]) => any;
    SortIndicator?: (...args: any[]) => any;
  };
}

export default class BaseTable extends React.PureComponent<IBaseTableProps> {
  public static readonly Column: typeof Column;
  public static readonly PlaceholderKey: string;
}
