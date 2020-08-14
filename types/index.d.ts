declare module 'react-base-table' {
  export type SortOrder = 'asc' | 'desc';

  export type Alignment = 'left' | 'right' | 'center';

  export type FrozenDirection = 'left' | 'right' | true | false;

  export type RowKey = string | number;

  export type Size = { width: number; height: number };

  export type CallOrReturn<T, P = any[]> = T | (P extends any[] ? (...p: P) => T : (p: P) => T);

  export interface ColumnShape<T = unknown> {
    key: React.Key;
    /**
     * Class name for the column cell
     */
    className?: CallOrReturn<
      string,
      {
        cellData: any;
        columns: ColumnShape<T>[];
        column: ColumnShape<T>;
        columnIndex: number;
        rowData: T;
        rowIndex: number;
      }
    >;
    /**
     * Class name for the column header
     */
    headerClassName?: CallOrReturn<
      string,
      {
        columns: ColumnShape<T>[];
        column: ColumnShape<T>;
        columnIndex: number;
        headerIndex: number;
      }
    >;
    /**
     * Custom style for the column cell, including the header cells
     */
    style?: React.CSSProperties;
    /**
     * Title of the column header
     */
    title?: string;
    /**
     * Data key for the cell value, could be "a.b.c"
     */
    dataKey?: string;
    /**
     * Custom cell data getter
     * The handler is of the shape of `({ columns, column, columnIndex, rowData, rowIndex }) => node`
     */
    dataGetter?: CallOrReturn<
      React.ReactNode,
      {
        columns: ColumnShape<T>[];
        column: ColumnShape<T>;
        columnIndex: number;
        rowData: T;
        rowIndex: number;
      }
    >;
    /**
     * Alignment of the column cell
     */
    align?: Alignment;
    /**
     * Flex grow style, defaults to 0
     */
    flexGrow?: number;
    /**
     * Flex shrink style, defaults to 1 for flexible table and 0 for fixed table
     */
    flexShrink?: number;
    /**
     * The width of the column, gutter width is not included
     */
    width: number;
    /**
     * Maximum width of the column, used if the column is resizable
     */
    maxWidth?: number;
    /**
     * Minimum width of the column, used if the column is resizable
     */
    minWidth?: number;
    /**
     * Whether the column is frozen and what's the frozen side
     * Could be changed if we decide to allow Frozen.RIGHT
     */
    frozen?: FrozenDirection;
    /**
     * Whether the column is hidden
     */
    hidden?: boolean;
    /**
     * Whether the column is resizable, defaults to false
     */
    resizable?: boolean;
    /**
     * Whether the column is sortable, defaults to false
     */
    sortable?: boolean;
    /**
     * Custom column cell renderer
     * The renderer receives props `{ cellData, columns, column, columnIndex, rowData, rowIndex, container, isScrolling }`
     */
    cellRenderer?: CallOrReturn<
      React.ReactNode,
      {
        cellData: any;
        columns: ColumnShape<T>[];
        column: ColumnShape<T>;
        columnIndex: number;
        rowData: T;
        rowIndex: number;
        container: any;
        isScrolling?: boolean;
      }
    >;
    /**
     * Custom column header renderer
     * The renderer receives props `{ columns, column, columnIndex, headerIndex, container }`
     */
    headerRenderer?: CallOrReturn<
      React.ReactNode,
      {
        columns: ColumnShape<T>[];
        column: ColumnShape<T>;
        columnIndex: number;
        headerIndex: number;
        container: any;
      }
    >;
    [key: string]: any;
  }

  export class Column<T = unknown> extends React.Component<ColumnShape<T>> {
    static readonly Alignment: {
      readonly LEFT: 'left';
      readonly CENTER: 'center';
      readonly RIGHT: 'right';
    };
    static readonly FrozenDirection: {
      readonly LEFT: 'left';
      readonly RIGHT: 'right';
      readonly DEFAULT: true;
      readonly NONE: false;
    };
  }

  export interface BaseTableProps<T = unknown> {
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
    children?: React.ReactElement<T> | React.ReactElement<T>[] | null;
    /**
     * Columns for the table
     */
    columns?: ColumnShape<T>[];
    /**
     * The data for the table
     */
    data?: T[];
    /**
     * The data to be frozen to top, `rowIndex` is negative and starts from `-1`
     */
    frozenData?: T[];
    /**
     * The key field of each data item
     */
    rowKey?: RowKey;
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
     * The height of each table row, will be ignored if `estimatedRowHeight` is set
     */
    rowHeight?: number;
    /**
     * Estimated row height, the real height will be measure dynamically according to the content
     */
    estimatedRowHeight?: number;
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
    overlayRenderer?: CallOrReturn<React.ReactNode>;
    /**
     * Custom renderer when the length of data is 0
     */
    emptyRenderer?: CallOrReturn<React.ReactNode>;
    /**
     * Custom footer renderer, available only if `footerHeight` is larger then 0
     */
    footerRenderer?: CallOrReturn<React.ReactNode>;
    /**
     * Custom header renderer
     * The renderer receives props `{ cells, columns, headerIndex }`
     */
    headerRenderer?: CallOrReturn<
      React.ReactNode,
      {
        cells: React.ReactNode[];
        columns: ColumnShape<T>;
        headerIndex: number;
      }
    >;
    /**
     * Custom row renderer
     * The renderer receives props `{ isScrolling, cells, columns, rowData, rowIndex, depth }`
     */
    rowRenderer?: CallOrReturn<
      React.ReactNode,
      {
        isScrolling?: boolean;
        cells: React.ReactNode[];
        columns: ColumnShape<T>;
        rowData: T;
        rowIndex: number;
        depth: number;
      }
    >;
    /**
     * Class name for the table header, could be a callback to return the class name
     * The callback is of the shape of `({ columns, headerIndex }) => string`
     */
    headerClassName?: CallOrReturn<
      string,
      {
        columns: ColumnShape<T>[];
        headerIndex: number;
      }
    >;
    /**
     * Class name for the table row, could be a callback to return the class name
     * The callback is of the shape of `({ columns, rowData, rowIndex }) => string`
     */
    rowClassName?: CallOrReturn<
      string,
      {
        columns: ColumnShape<T>[];
        rowData: T;
        rowIndex: number;
      }
    >;
    /**
     * Extra props applied to header element
     * The handler is of the shape of `({ columns, headerIndex }) object`
     */
    headerProps?: CallOrReturn<
      object,
      {
        columns: ColumnShape<T>[];
        headerIndex: number;
      }
    >;
    /**
     * Extra props applied to header cell element
     * The handler is of the shape of `({ columns, column, columnIndex, headerIndex }) => object`
     */
    headerCellProps?: CallOrReturn<
      object,
      {
        columns: ColumnShape<T>[];
        column: ColumnShape<T>;
        columnIndex: number;
        headerIndex: number;
      }
    >;
    /**
     * Extra props applied to row element
     * The handler is of the shape of `({ columns, rowData, rowIndex }) => object`
     */
    rowProps?: CallOrReturn<
      object,
      {
        columns: ColumnShape<T>[];
        rowData: T;
        rowIndex: number;
      }
    >;
    /**
     * Extra props applied to row cell element
     * The handler is of the shape of `({ columns, column, columnIndex, rowData, rowIndex }) => object`
     */
    cellProps?: CallOrReturn<
      object,
      {
        columns: ColumnShape<T>[];
        column: ColumnShape<T>;
        columnIndex: number;
        rowData: T;
        rowIndex: number;
      }
    >;
    /**
     * Extra props applied to ExpandIcon component
     * The handler is of the shape of `({ rowData, rowIndex, depth, expandable, expanded }) => object`
     */
    expandIconProps?: CallOrReturn<
      object,
      {
        rowData: T;
        rowIndex: number;
        depth: number;
        expandable: boolean;
        expanded: boolean;
      }
    >;
    /**
     * The key for the expand column which render the expand icon if the data is a tree
     */
    expandColumnKey?: string;
    /**
     * Default expanded row keys when initialize the table
     */
    defaultExpandedRowKeys?: RowKey[];
    /**
     * Controlled expanded row keys
     */
    expandedRowKeys?: RowKey[];
    /**
     * A callback function when expand or collapse a tree node
     * The handler is of the shape of `({ expanded, rowData, rowIndex, rowKey }) => *`
     */
    onRowExpand?: (args: { expanded: boolean; rowData: T; rowIndex: number; rowKey: RowKey }) => void;
    /**
     * A callback function when the expanded row keys changed
     * The handler is of the shape of `(expandedRowKeys) => *`
     */
    onExpandedRowsChange?: (expandedRowKeys: RowKey[]) => void;
    /**
     * The sort state for the table, will be ignored if `sortState` is set
     */
    sortBy?: {
      key: React.Key;
      order: SortOrder;
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
    sortState?: {
      [key: React.Key]: SortOrder;
    };
    /**
     * A callback function for the header cell click event
     * The handler is of the shape of `({ column, key, order }) => *`
     */
    onColumnSort?: (args: { column: ColumnShape<T>; key: React.Key; order: SortOrder }) => void;
    /**
     * A callback function when resizing the column width
     * The handler is of the shape of `({ column, width }) => *`
     */
    onColumnResize?: (args: { column: ColumnShape; width: number }) => void;
    /**
     * A callback function when resizing the column width ends
     * The handler is of the shape of `({ column, width }) => *`
     */
    onColumnResizeEnd?: (args: { column: ColumnShape; width: number }) => void;
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
    getScrollbarSize?: () => number;
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
    onScroll?: (args: {
      scrollLeft: number;
      scrollTop: number;
      horizontalScrollDirection: 'forward' | 'backward';
      verticalScrollDirection: 'forward' | 'backward';
      scrollUpdateWasRequested: boolean;
    }) => void;
    /**
     * A callback function when scrolling the table within `onEndReachedThreshold` of the bottom
     * The handler is of the shape of `({ distanceFromEnd }) => *`
     */
    onEndReached?: (args: { distanceFromEnd: number }) => void;
    /**
     * Threshold in pixels for calling `onEndReached`.
     */
    onEndReachedThreshold?: number;
    /**
     * A callback function with information about the slice of rows that were just rendered
     * The handler is of the shape of `({ overscanStartIndex, overscanStopIndex, startIndex， stopIndex }) => *`
     */
    onRowsRendered?: (args: {
      overscanStartIndex: number;
      overscanStopIndex: number;
      startIndex: number;
      stopIndex: number;
    }) => void;
    /**
     * A callback function when the scrollbar presence state changed
     * The handler is of the shape of `({ size, vertical, horizontal }) => *`
     */
    onScrollbarPresenceChange?: (args: { size: number; vertical: boolean; horizontal: boolean }) => void;
    /**
     * A object for the row event handlers
     * Each of the keys is row event name, like `onClick`, `onDoubleClick` and etc.
     * Each of the handlers is of the shape of `({ rowData, rowIndex, rowKey, event }) => object`
     */
    rowEventHandlers?: {
      [key: string]: (args: { rowData: T; rowIndex: number; rowKey: RowKey; event: React.SyntheticEvent }) => object;
    };
    /**
     * A object for the custom components, like `ExpandIcon` and `SortIndicator`
     */
    components?: TableComponents;
    [key: string]: any;
  }

  export interface TableComponents {
    TableCell?: React.ElementType<{
      className: string;
      isScrolling?: boolean;
      cellData: any;
      columns: ColumnShape[];
      column: ColumnShape;
      columnIndex: number;
      rowData: any;
      rowIndex: number;
      container: any;
    }>;
    TableHeaderCell?: React.ElementType<{
      className: string;
      columns: ColumnShape[];
      column: ColumnShape;
      columnIndex: number;
      headerIndex: number;
      container: any;
    }>;
    ExpandIcon?: React.ElementType<{
      depth: number;
      expandable: boolean;
      expanded: boolean;
      onExpand: (expanded: boolean) => void;
      [key: string]: any;
    }>;
    SortIndicator?: React.ElementType<{
      sortOrder: SortOrder;
      className: string;
    }>;
  }

  export default class BaseTable<T = unknown> extends React.Component<BaseTableProps<T>, any> {
    static readonly Column: typeof Column;
    static readonly PlaceholderKey = '__placeholder__';
  }

  export interface AutoResizerProps {
    /**
     * Class name for the component
     */
    className?: string;
    /**
     * the width of the component, will be the container's width if not set
     */
    width?: number;
    /**
     * the height of the component, will be the container's width if not set
     */
    height?: number;
    /**
     * A callback function to render the children component
     * The handler is of the shape of `({ width, height }) => node`
     */
    children: (size: Size) => React.ReactNode;
    /**
     * A callback function when the size of the table container changed if the width and height are not set
     * The handler is of the shape of `({ width, height }) => *`
     */
    onResize?: (size: Size) => void;
  }

  export const AutoResizer: React.FC<AutoResizerProps>;

  export type getScrollbarSize = (recalculate?: boolean) => number;
  export type isObjectEqual = (objA: object, objB: object) => boolean;
  export type hasChildren = (data: { children: any[] | undefined }) => boolean;
  export type getValue = (obj: object, path: string, defaultValue: any) => any;
  export type normalizeColumns = (elements: React.ReactElement) => React.ReactElement[];
}
