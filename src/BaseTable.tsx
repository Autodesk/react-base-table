import cn from 'classnames';
import memoize from 'memoize-one';
import React from 'react';
import { Align, GridChildComponentProps } from 'react-window';
import Column, { Alignment, FrozenDirection, IColumnProps } from './Column';
import ColumnManager from './ColumnManager';
import ColumnResizer from './ColumnResizer';
import ExpandIcon, { IExpandIconProps } from './ExpandIcon';
import GridTable, { IHeaderRendererParam } from './GridTable';
import SortIndicator, { TSortIndicator } from './SortIndicator';
import SortOrder from './SortOrder';
import TableCell, { TTableCell } from './TableCell';
import TableHeaderCell, { ITableHeaderCellProps, TTableHeaderCell } from './TableHeaderCell';
import TableHeaderRow, { ITableHeaderRowProps } from './TableHeaderRow';
import TableRow, { ITableRowProps, THandlerCollection } from './TableRow';
import {
  callOrReturn,
  cloneArray,
  flattenOnKeys,
  getScrollbarSize as defaultGetScrollbarSize,
  getValue,
  hasChildren,
  isObjectEqual,
  noop,
  normalizeColumns,
  renderElement,
  throttle,
} from './utils';

import { IColumnEssential, IRowEssential, RowDataType } from './Column';

const getContainerStyle = (width: number, maxWidth: number, height: number) => ({
  width,
  maxWidth,
  height,
  overflow: 'hidden',
});

const DEFAULT_COMPONENTS = {
  TableCell,
  TableHeaderCell,
  ExpandIcon,
  SortIndicator,
};

const RESIZE_THROTTLE_WAIT = 50;

type RendererArgsReduced = Omit<
  GridChildComponentProps & { rowData?: any; columns?: IColumnProps[] },
  'columnIndex' | 'data' | 'rowIndex'
>;
export interface RendererArgs extends RendererArgsReduced {
  rowIndex?: number;
}
/**
 * React table component
 */
class BaseTable<T extends RowDataType = RowDataType, C = any> extends React.PureComponent<
  IBaseTableProps<T>,
  IBaseTableState
