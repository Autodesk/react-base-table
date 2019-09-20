import React from 'react';
import PropTypes from 'prop-types';
import Column from './Column';
import ExpandIcon from './ExpandIcon';
import ColumnManager from './ColumnManager';
import { getScrollbarSize as defaultGetScrollbarSize, noop } from './utils';
declare const DEFAULT_COMPONENTS: {
    TableCell: React.FunctionComponent<import("./TableCell").TableCellProps<any>>;
    TableHeaderCell: React.FunctionComponent<import("./TableHeaderCell").TableHeaderCellProps<any>>;
    ExpandIcon: typeof ExpandIcon;
    SortIndicator: React.FunctionComponent<import("./SortIndicator").SortIndicatorProps>;
};
export interface BaseTableProps {
    [k: string]: any;
}
interface BaseTableState {
    scrollbarSize: number;
    hoveredRowKey: null;
    resizingKey: null;
    resizingWidth: number;
    expandedRowKeys: any[];
}
/**
 * React table component
 */
export default class BaseTable extends React.PureComponent<BaseTableProps, BaseTableState> {
    static readonly Column: typeof Column;
    static readonly PlaceholderKey: string;
    static defaultProps: {
        classPrefix: string;
        rowKey: string;
        data: never[];
        frozenData: never[];
        fixed: boolean;
        headerHeight: number;
        rowHeight: number;
        footerHeight: number;
        defaultExpandedRowKeys: never[];
        sortBy: {};
        useIsScrolling: boolean;
        overscanRowCount: number;
        onEndReachedThreshold: number;
        getScrollbarSize: typeof defaultGetScrollbarSize;
        onScroll: typeof noop;
        onRowsRendered: typeof noop;
        onScrollbarPresenceChange: typeof noop;
        onRowExpand: typeof noop;
        onExpandedRowsChange: typeof noop;
        onColumnSort: typeof noop;
        onColumnResize: typeof noop;
    };
    static propTypes: {
        /**
         * Prefix for table's inner className
         */
        classPrefix: PropTypes.Requireable<string>;
        /**
         * Class name for the table
         */
        className: PropTypes.Requireable<string>;
        /**
         * Custom style for the table
         */
        style: PropTypes.Requireable<object>;
        /**
         * A collection of Column
         */
        children: PropTypes.Requireable<PropTypes.ReactNodeLike>;
        /**
         * Columns for the table
         */
        columns: PropTypes.Requireable<(PropTypes.InferProps<{
            className: PropTypes.Requireable<string | ((...args: any[]) => any)>;
            headerClassName: PropTypes.Requireable<string | ((...args: any[]) => any)>;
            style: PropTypes.Requireable<object>;
            title: PropTypes.Requireable<string>;
            dataKey: PropTypes.Requireable<string>; /**
             * Custom renderer on top of the table component
             */
            dataGetter: PropTypes.Requireable<(...args: any[]) => any>;
            align: PropTypes.Requireable<string>;
            flexGrow: PropTypes.Requireable<number>;
            flexShrink: PropTypes.Requireable<number>;
            width: PropTypes.Validator<number>;
            maxWidth: PropTypes.Requireable<number>;
            minWidth: PropTypes.Requireable<number>;
            frozen: PropTypes.Requireable<string | boolean>;
            hidden: PropTypes.Requireable<boolean>;
            resizable: PropTypes.Requireable<boolean>;
            sortable: PropTypes.Requireable<boolean>;
            cellRenderer: PropTypes.Requireable<string | PropTypes.ReactElementLike | ((props: any, context?: any) => any) | (new (props: any, context?: any) => any)>;
            headerRenderer: PropTypes.Requireable<string | PropTypes.ReactElementLike | ((props: any, context?: any) => any) | (new (props: any, context?: any) => any)>;
        }> | null | undefined)[]>;
        /**
         * The data for the table
         */
        data: PropTypes.Validator<(object | null | undefined)[]>;
        /**
         * The data be frozen to top, `rowIndex` is negative and started from `-1`
         */
        frozenData: PropTypes.Requireable<(object | null | undefined)[]>;
        /**
         * The key field of each data item
         */
        rowKey: PropTypes.Validator<string | number>;
        /**
         * The width of the table
         */
        width: PropTypes.Validator<number>;
        /**
         * The height of the table, will be ignored if `maxHeight` is set
         */
        height: PropTypes.Requireable<number>;
        /**
         * The max height of the table, the table's height will auto change when data changes,
         * will turns to vertical scroll if reaches the max height
         */
        maxHeight: PropTypes.Requireable<number>;
        /**
         * The height of each table row
         */
        rowHeight: PropTypes.Validator<number>;
        /**
         * The height of the table header, set to 0 to hide the header, could be an array to render multi headers.
         */
        headerHeight: PropTypes.Validator<number | (number | null | undefined)[]>;
        /**
         * The height of the table footer
         */
        footerHeight: PropTypes.Requireable<number>;
        /**
         * Whether the width of the columns are fixed or flexible
         */
        fixed: PropTypes.Requireable<boolean>;
        /**
         * Whether the table is disabled
         */
        disabled: PropTypes.Requireable<boolean>;
        /**
         * Custom renderer on top of the table component
         */
        overlayRenderer: PropTypes.Requireable<string | PropTypes.ReactElementLike | ((props: any, context?: any) => any) | (new (props: any, context?: any) => any)>;
        /**
         * Custom renderer when the length of data is 0
         */
        emptyRenderer: PropTypes.Requireable<string | PropTypes.ReactElementLike | ((props: any, context?: any) => any) | (new (props: any, context?: any) => any)>;
        /**
         * Custom footer renderer, available only if `footerHeight` is larger then 0
         */
        footerRenderer: PropTypes.Requireable<string | PropTypes.ReactElementLike | ((props: any, context?: any) => any) | (new (props: any, context?: any) => any)>;
        /**
         * Custom header renderer
         * The renderer receives props `{ cells, columns, headerIndex }`
         */
        headerRenderer: PropTypes.Requireable<string | PropTypes.ReactElementLike | ((props: any, context?: any) => any) | (new (props: any, context?: any) => any)>;
        /**
         * Custom row renderer
         * The renderer receives props `{ isScrolling, cells, columns, rowData, rowIndex, depth }`
         */
        rowRenderer: PropTypes.Requireable<string | PropTypes.ReactElementLike | ((props: any, context?: any) => any) | (new (props: any, context?: any) => any)>;
        /**
         * Class name for the table header, could be a callback to return the class name
         * The callback is of the shape of `({ columns, headerIndex }) => string`
         */
        headerClassName: PropTypes.Requireable<string | ((...args: any[]) => any)>;
        /**
         * Class name for the table row, could be a callback to return the class name
         * The callback is of the shape of `({ columns, rowData, rowIndex }) => string`
         */
        rowClassName: PropTypes.Requireable<string | ((...args: any[]) => any)>;
        /**
         * Extra props applied to header element
         * The handler is of the shape of `({ columns, headerIndex }) object`
         */
        headerProps: PropTypes.Requireable<object>;
        /**
         * Extra props applied to header cell element
         * The handler is of the shape of `({ columns, column, columnIndex, headerIndex }) => object`
         */
        headerCellProps: PropTypes.Requireable<object>;
        /**
         * Extra props applied to row element
         * The handler is of the shape of `({ columns, rowData, rowIndex }) => object`
         */
        rowProps: PropTypes.Requireable<object>;
        /**
         * Extra props applied to row cell element
         * The handler is of the shape of `({ columns, column, columnIndex, rowData, rowIndex }) => object`
         */
        cellProps: PropTypes.Requireable<object>;
        /**
         * Extra props applied to ExpandIcon component
         * The handler is of the shape of `({ rowData, rowIndex, depth, expandable, expanded }) => object`
         */
        expandIconProps: PropTypes.Requireable<object>;
        /**
         * The key for the expand column which render the expand icon if the data is a tree
         */
        expandColumnKey: PropTypes.Requireable<string>;
        /**
         * Default expanded row keys when initialize the table
         */
        defaultExpandedRowKeys: PropTypes.Requireable<(string | number | null | undefined)[]>;
        /**
         * Controlled expanded row keys
         */
        expandedRowKeys: PropTypes.Requireable<(string | number | null | undefined)[]>;
        /**
         * A callback function when expand or collapse a tree node
         * The handler is of the shape of `({ expanded, rowData, rowIndex, rowKey }) => *`
         */
        onRowExpand: PropTypes.Requireable<(...args: any[]) => any>;
        /**
         * A callback function when the expanded row keys changed
         * The handler is of the shape of `(expandedRowKeys) => *`
         */
        onExpandedRowsChange: PropTypes.Requireable<(...args: any[]) => any>;
        /**
         * The sort state for the table, will be ignored if `sortState` is set
         */
        sortBy: PropTypes.Requireable<PropTypes.InferProps<{
            /**
             * Sort key
             */
            key: PropTypes.Requireable<string>;
            /**
             * Sort order
             */
            order: PropTypes.Requireable<"desc" | "asc">;
        }>>;
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
        sortState: PropTypes.Requireable<object>;
        /**
         * A callback function for the header cell click event
         * The handler is of the shape of `({ column, key, order }) => *`
         */
        onColumnSort: PropTypes.Requireable<(...args: any[]) => any>;
        /**
         * A callback function when resizing the column width
         * The handler is of the shape of `({ column, width }) => *`
         */
        onColumnResize: PropTypes.Requireable<(...args: any[]) => any>;
        /**
         * Adds an additional isScrolling parameter to the row renderer.
         * This parameter can be used to show a placeholder row while scrolling.
         */
        useIsScrolling: PropTypes.Requireable<boolean>;
        /**
         * Number of rows to render above/below the visible bounds of the list
         */
        overscanRowCount: PropTypes.Requireable<number>;
        /**
         * Custom scrollbar size measurement
         */
        getScrollbarSize: PropTypes.Requireable<(...args: any[]) => any>;
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
        onScroll: PropTypes.Requireable<(...args: any[]) => any>;
        /**
         * A callback function when scrolling the table within `onEndReachedThreshold` of the bottom
         * The handler is of the shape of `({ distanceFromEnd }) => *`
         */
        onEndReached: PropTypes.Requireable<(...args: any[]) => any>;
        /**
         * Threshold in pixels for calling `onEndReached`.
         */
        onEndReachedThreshold: PropTypes.Requireable<number>;
        /**
         * A callback function with information about the slice of rows that were just rendered
         * The handler is of the shape of `({ overscanStartIndex, overscanStopIndex, startIndex， stopIndex }) => *`
         */
        onRowsRendered: PropTypes.Requireable<(...args: any[]) => any>;
        /**
         * A callback function when the scrollbar presence state changed
         * The handler is of the shape of `({ size, vertical, horizontal }) => *`
         */
        onScrollbarPresenceChange: PropTypes.Requireable<(...args: any[]) => any>;
        /**
         * A object for the row event handlers
         * Each of the keys is row event name, like `onClick`, `onDoubleClick` and etc.
         * Each of the handlers is of the shape of `({ rowData, rowIndex, rowKey, event }) => object`
         */
        rowEventHandlers: PropTypes.Requireable<object>;
        /**
         * A object for the custom components, like `ExpandIcon` and `SortIndicator`
         */
        components: PropTypes.Requireable<PropTypes.InferProps<{
            TableCell: PropTypes.Requireable<(...args: any[]) => any>;
            TableHeaderCell: PropTypes.Requireable<(...args: any[]) => any>;
            ExpandIcon: PropTypes.Requireable<(...args: any[]) => any>;
            SortIndicator: PropTypes.Requireable<(...args: any[]) => any>;
        }>>;
    };
    columnManager: ColumnManager;
    _getLeftTableContainerStyle: (...args: any[]) => any;
    _getRightTableContainerStyle: (...args: any[]) => any;
    _flattenOnKeys: (tree: any, keys: any, dataKey: any) => any;
    _depthMap: any;
    _resetColumnManager: (columns: any, fixed: any) => void;
    _scroll: {
        scrollLeft: number;
        scrollTop: number;
    };
    _scrollHeight: number;
    _lastScannedRowIndex: number;
    _hasDataChangedSinceEndReached: boolean;
    _data: any;
    _scrollbarPresenceChanged: boolean;
    _verticalScrollbarSize: number;
    _horizontalScrollbarSize: number;
    tableNode: any;
    table: any;
    leftTable: any;
    rightTable: any;
    constructor(props: Readonly<BaseTableProps>);
    /**
     * Get the DOM node of the table
     */
    getDOMNode(): any;
    /**
     * Get the column manager
     */
    getColumnManager(): ColumnManager;
    /**
     * Get internal `expandedRowKeys` state
     */
    getExpandedRowKeys(): any;
    /**
     * Get the expanded state, fallback to normal state if not expandable.
     */
    getExpandedState(): {
        expandedData: any;
        expandedRowKeys: any;
        expandedDepthMap: any;
    };
    /**
     * Get the total height of all rows, including expanded rows.
     */
    getTotalRowsHeight(): number;
    /**
     * Get the total width of all columns.
     */
    getTotalColumnsWidth(): any;
    /**
     * Forcefully re-render the inner Grid component.
     *
     * Calling `forceUpdate` on `Table` may not re-render the inner Grid since it uses `shallowCompare` as a performance optimization.
     * Use this method if you want to manually trigger a re-render.
     * This may be appropriate if the underlying row data has changed but the row sizes themselves have not.
     */
    forceUpdateTable(): void;
    /**
     * Scroll to the specified offset.
     * Useful for animating position changes.
     *
     * @param {object} offset
     */
    scrollToPosition(offset: {
        scrollLeft?: number;
        scrollTop: any;
    }): void;
    /**
     * Scroll to the specified offset vertically.
     *
     * @param {number} scrollTop
     */
    scrollToTop(scrollTop: number): void;
    /**
     * Scroll to the specified offset horizontally.
     *
     * @param {number} scrollLeft
     */
    scrollToLeft(scrollLeft: number): void;
    /**
     * Scroll to the specified row.
     * By default, the table will scroll as little as possible to ensure the row is visible.
     * You can control the alignment of the row though by specifying an align property. Acceptable values are:
     *
     * - `auto` (default) - Scroll as little as possible to ensure the row is visible.
     * - `smart` - Same as `auto` if it is less than one viewport away, or it's the same as`center`.
     * - `center` - Center align the row within the table.
     * - `end` - Align the row to the bottom side of the table.
     * - `start` - Align the row to the top side of the table.
  
     * @param {number} rowIndex
     * @param {string} align
     */
    scrollToRow(rowIndex?: number, align?: string): void;
    /**
     * Set `expandedRowKeys` manually.
     * This method is available only if `expandedRowKeys` is uncontrolled.
     *
     * @param {array} expandedRowKeys
     */
    setExpandedRowKeys(expandedRowKeys: any): void;
    renderExpandIcon({ rowData, rowIndex, depth, onExpand }: any): JSX.Element | null;
    renderRow({ isScrolling, columns, rowData, rowIndex, style }: any): JSX.Element;
    renderRowCell({ isScrolling, columns, column, columnIndex, rowData, rowIndex, expandIcon }: any): JSX.Element;
    renderHeader({ columns, headerIndex, style }: any): JSX.Element;
    renderHeaderCell({ columns, column, columnIndex, headerIndex, expandIcon }: any): JSX.Element;
    renderMainTable(): JSX.Element;
    renderLeftTable(): JSX.Element | null;
    renderRightTable(): JSX.Element | null;
    renderResizingLine(): JSX.Element | null;
    renderFooter(): JSX.Element | null;
    renderEmptyLayer(): JSX.Element | null;
    renderOverlay(): JSX.Element;
    render(): JSX.Element;
    componentDidMount(): void;
    componentDidUpdate(prevProps: {
        data: any;
        maxHeight: any;
        height: any;
    }): void;
    _prefixClass(className: string): string;
    _setContainerRef(ref: any): void;
    _setMainTableRef(ref: any): void;
    _setLeftTableRef(ref: any): void;
    _setRightTableRef(ref: any): void;
    _getComponent(name: keyof typeof DEFAULT_COMPONENTS): any;
    _getHeaderHeight(): any;
    _getFrozenRowsHeight(): number;
    _getTableHeight(): number;
    _getBodyHeight(): number;
    _getFrozenContainerHeight(): number;
    _calcScrollbarSizes(): void;
    _maybeScrollbarPresenceChange(): void;
    _maybeCallOnEndReached(): void;
    _handleScroll(args: {
        scrollLeft?: number | undefined;
        scrollTop: any;
    }): void;
    _handleVerticalScroll({ scrollTop }: any): void;
    _handleRowsRendered(args: {
        overscanStopIndex: number;
    }): void;
    _handleRowHover({ hovered, rowKey }: any): void;
    _handleRowExpand({ expanded, rowData, rowIndex, rowKey }: any): void;
    _handleColumnResize({ key }: any, width: any): void;
    _handleColumnResizeStart({ key }: any): void;
    _handleColumnResizeStop(): void;
    _handleColumnSort(event: {
        currentTarget: {
            dataset: {
                key: any;
            };
        };
    }): void;
}
export {};