> {
  public static Column = Column;
  public static PlaceholderKey = ColumnManager.PlaceholderKey;
  public static defaultProps = {
    classPrefix: 'BaseTable',
    rowKey: 'id',
    data: [] as any[],
    frozenData: [] as any[],
    fixed: false,
    headerHeight: 50,
    rowHeight: 50,
    footerHeight: 0,
    defaultExpandedRowKeys: [] as string[],
    sortBy: {},
    useIsScrolling: false,
    overscanRowCount: 1,
    onEndReachedThreshold: 500,
    getScrollbarSize: defaultGetScrollbarSize,

    onScroll: noop,
    onRowsRendered: noop,
    onScrollbarPresenceChange: noop,
    onRowExpand: noop,
    onExpandedRowsChange: noop,
    onColumnSort: noop,
    onColumnResize: noop,
  };
  private columnManager: ColumnManager;
  private _scrollbarPresenceChanged = false;
  private _scroll = { scrollLeft: 0, scrollTop: 0 };
  private _scrollHeight = 0;
  private _lastScannedRowIndex = -1;
  private _hasDataChangedSinceEndReached = true;
  private _data: any[];
  private _depthMap: { [key: string]: number } = {};
  private _horizontalScrollbarSize = 0;
  private _verticalScrollbarSize = 0;
  private table: GridTable;
  private leftTable: GridTable;
  private rightTable: GridTable;
  private tableNode: HTMLDivElement;
  private _flattenOnKeys: (tree: any[], keys: string[], dataKey: string) => any[];

  private _getLeftTableContainerStyle = memoize(getContainerStyle);
  constructor(props: IBaseTableProps) {
    super(props);

    const { columns, children, expandedRowKeys, defaultExpandedRowKeys } = props;
    this.state = {
      scrollbarSize: 0,
      hoveredRowKey: null,
      resizingKey: null,
      resizingWidth: 0,
      expandedRowKeys: cloneArray(props.expandedRowKeys !== undefined ? expandedRowKeys : defaultExpandedRowKeys),
    };
    this.columnManager = new ColumnManager(columns || normalizeColumns(children), props.fixed);

    this._handleColumnResize = throttle(this._handleColumnResize, RESIZE_THROTTLE_WAIT);
    this._data = props.data;
    this._flattenOnKeys = memoize((tree: any[], keys: string[], dataKey: string) => {
      this._depthMap = {};
      return flattenOnKeys(tree, keys, this._depthMap, dataKey);
    });
  }

  /**
   * Get the DOM node of the table
   */
  public getDOMNode() {
    return this.tableNode;
  }

  /**
   * Get the column manager
   */
  public getColumnManager() {
    return this.columnManager;
  }

  /**
   * Get the expanded state, fallback to normal state if not expandable.
   */
  public getExpandedState() {
    return {
      expandedData: this._data,
      expandedRowKeys: this.state.expandedRowKeys,
      expandedDepthMap: this._depthMap,
    };
  }

  /**
   * Get the total height of all rows, including expanded rows.
   */
  public getTotalRowsHeight() {
    return this._data.length * this.props.rowHeight;
  }

  /**
   * Get the total width of all columns.
   */
  public getTotalColumnsWidth() {
    return this.columnManager.getColumnsWidth();
  }

  /**
   * Forcefully re-render the inner Grid component.
   *
   * Calling `forceUpdate` on `Table` may not re-render the inner Grid since it uses `shallowCompare` as a
   * performance optimization.
   * Use this method if you want to manually trigger a re-render.
   * This may be appropriate if the underlying row data has changed but the row sizes themselves have not.
   */
  public forceUpdateTable() {
    if (this.table) { this.table.forceUpdateTable(); }
    if (this.leftTable) { this.leftTable.forceUpdateTable(); }
    if (this.rightTable) { this.rightTable.forceUpdateTable(); }
  }

  /**
   * Scroll to the specified offset.
   * Useful for animating position changes.
   *
   * @param offset
   */
  public scrollToPosition(offset: IOffset) {
    this._scroll = offset;
    if (this.table) { this.table.scrollToPosition(offset); }
    if (this.leftTable) { this.leftTable.scrollToTop(offset.scrollTop); }
    if (this.rightTable) { this.rightTable.scrollToTop(offset.scrollTop); }
  }

  /**
   * Scroll to the specified offset vertically.
   *
   * @param scrollTop
   */
  public scrollToTop(scrollTop: number) {
    this._scroll.scrollTop = scrollTop;

    if (this.table) { this.table.scrollToPosition(this._scroll); }
    if (this.leftTable) { this.leftTable.scrollToTop(scrollTop); }
    if (this.rightTable) { this.rightTable.scrollToTop(scrollTop); }
  }

  /**
   * Scroll to the specified offset horizontally.
   *
   * @param scrollLeft
   */
  public scrollToLeft(scrollLeft: number) {
    this._scroll.scrollLeft = scrollLeft;

    if (this.table) { this.table.scrollToPosition(this._scroll); }
  }

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
  public scrollToRow(rowIndex: number = 0, align: Align = 'auto') {
    if (this.table ) { this.table.scrollToRow(rowIndex, align); }
    if (this.leftTable ) { this.leftTable.scrollToRow(rowIndex, align); }
    if (this.rightTable ) { this.rightTable.scrollToRow(rowIndex, align); }
  }

  /**
   * Set `expandedRowKeys` manually.
   * This method is available only if `expandedRowKeys` is uncontrolled.
   *
   * @param expandedRowKeys
   */
  public setExpandedRowKeys(expandedRowKeys: string[]) {
    // if `expandedRowKeys` is controlled
    if (this.props.expandedRowKeys !== undefined) {
      return;
    }

    this.setState({
      expandedRowKeys: cloneArray(expandedRowKeys),
    });
  }

  public renderExpandIcon = ({ rowData, rowIndex, depth, onExpand }: IRenderExpandIcon<T>) => {
    const { rowKey, expandColumnKey, expandIconProps } = this.props;
    if (!expandColumnKey) {
      return null;
    }

    const expandable = rowIndex >= 0 && hasChildren(rowData);
    const expanded = rowIndex >= 0 && this.state.expandedRowKeys.indexOf(rowData[`${rowKey}`] as string) >= 0;
    const extraProps = callOrReturn(expandIconProps, { rowData, rowIndex, depth, expandable, expanded });
    const ExpandIconComponent = this._getComponent('ExpandIcon');

    return <ExpandIconComponent
    depth={depth} expandable={expandable} expanded={expanded} {...extraProps} onExpand={onExpand} />;
  }

  public renderRow = ({ isScrolling, columns, rowData, rowIndex, style }: RendererArgs) => {
    const { rowClassName, rowRenderer, rowEventHandlers, expandColumnKey } = this.props;

    const rowClass = callOrReturn(rowClassName, { columns, rowData, rowIndex });
    const extraProps = callOrReturn(this.props.rowProps, { columns, rowData, rowIndex });
    const rowKey = rowData[this.props.rowKey];
    const depth = this._depthMap[rowKey] || 0;

    const className = cn(this._prefixClass('row'), rowClass, {
      [this._prefixClass(`row--depth-${depth}`)]: !!expandColumnKey && rowIndex >= 0,
      [this._prefixClass('row--expanded')]: !!expandColumnKey && this.state.expandedRowKeys.indexOf(rowKey) >= 0,
      [this._prefixClass('row--hovered')]: !isScrolling && rowKey === this.state.hoveredRowKey,
      [this._prefixClass('row--frozen')]: depth === 0 && rowIndex < 0,
      [this._prefixClass('row--customized')]: rowRenderer,
    });

    const rowProps = {
      ...extraProps,
      role: 'row',
      key: `row-${rowKey}`,
      isScrolling,
      className,
      style,
      columns,
      rowIndex,
      rowData,
      rowKey,
      expandColumnKey,
      depth,
      rowEventHandlers,
      rowRenderer,
      cellRenderer: this.renderRowCell,
      expandIconRenderer: this.renderExpandIcon,
      onRowExpand: this._handleRowExpand,
      // for fixed table, we need to sync the hover state across the inner tables
      onRowHover: this.columnManager.hasFrozenColumns() ? this._handleRowHover : null,
    };

    return <TableRow {...rowProps} />;
  }

  public renderRowCell = ({
    isScrolling,
    columns,
    column,
    columnIndex,
    rowData,
    rowIndex,
    expandIcon,
  }: IRenderRowCellParam<T>) => {
    if (column[ColumnManager.PlaceholderKey]) {
      return (
        <div
          key={`row-${rowData[`${this.props.rowKey}`]}-cell-${column.key}-placeholder`}
          className={this._prefixClass('row-cell-placeholder')}
          style={this.columnManager.getColumnStyle(column.key)}
        />
      );
    }

    const { className, dataKey, dataGetter, cellRenderer } = column;
    const TableCellComponent = this._getComponent('TableCell');

    const cellData = dataGetter
      ? dataGetter({ columns, column, columnIndex, rowData, rowIndex })
      : getValue(rowData, dataKey);
    const cellProps: ICellProps<T> = {
      isScrolling,
      cellData,
      columns,
      column,
      columnIndex,
      rowData,
      rowIndex,
      container: this,
    };
    const cell = renderElement(cellRenderer ||
      <TableCellComponent className={this._prefixClass('row-cell-text')} />, cellProps);

    const cellCls = callOrReturn(className, { cellData, columns, column, columnIndex, rowData, rowIndex });
    const cls = cn(this._prefixClass('row-cell'), cellCls, {
      [this._prefixClass('row-cell--align-center')]: column.align === Alignment.CENTER,
      [this._prefixClass('row-cell--align-right')]: column.align === Alignment.RIGHT,
    });

    const extraProps = callOrReturn(this.props.cellProps, { columns, column, columnIndex, rowData, rowIndex });
    const { tagName, ...rest }: ITagNameAndRest = extraProps || {};
    const Tag = tagName || 'div';
    return (
      <Tag
        role='gridcell'
        key={`row-${rowData[`${this.props.rowKey}`]}-cell-${column.key}`}
        {...rest}
        className={cls}
        style={this.columnManager.getColumnStyle(column.key)}
      >
        {expandIcon}
        {cell}
      </Tag>
    );
  }

  public renderHeader = ({ columns, headerIndex, style }: IHeaderRendererParam) => {
    const { headerClassName, headerRenderer } = this.props;

    const headerClass = callOrReturn(headerClassName, { columns, headerIndex });
    const extraProps = callOrReturn(this.props.headerProps, { columns, headerIndex });

    const className = cn(this._prefixClass('header-row'), headerClass, {
      [this._prefixClass('header-row--resizing')]: !!this.state.resizingKey,
      [this._prefixClass('header-row--customized')]: headerRenderer,
    });

    const headerProps: IHeaderProps = {
      ...extraProps,
      role: 'row',
      key: `header-${headerIndex}`,
      className,
      style,
      columns,
      headerIndex,
      headerRenderer,
      cellRenderer: this.renderHeaderCell,
      expandColumnKey: this.props.expandColumnKey,
      expandIcon: this._getComponent('ExpandIcon'),
    };

    return <TableHeaderRow {...headerProps} />;
  }

  public renderMainTable() {
    const { width, headerHeight, rowHeight, fixed, ...rest } = this.props;
    const height = this._getTableHeight();

    let tableWidth = width - this._verticalScrollbarSize;
    if (fixed) {
      const columnsWidth = this.columnManager.getColumnsWidth();
      // make sure `scrollLeft` is always integer to fix a sync bug when scrolling to end horizontally
      tableWidth = Math.max(Math.round(columnsWidth), tableWidth);
    }
    return (
      <GridTable
        {...rest}
        {...this.state}
        className={this._prefixClass('table-main')}
        ref={this._setMainTableRef}
        data={this._data}
        columns={this.columnManager.getMainColumns()}
        width={width}
        height={height}
        headerHeight={headerHeight}
        rowHeight={rowHeight}
        headerWidth={tableWidth + (fixed ? this._verticalScrollbarSize : 0)}
        bodyWidth={tableWidth}
        headerRenderer={this.renderHeader}
        rowRenderer={this.renderRow}
        onScroll={this._handleScroll}
        onRowsRendered={this._handleRowsRendered}
      />
    );
  }

  public renderLeftTable() {
    if (!this.columnManager.hasLeftFrozenColumns()) {
      return null;
    }

    const { width, headerHeight, rowHeight, ...rest } = this.props;

    const containerHeight = this._getFrozenContainerHeight();
    const offset = this._verticalScrollbarSize || 20;
    const columnsWidth = this.columnManager.getLeftFrozenColumnsWidth();
    return (
      <GridTable
        {...rest}
        {...this.state}
        containerStyle={this._getLeftTableContainerStyle(columnsWidth, width, containerHeight)}
        className={this._prefixClass('table-frozen-left')}
        ref={this._setLeftTableRef}
        data={this._data}
        columns={this.columnManager.getLeftFrozenColumns()}
        width={columnsWidth + offset}
        height={containerHeight}
        headerHeight={headerHeight}
        rowHeight={rowHeight}
        headerWidth={columnsWidth + offset}
        bodyWidth={columnsWidth + offset}
        headerRenderer={this.renderHeader}
        rowRenderer={this.renderRow}
        onScroll={this._handleVerticalScroll}
        onRowsRendered={noop}
      />
    );
  }

  public renderRightTable() {
    if (!this.columnManager.hasRightFrozenColumns()) {
      return null;
    }

    const { width, headerHeight, rowHeight, ...rest } = this.props;

    const containerHeight = this._getFrozenContainerHeight();
    const columnsWidth = this.columnManager.getRightFrozenColumnsWidth();
    const scrollbarWidth = this._verticalScrollbarSize;
    return (
      <GridTable
        {...rest}
        {...this.state}
        containerStyle={this._getLeftTableContainerStyle(columnsWidth + scrollbarWidth, width, containerHeight)}
        className={this._prefixClass('table-frozen-right')}
        ref={this._setRightTableRef}
        data={this._data}
        columns={this.columnManager.getRightFrozenColumns()}
        width={columnsWidth + scrollbarWidth}
        height={containerHeight}
        headerHeight={headerHeight}
        rowHeight={rowHeight}
        headerWidth={columnsWidth + scrollbarWidth}
        bodyWidth={columnsWidth}
        headerRenderer={this.renderHeader}
        rowRenderer={this.renderRow}
        onScroll={this._handleVerticalScroll}
        onRowsRendered={noop}
      />
    );
  }

  public renderResizingLine() {
    const { width, fixed } = this.props;
    const { resizingKey } = this.state;
    if (!fixed || !resizingKey) {
      return null;
    }

    const columns = this.columnManager.getMainColumns();
    const idx = columns.findIndex((c) => c.key === resizingKey);
    const column = columns[idx];
    const { width: columnWidth, frozen } = column;
    const leftWidth = this.columnManager.recomputeColumnsWidth(columns.slice(0, idx));

    let left = leftWidth + columnWidth;
    if (!frozen) {
      left -= this._scroll.scrollLeft;
    } else if (frozen === FrozenDirection.RIGHT) {
      const rightWidth = this.columnManager.recomputeColumnsWidth(columns.slice(idx + 1));
      if (rightWidth + columnWidth > width - this._verticalScrollbarSize) {
        left = columnWidth;
      } else {
        left = width - this._verticalScrollbarSize - rightWidth;
      }
    }
    const style = {
      left,
      height: this._getTableHeight() - this._horizontalScrollbarSize,
    };
    return <div className={this._prefixClass('resizing-line')} style={style} />;
  }

  public renderFooter() {
    const { footerHeight, footerRenderer } = this.props;
    if (footerHeight === 0) {
      return null;
    }
    return (
      <div className={this._prefixClass('footer')} style={{ height: footerHeight }}>
        {renderElement(footerRenderer)}
      </div>
    );
  }

  public renderEmptyLayer() {
    const { data, footerHeight, emptyRenderer } = this.props;

    if (data && data.length) {
      return null;
    }
    const headerHeight = this._getHeaderHeight();
    return (
      <div className={this._prefixClass('empty-layer')} style={{ top: headerHeight, bottom: footerHeight }}>
        {renderElement(emptyRenderer, {})}
      </div>
    );
  }

  public renderOverlay() {
    const { overlayRenderer } = this.props;

    return (
      <div className={this._prefixClass('overlay')}>{!!overlayRenderer && renderElement(overlayRenderer, {})}</div>
    );
  }

  public render() {
    const {
      classPrefix,
      width,
      fixed,
      data,
      frozenData,
      expandColumnKey,
      disabled,
      className,
      style,
      footerHeight,
    } = this.props;

    if (expandColumnKey) {
      this._data = this._flattenOnKeys(data, this.state.expandedRowKeys, `${this.props.rowKey}`);
    } else {
      this._data = data;
    }
    // should be after `this._data` assigned
    this._calcScrollbarSizes();

    const containerStyle: React.CSSProperties = {
      ...style,
      width,
      height: this._getTableHeight() + footerHeight,
      position: 'relative',
    };
    const cls = cn(classPrefix, className, {
      [`${classPrefix}--fixed`]: fixed,
      [`${classPrefix}--expandable`]: !!expandColumnKey,
      [`${classPrefix}--empty`]: data.length === 0,
      [`${classPrefix}--has-frozen-rows`]: frozenData.length > 0,
      [`${classPrefix}--has-frozen-columns`]: this.columnManager.hasFrozenColumns(),
      [`${classPrefix}--disabled`]: disabled,
    });
    return (
      <div ref={this._setContainerRef} className={cls} style={containerStyle}>
        {this.renderFooter()}
        {this.renderMainTable()}
        {this.renderLeftTable()}
        {this.renderRightTable()}
        {this.renderResizingLine()}
        {this.renderEmptyLayer()}
        {this.renderOverlay()}
      </div>
    );
  }

  public componentWillReceiveProps(nextProps: IBaseTableProps) {
    const nextColumns = nextProps.columns || normalizeColumns(nextProps.children);
    const columns = this.columnManager.getOriginalColumns();
    if (!isObjectEqual(nextColumns, columns) || nextProps.fixed !== this.props.fixed) {
      this.columnManager.reset(nextColumns, nextProps.fixed);
    }

    if (nextProps.data !== this.props.data) {
      this._lastScannedRowIndex = -1;
      this._hasDataChangedSinceEndReached = true;
    }

    if (nextProps.maxHeight !== this.props.maxHeight || nextProps.height !== this.props.height) {
      this._maybeCallOnEndReached();
    }

    // if `expandedRowKeys` is controlled
    if (
      nextProps.expandColumnKey &&
      nextProps.expandedRowKeys !== undefined &&
      nextProps.expandedRowKeys !== this.props.expandedRowKeys
    ) {
      this.setState({
        expandedRowKeys: cloneArray(nextProps.expandedRowKeys),
      });
    }
  }

  public componentDidMount() {
    const scrollbarSize = this.props.getScrollbarSize();
    if (scrollbarSize > 0) {
      this.setState({ scrollbarSize });
    }
  }

  public componentDidUpdate() {
    this._maybeScrollbarPresenceChange();
  }

  public _prefixClass(className: string) {
    return `${this.props.classPrefix}__${className}`;
  }

  public _getTableHeight() {
    const { height, maxHeight, footerHeight } = this.props;
    let tableHeight = height - footerHeight;

    if (maxHeight > 0) {
      const frozenRowsHeight = this._getFrozenRowsHeight();
      const totalRowsHeight = this.getTotalRowsHeight();
      const headerHeight = this._getHeaderHeight();
      const totalHeight = headerHeight + frozenRowsHeight + totalRowsHeight + this._horizontalScrollbarSize;
      tableHeight = Math.min(totalHeight, maxHeight - footerHeight);
    }

    return tableHeight;
  }

  public _getBodyHeight() {
    return this._getTableHeight() - this._getHeaderHeight() - this._getFrozenRowsHeight();
  }

  public _getFrozenContainerHeight() {
    const { maxHeight } = this.props;

    const tableHeight = this._getTableHeight() - (this._data.length > 0 ? this._horizontalScrollbarSize : 0);
    // in auto height mode tableHeight = totalHeight
    if (maxHeight > 0) {
      return tableHeight;
    }

    const totalHeight = this.getTotalRowsHeight() + this._getHeaderHeight() + this._getFrozenRowsHeight();
    return Math.min(tableHeight, totalHeight);
  }

  public _calcScrollbarSizes() {
    const { fixed, width } = this.props;
    const { scrollbarSize } = this.state;

    const totalRowsHeight = this.getTotalRowsHeight();
    const totalColumnsWidth = this.getTotalColumnsWidth();

    const prevHorizontalScrollbarSize = this._horizontalScrollbarSize;
    const prevVerticalScrollbarSize = this._verticalScrollbarSize;

    if (scrollbarSize === 0) {
      this._horizontalScrollbarSize = 0;
      this._verticalScrollbarSize = 0;
    } else {
      // we have to set `this._horizontalScrollbarSize` before calling `this._getBodyHeight`
      if (!fixed || totalColumnsWidth <= width - scrollbarSize) {
        this._horizontalScrollbarSize = 0;
        this._verticalScrollbarSize = totalRowsHeight > this._getBodyHeight() ? scrollbarSize : 0;
      } else {
        if (totalColumnsWidth > width) {
          this._horizontalScrollbarSize = scrollbarSize;
          this._verticalScrollbarSize =
            totalRowsHeight > this._getBodyHeight() - this._horizontalScrollbarSize ? scrollbarSize : 0;
        } else {
          this._horizontalScrollbarSize = 0;
          this._verticalScrollbarSize = 0;
          if (totalRowsHeight > this._getBodyHeight()) {
            this._horizontalScrollbarSize = scrollbarSize;
            this._verticalScrollbarSize = scrollbarSize;
          }
        }
      }
    }

    if (
      prevHorizontalScrollbarSize !== this._horizontalScrollbarSize ||
      prevVerticalScrollbarSize !== this._verticalScrollbarSize
    ) {
      this._scrollbarPresenceChanged = true;
    }
  }

  public _maybeScrollbarPresenceChange() {
    if (this._scrollbarPresenceChanged) {
      const { onScrollbarPresenceChange } = this.props;
      this._scrollbarPresenceChanged = false;

      onScrollbarPresenceChange({
        size: this.state.scrollbarSize,
        horizontal: this._horizontalScrollbarSize > 0,
        vertical: this._verticalScrollbarSize > 0,
      });
    }
  }

  public _maybeCallOnEndReached() {
    const { onEndReached, onEndReachedThreshold } = this.props;
    const { scrollTop } = this._scroll;
    const scrollHeight = this.getTotalRowsHeight();
    const clientHeight = this._getBodyHeight();

    if (!onEndReached || !clientHeight || !scrollHeight) {
      return;
    }
    const distanceFromEnd = scrollHeight - scrollTop - clientHeight + this._horizontalScrollbarSize;
    if (
      this._lastScannedRowIndex >= 0 &&
      distanceFromEnd <= onEndReachedThreshold &&
      (this._hasDataChangedSinceEndReached || scrollHeight !== this._scrollHeight)
    ) {
      this._hasDataChangedSinceEndReached = false;
      this._scrollHeight = scrollHeight;
      onEndReached({ distanceFromEnd });
    }
  }

  public _handleColumnResize = ({ key }: IColumnProps, width: number) => {
    this.columnManager.setColumnWidth(key, width);
    this.setState({ resizingWidth: width });

    const column = this.columnManager.getColumn(key);
    this.props.onColumnResize({ column, width });
  }

  private renderHeaderCell = ({ columns, column, columnIndex, headerIndex, expandIcon }: IRenderHeaderCellParam) => {
    if (column[ColumnManager.PlaceholderKey]) {
      return (
        <div
          key={`header-${headerIndex}-cell-${column.key}-placeholder`}
          className={this._prefixClass('header-cell-placeholder')}
          style={this.columnManager.getColumnStyle(column.key)}
        />
      );
    }

    const { headerClassName, headerRenderer } = column;
    const { sortBy, sortState, headerCellProps } = this.props;
    const TableHeaderCellComponent = this._getComponent('TableHeaderCell');
    const SortIndicatorComponent = this._getComponent('SortIndicator');

    const cellProps = { columns, column, columnIndex, headerIndex, container: this };
    const cell = renderElement(
      headerRenderer || <TableHeaderCellComponent className={this._prefixClass('header-cell-text')} />,
      cellProps,
    );

    let sorting;
    let sortOrder;

    if (sortState) {
      const order = sortState[column.key];
      sorting = order === SortOrder.ASC || order === SortOrder.DESC;
      sortOrder = sorting ? order : SortOrder.ASC;
    } else {
      sorting = column.key === sortBy.key;
      sortOrder = sorting ? sortBy.order : SortOrder.ASC;
    }

    const cellCls = callOrReturn(headerClassName, { columns, column, columnIndex, headerIndex });
    const cls = cn(this._prefixClass('header-cell'), cellCls, {
      [this._prefixClass('header-cell--align-center')]: column.align === Alignment.CENTER,
      [this._prefixClass('header-cell--align-right')]: column.align === Alignment.RIGHT,
      [this._prefixClass('header-cell--sortable')]: column.sortable,
      [this._prefixClass('header-cell--sorting')]: sorting,
      [this._prefixClass('header-cell--resizing')]: column.key === this.state.resizingKey,
    });
    const extraProps = callOrReturn(headerCellProps, { columns, column, columnIndex, headerIndex });
    const { tagName, ...rest }: ITagNameAndRest = extraProps || {};
    const Tag = tagName || 'div';
    return (
      <Tag
        role='gridcell'
        key={`header-${headerIndex}-cell-${column.key}`}
        onClick={column.sortable ? this._handleColumnSort : null}
        {...rest}
        className={cls}
        style={this.columnManager.getColumnStyle(column.key)}
        data-key={column.key}
      >
        {expandIcon}
        {cell}
        {column.sortable && (
          <SortIndicatorComponent
            sortOrder={sortOrder}
            className={cn(this._prefixClass('sort-indicator'), {
              [this._prefixClass('sort-indicator--descending')]: sortOrder === SortOrder.DESC,
            })}
          />
        )}
        {column.resizable && (
          <ColumnResizer
            className={this._prefixClass('column-resizer')}
            column={column}
            onResizeStart={this._handleColumnResizeStart}
            onResizeStop={this._handleColumnResizeStop}
            onResize={this._handleColumnResize}
          />
        )}
      </Tag>
    );
  }

  private _setContainerRef = (ref: HTMLDivElement) => {
    this.tableNode = ref;
  }

  private _setMainTableRef = (ref: GridTable) => {
    this.table = ref;
  }

  private _setLeftTableRef = (ref: GridTable) => {
    this.leftTable = ref;
  }

  private _setRightTableRef = (ref: GridTable) => {
    this.rightTable = ref;
  }

  private _getComponent(name: 'TableCell' | 'TableHeaderCell' | 'ExpandIcon' | 'SortIndicator') {
    if (this.props.components && this.props.components[name]) {
      return this.props.components[name];
    }
    return DEFAULT_COMPONENTS[name];
  }

  private _getHeaderHeight() {
    const { headerHeight } = this.props;
    if (Array.isArray(headerHeight)) {
      return headerHeight.reduce((sum, height) => sum + height, 0);
    }
    return headerHeight;
  }

  private _getFrozenRowsHeight() {
    const { frozenData, rowHeight } = this.props;
    return frozenData.length * rowHeight;
  }

  private _handleScroll = (args: IOffset) => {
    const lastScrollTop = this._scroll.scrollTop;
    this.scrollToPosition(args);
    this.props.onScroll(args);

    if (args.scrollTop > lastScrollTop) {
      this._maybeCallOnEndReached();
    }
  }

  private _handleVerticalScroll = ({ scrollTop }: { scrollTop: number }) => {
    const lastScrollTop = this._scroll.scrollTop;
    this.scrollToTop(scrollTop);

    if (scrollTop > lastScrollTop) {
      this._maybeCallOnEndReached();
    }
  }

  private _handleRowsRendered = (args: IOnRowsRenderedParam) => {
    this.props.onRowsRendered(args);

    if (args.overscanStopIndex > this._lastScannedRowIndex) {
      this._lastScannedRowIndex = args.overscanStopIndex;
      this._maybeCallOnEndReached();
    }
  }

  private _handleRowHover = ({ hovered, rowKey }: IOnRowHover) => {
    this.setState({ hoveredRowKey: hovered ? rowKey : null });
  }

  private _handleRowExpand = ({
    expanded,
    rowData,
    rowIndex,
    rowKey,
  }: {
    expanded: string[];
    rowData: RowDataType;
    rowIndex: number;
    rowKey: string;
  }) => {
    const expandedRowKeys = cloneArray(this.state.expandedRowKeys);
    if (expanded) {
      if (!(expandedRowKeys.indexOf(rowKey) >= 0)) {
        expandedRowKeys.push(rowKey);
      }
    } else {
      const index = expandedRowKeys.indexOf(rowKey);
      if (index > -1) {
        expandedRowKeys.splice(index, 1);
      }
    }
    // if `expandedRowKeys` is uncontrolled, update internal state
    if (this.props.expandedRowKeys === undefined) {
      this.setState({ expandedRowKeys });
    }
    this.props.onRowExpand({ expanded, rowData, rowIndex, rowKey });
    this.props.onExpandedRowsChange(expandedRowKeys);
  }

  private _handleColumnResizeStart = ({ key }: IHandleColumnResizeStartParam) => {
    this.setState({ resizingKey: key });
  }

  private _handleColumnResizeStop = () => {
    this.setState({ resizingKey: null });
  }

  private _handleColumnSort = (event: React.MouseEvent<HTMLDivElement & { dataset: DOMStringMap }, MouseEvent>) => {
    const key = event.currentTarget.dataset.key;
    const { sortBy, sortState, onColumnSort } = this.props;
    let order = SortOrder.ASC;

    if (sortState) {
      order = sortState[key] === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC;
    } else if (key === sortBy.key) {
      order = sortBy.order === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC;
    }

    const column = this.columnManager.getColumn(key);
    onColumnSort({ column, key, order });
  }
}

interface IRowProps<T = any> extends ITableRowProps<T> {
  role: string;
  key: string;
}
interface IHeaderProps extends ITableHeaderRowProps {
  role?: string;
  key?: string;
}

interface IBaseTableState {
  scrollbarSize: number;
  hoveredRowKey?: React.Key;
  resizingKey?: string;
  resizingWidth: number;
  expandedRowKeys: string[];
}

interface IOffset {
  scrollLeft: number;
  scrollTop: number;
}

interface IHandleColumnResizeStartParam {
  key: string | null;
}

export interface IOnRowsRenderedParam {
  overscanStartIndex?: number;
  overscanStopIndex?: number;
  startIndex?: number;
  stopIndex?: number;
}

interface IRenderRowCellParam<T = RowDataType> extends IColumnEssential, IRowEssential<T> {
  isScrolling: boolean;
  expandIcon: React.ReactNode;
}

export interface IRenderExpandIcon<T = RowDataType> extends IRowEssential<T> {
  depth?: number;
  onExpand?: (param: string[]) => void;
}

interface IRenderHeaderCellParam extends IColumnEssential {
  headerIndex: number;
  expandIcon: React.ReactNode;
}

export type TTagname =
  | string
  | React.ElementType<{
      role?: string;
      'data-key'?: React.Key;
      className?: string;
      style?: React.CSSProperties;
      onClick?: (event: React.MouseEvent<HTMLDivElement & { dataset: DOMStringMap }, MouseEvent>) => void;
    }>;
export interface ICellProps<T = RowDataType> extends IColumnEssential, IRowEssential<T> {
  tagName?: TTagname;
  isScrolling?: boolean;
  cellData?: any;
  container?: any;
  expandIcon?: React.ReactNode;
}

interface ICellPropsCBReturn<T = any> extends IColumnEssential, IRowEssential<T> {}

export interface IRowRendererCBParam<T = RowDataType> extends IRowEssential<T> {
  style: React.CSSProperties;
  isScrolling?: boolean;
  cells?: any;
  columns?: IColumnProps[];
  depth?: number;
}

export interface IOnRowHover<T = RowDataType> extends IRowEssential<T> {
  hovered?: boolean;
  rowKey?: React.Key;
  event?: Event;
}

export interface IOnRowExpandCBParam<T = RowDataType> extends IRowEssential<T> {
  expanded?: any;
  rowKey?: React.Key;
}

export type TExpandedRowKeys = React.Key[];

interface ITagNameAndRest {
  tagName?: TTagname;
  [key: string]: any;
}

export interface IBaseTableProps<T = any, C = any> {
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
  children?: Array<React.ReactElement<IColumnProps>>;
  /**
   * Columns for the table
   */
  columns?: IColumnProps[];
  /**
   * The data for the table
   */
  data: T[];
  /**
   * The data be frozen to top, `rowIndex` is negative and started from `-1`
   */
  frozenData?: T[];
  /**
   * The key field of each data item
   */
  rowKey: React.Key;
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
  rowHeight: number;
  /**
   * The height of the table header, set to 0 to hide the header, could be an array to render multi headers.
   */
  headerHeight: number | number[];
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
  overlayRenderer?: React.ElementType<{}> | React.ReactElement<{}>;
  /**
   * Custom renderer when the length of data is 0
   */
  emptyRenderer?: React.ElementType<{}> | React.ReactElement<{}>;
  /**
   * Custom footer renderer, available only if `footerHeight` is larger then 0
   */
  footerRenderer?: React.ElementType<{}> | React.ReactElement<{}>;
  /**
   * Custom header renderer
   * The renderer receives props `{ cells, columns, headerIndex }`
   */
  headerRenderer?: React.ElementType<IHeaderRendererParam> | React.ReactElement;
  /**
   * Custom row renderer
   * The renderer receives props `{ isScrolling, cells, columns, rowData, rowIndex, depth }`
   */
  rowRenderer?: React.ElementType<RendererArgs> | React.ReactElement;
  /**
   * Class name for the table header, could be a callback to return the class name
   * The callback is of the shape of `({ columns, headerIndex }) => string`
   */
  headerClassName?: string | ((param: { columns: IColumnProps[]; headerIndex: number }) => string);
  /**
   * Class name for the table row, could be a callback to return the class name
   * The callback is of the shape of `({ columns, rowData, rowIndex }) => string`
   */
  rowClassName?: string | ((param: { columns: IColumnProps[]; rowData: RowDataType; rowIndex: number }) => string);
  /**
   * Extra props applied to header element
   * The handler is of the shape of `({ columns, headerIndex }) => object`
   */
  headerProps?: IHeaderProps | ((param: { columns: IColumnProps[]; headerIndex: number }) => IHeaderProps);
  /**
   * Extra props applied to header cell element
   * The handler is of the shape of `({ columns, column, columnIndex, headerIndex }) => object`
   */
  headerCellProps?:
    | ITableHeaderCellProps
    | ((param: {
        columns: IColumnProps[];
        column: IColumnProps;
        columnIndex: number;
        headerIndex: number;
      }) => ITableHeaderCellProps);
  /**
   * Extra props applied to row element
   * The handler is of the shape of `({ columns, rowData, rowIndex }) => object`
   */
  rowProps?: IRowProps | ((param: { columns: IColumnProps[]; rowData: RowDataType; rowIndex: number }) => IRowProps);
  /**
   * Extra props applied to row cell element
   * The handler is of the shape of `({ columns, column, columnIndex, rowData, rowIndex }) => object`
   */
  cellProps?: ICellProps<T> | ((param: ICellProps<T>) => ICellPropsCBReturn<T>);
  /**
   * Extra props applied to ExpandIcon component
   * The handler is of the shape of `({ rowData, rowIndex, depth, expandable, expanded }) => object`
   */
  expandIconProps?:
    | IExpandIconProps
    | ((param: {
        rowData?: any;
        rowIndex?: number;
        depth?: number;
        expandable?: boolean;
        expanded?: boolean;
      }) => IExpandIconProps);
  /**
   * The key for the expand column which render the expand icon if the data is a tree
   */
  expandColumnKey?: string;
  /**
   * Default expanded row keys when initialize the table
   */
  defaultExpandedRowKeys?: string[] | number[];
  /**
   * Controlled expanded row keys
   */
  expandedRowKeys?: TExpandedRowKeys;
  /**
   * A callback function when expand or collapse a tree node
   * The handler is of the shape of `({ expanded, rowData, rowIndex, rowKey }) => *`
   */
  onRowExpand?: (param: IOnRowExpandCBParam) => any;
  /**
   * A callback function when the expanded row keys changed
   * The handler is of the shape of `(expandedRowKeys) => *`
   */
  onExpandedRowsChange?: (param: TExpandedRowKeys) => any;
  /**
   * The sort state for the table, will be ignored if `sortState` is set
   */
  sortBy?: { [key: string]: SortOrder.ASC | SortOrder.DESC };
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
  sortState?: { [key: string]: SortOrder };
  /**
   * A callback function for the header cell click event
   * The handler is of the shape of `({ column, key, order }) => *`
   */
  onColumnSort?: (param: { column: IColumnProps; key: any; order: any }) => any;
  /**
   * A callback function when resizing the column width
   * The handler is of the shape of `({ column, width }) => *`
   */
  onColumnResize?: (param: { column: IColumnProps; width: number }) => any;
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
  getScrollbarSize?: (recalculate?: boolean) => number;
  /**
   * A callback function when scrolling the table
   * The handler is of the shape of
   * `({ scrollLeft, scrollTop, horizontalScrollDirection, verticalScrollDirection, scrollUpdateWasRequested }) => *`
   *
   * `scrollLeft` and `scrollTop` are numbers.
   *
   * `horizontalDirection` and `verticalDirection` are either `forward` or `backward`.
   *
   * `scrollUpdateWasRequested` is a boolean. This value is true if the scroll was caused by `scrollTo*`,
   * and false if it was the result of a user interaction in the browser.
   */
  onScroll?: (param: {
    scrollLeft?: number;
    scrollTop?: number;
    horizontalScrollDirection?: string;
    verticalScrollDirection?: string;
    scrollUpdateWasRequested?: boolean;
  }) => any;
  /**
   * A callback function when scrolling the table within `onEndReachedThreshold` of the bottom
   * The handler is of the shape of `({ distanceFromEnd }) => *`
   */
  onEndReached?: (param: { distanceFromEnd?: number }) => any;
  /**
   * Threshold in pixels for calling `onEndReached`.
   */
  onEndReachedThreshold?: number;
  /**
   * A callback function with information about the slice of rows that were just rendered
   * The handler is of the shape of `({ overscanStartIndex, overscanStopIndex, startIndex， stopIndex }) => *`
   */
  onRowsRendered?: (param: {
    overscanStartIndex?: number;
    overscanStopIndex?: number;
    startIndex?: number;
    stopIndex?: number;
  }) => any;
  /**
   * A callback function when the scrollbar presence state changed
   * The handler is of the shape of `({ size, vertical, horizontal }) => *`
   */
  onScrollbarPresenceChange?: (param: { size?: number; vertical?: boolean; horizontal?: boolean }) => any;
  /**
   * An object for the row event handlers
   * Each of the keys is row event name, like `onClick`, `onDoubleClick` and etc.
   * Each of the handlers is of the shape of `({ rowData, rowIndex, rowKey, event }) => object`
   */
  rowEventHandlers?: THandlerCollection;
  /**
   * An object for the custom components, like `ExpandIcon` and `SortIndicator`
   */
  components?: {
    TableCell?: TTableCell<T, C>;
    TableHeaderCell?: TTableHeaderCell;
    ExpandIcon?: React.ElementType;
    SortIndicator?: TSortIndicator;
  };
}

export default BaseTable;
