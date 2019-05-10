import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import memoize from 'memoize-one';
import get from 'lodash/get';

import GridTable from './GridTable';
import TableHeaderRow from './TableHeaderRow';
import TableRow from './TableRow';
import TableHeaderCell from './TableHeaderCell';
import TableCell from './TableCell';
import Column, { Alignment, FrozenDirection } from './Column';
import SortOrder from './SortOrder';
import ExpandIcon from './ExpandIcon';
import SortIndicator from './SortIndicator';
import ColumnResizer from './ColumnResizer';
import ColumnManager from './ColumnManager';

import {
  renderElement,
  normalizeColumns,
  getScrollbarSize as defaultGetScrollbarSize,
  isObjectEqual,
  callOrReturn,
  hasChildren,
  flattenOnKeys,
  cloneArray,
  noop,
} from './utils';

const getContainerStyle = (width, maxWidth, height) => ({
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

/**
 * React table component
 */
class BaseTable extends React.PureComponent {
  constructor(props) {
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

    this._setMainTableRef = this._setMainTableRef.bind(this);
    this._setLeftTableRef = this._setLeftTableRef.bind(this);
    this._setRightTableRef = this._setRightTableRef.bind(this);

    this.renderExpandIcon = this.renderExpandIcon.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.renderRowCell = this.renderRowCell.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.renderHeaderCell = this.renderHeaderCell.bind(this);

    this._handleScroll = this._handleScroll.bind(this);
    this._handleVerticalScroll = this._handleVerticalScroll.bind(this);
    this._handleRowsRendered = this._handleRowsRendered.bind(this);
    this._handleRowHover = this._handleRowHover.bind(this);
    this._handleRowExpand = this._handleRowExpand.bind(this);
    this._handleColumnResize = this._handleColumnResize.bind(this);
    this._handleColumnResizeStart = this._handleColumnResizeStart.bind(this);
    this._handleColumnResizeStop = this._handleColumnResizeStop.bind(this);
    this._handleColumnSort = this._handleColumnSort.bind(this);

    this._getLeftTableContainerStyle = memoize(getContainerStyle);
    this._getRightTableContainerStyle = memoize(getContainerStyle);
    this._flattenOnKeys = memoize((tree, keys, dataKey) => {
      this._depthMap = {};
      return flattenOnKeys(tree, keys, this._depthMap, dataKey);
    });

    this._scroll = {};
    this._scrollHeight = 0;
    this._lastScannedRowIndex = -1;
    this._hasDataChangedSinceEndReached = true;

    this._data = props.data;
    this._depthMap = {};

    this._horizontalScrollbarSize = 0;
    this._verticalScrollbarSize = 0;
    this._scrollbarPresenceChanged = false;
  }

  /**
   * Get the expanded state, fallback to normal state if not expandable.
   */
  getExpandedState() {
    return {
      expandedData: this._data,
      expandedRowKeys: this.state.expandedRowKeys,
      expandedDepthMap: this._depthMap,
    };
  }

  /**
   * Get the total height of all rows, including expanded rows.
   */
  getTotalRowsHeight() {
    return this._data.length * this.props.rowHeight;
  }

  /**
   * Get the total width of all columns.
   */
  getTotalColumnsWidth() {
    return this.columnManager.getColumnsWidth();
  }

  /**
   * Forcefully re-render the inner Grid component.
   *
   * Calling `forceUpdate` on `Table` may not re-render the inner Grid since it uses `shallowCompare` as a performance optimization.
   * Use this method if you want to manually trigger a re-render.
   * This may be appropriate if the underlying row data has changed but the row sizes themselves have not.
   */
  forceUpdateTable() {
    this.table && this.table.forceUpdateTable();
    this.leftTable && this.leftTable.forceUpdateTable();
    this.rightTable && this.rightTable.forceUpdateTable();
  }

  /**
   * Scroll to the specified offset.
   * Useful for animating position changes.
   *
   * @param {object} offset
   */
  scrollToPosition(offset) {
    this._scroll = offset;

    this.table && this.table.scrollToPosition(offset);
    this.leftTable && this.leftTable.scrollToTop(offset.scrollTop);
    this.rightTable && this.rightTable.scrollToTop(offset.scrollTop);
  }

  /**
   * Scroll to the specified offset vertically.
   *
   * @param {number} scrollTop
   */
  scrollToTop(scrollTop) {
    this._scroll.scrollTop = scrollTop;

    this.table && this.table.scrollToPosition(this._scroll);
    this.leftTable && this.leftTable.scrollToTop(scrollTop);
    this.rightTable && this.rightTable.scrollToTop(scrollTop);
  }

  /**
   * Scroll to the specified offset horizontally.
   *
   * @param {number} scrollLeft
   */
  scrollToLeft(scrollLeft) {
    this._scroll.scrollLeft = scrollLeft;

    this.table && this.table.scrollToPosition(this._scroll);
  }

  /**
   * Scroll to the specified row.
   * By default, the table will scroll as little as possible to ensure the row is visible.
   * You can control the alignment of the row though by specifying an align property. Acceptable values are:
   * 
   * - `auto` (default) - Scroll as little as possible to ensure the row is visible.
   *  (If the row is already visible, it won't scroll at all.)
   * - `smart` - If the row is already visible, don't scroll at all. If it is less than one viewport away,
   *  scroll as little as possible so that it becomes visible. 
   *  If it is more than one viewport away, scroll so that it is centered within the grid.
   * - `center` - Center align the row within the table.
   * - `end` - Align the row to the bottom, right hand side of the table.
   * - `start` - Align the row to the top, left hand of the table.

   * @param {number} rowIndex 
   * @param {string} align 
   */
  scrollToRow(rowIndex = 0, align = 'auto') {
    this.table && this.table.scrollToRow(rowIndex, align);
    this.leftTable && this.leftTable.scrollToRow(rowIndex, align);
    this.rightTable && this.rightTable.scrollToRow(rowIndex, align);
  }

  /**
   * Set `expandedRowKeys` manually.
   * This method is available only if `expandedRowKeys` is uncontrolled.
   *
   * @param {array} expandedRowKeys
   */
  setExpandedRowKeys(expandedRowKeys) {
    // if `expandedRowKeys` is controlled
    if (this.props.expandedRowKeys !== undefined) return;

    this.setState({
      expandedRowKeys: cloneArray(expandedRowKeys),
    });
  }

  renderExpandIcon({ rowData, rowIndex, depth, onExpand }) {
    const { rowKey, expandColumnKey, expandIconProps } = this.props;
    if (!expandColumnKey) return null;

    const expandable = rowIndex >= 0 && hasChildren(rowData);
    const expanded = rowIndex >= 0 && this.state.expandedRowKeys.indexOf(rowData[rowKey]) >= 0;
    const extraProps = callOrReturn(expandIconProps, { rowData, rowIndex, depth, expandable, expanded });
    const ExpandIcon = this._getComponent('ExpandIcon');

    return <ExpandIcon depth={depth} expandable={expandable} expanded={expanded} {...extraProps} onExpand={onExpand} />;
  }

  renderRow({ isScrolling, columns, rowData, rowIndex, style }) {
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

  renderRowCell({ isScrolling, columns, column, columnIndex, rowData, rowIndex, expandIcon }) {
    if (column[ColumnManager.PlaceholderKey]) {
      return (
        <div
          key={`row-${rowData[this.props.rowKey]}-cell-${column.key}-placeholder`}
          className={this._prefixClass('row-cell-placeholder')}
          style={this.columnManager.getColumnStyle(column.key)}
        />
      );
    }

    const { className, dataKey, dataGetter, cellRenderer } = column;
    const TableCell = this._getComponent('TableCell');

    const cellData = dataGetter
      ? dataGetter({ columns, column, columnIndex, rowData, rowIndex })
      : get(rowData, dataKey);
    const cellProps = { isScrolling, cellData, columns, column, columnIndex, rowData, rowIndex, container: this };
    const cell = renderElement(cellRenderer || <TableCell className={this._prefixClass('row-cell-text')} />, cellProps);

    const cellCls = callOrReturn(className, { cellData, columns, column, columnIndex, rowData, rowIndex });
    const cls = cn(this._prefixClass('row-cell'), cellCls, {
      [this._prefixClass('row-cell--align-center')]: column.align === Alignment.CENTER,
      [this._prefixClass('row-cell--align-right')]: column.align === Alignment.RIGHT,
    });

    const extraProps = callOrReturn(this.props.cellProps, { columns, column, columnIndex, rowData, rowIndex });
    const { tagName, ...rest } = extraProps || {};
    const Tag = tagName || 'div';
    return (
      <Tag
        role="gridcell"
        key={`row-${rowData[this.props.rowKey]}-cell-${column.key}`}
        {...rest}
        className={cls}
        style={this.columnManager.getColumnStyle(column.key)}
      >
        {expandIcon}
        {cell}
      </Tag>
    );
  }

  renderHeader({ columns, headerIndex, style }) {
    const { headerClassName, headerRenderer } = this.props;

    const headerClass = callOrReturn(headerClassName, { columns, headerIndex });
    const extraProps = callOrReturn(this.props.headerProps, { columns, headerIndex });

    const className = cn(this._prefixClass('header-row'), headerClass, {
      [this._prefixClass('header-row--resizing')]: !!this.state.resizingKey,
      [this._prefixClass('header-row--customized')]: headerRenderer,
    });

    const headerProps = {
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

  renderHeaderCell({ columns, column, columnIndex, headerIndex, expandIcon }) {
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
    const { sortBy, headerCellProps } = this.props;
    const TableHeaderCell = this._getComponent('TableHeaderCell');
    const SortIndicator = this._getComponent('SortIndicator');

    const cellProps = { columns, column, columnIndex, headerIndex, container: this };
    const cell = renderElement(
      headerRenderer || <TableHeaderCell className={this._prefixClass('header-cell-text')} />,
      cellProps
    );

    const sorting = column.key === sortBy.key;
    const sortOrder = sorting ? sortBy.order : SortOrder.ASC;
    const cellCls = callOrReturn(headerClassName, { columns, column, columnIndex, headerIndex });
    const cls = cn(this._prefixClass('header-cell'), cellCls, {
      [this._prefixClass('header-cell--align-center')]: column.align === Alignment.CENTER,
      [this._prefixClass('header-cell--align-right')]: column.align === Alignment.RIGHT,
      [this._prefixClass('header-cell--sortable')]: column.sortable,
      [this._prefixClass('header-cell--sorting')]: sorting,
      [this._prefixClass('header-cell--resizing')]: column.key === this.state.resizingKey,
    });
    const extraProps = callOrReturn(headerCellProps, { columns, column, columnIndex, headerIndex });
    const { tagName, ...rest } = extraProps || {};
    const Tag = tagName || 'div';
    return (
      <Tag
        role="gridcell"
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
          <SortIndicator
            sortOrder={sortOrder}
            className={cn(this._prefixClass('sort-indicator'), {
              [this._prefixClass('sort-indicator--descending')]: sortOrder === SortOrder.DESC,
            })}
          />
        )}
        {column.resizable && (
          <ColumnResizer
            className={this._prefixClass('column-resizer')}
            handleClassName={this._prefixClass('column-resizer-handle')}
            column={column}
            onResizeStart={this._handleColumnResizeStart}
            onResizeStop={this._handleColumnResizeStop}
            onResize={this._handleColumnResize}
          />
        )}
      </Tag>
    );
  }

  renderMainTable() {
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

  renderLeftTable() {
    if (!this.columnManager.hasLeftFrozenColumns()) return null;

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

  renderRightTable() {
    if (!this.columnManager.hasRightFrozenColumns()) return null;

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

  renderResizingLine() {
    const { width, fixed } = this.props;
    const { resizingKey } = this.state;
    if (!fixed || !resizingKey) return null;
    const columns = this.columnManager.getMainColumns();
    const idx = columns.findIndex(column => column.key === resizingKey);
    const column = this.columnManager.getColumn(resizingKey);

    let left = this.columnManager.recomputeColumnsWidth(columns.slice(0, idx + 1));
    if (!column.frozen) {
      left -= this._scroll.scrollLeft;
    } else if (column.frozen === FrozenDirection.RIGHT) {
      left = width - this._verticalScrollbarSize - this.columnManager.recomputeColumnsWidth(columns.slice(idx + 1));
    }
    const style = {
      left,
      width: 3,
      transform: 'translateX(-3px)',
      height: this._getTableHeight() - this._horizontalScrollbarSize,
    };
    return <div className={this._prefixClass('resizing-line')} style={style} />;
  }

  renderFooter() {
    const { footerHeight, footerRenderer } = this.props;
    if (footerHeight === 0) return null;
    return (
      <div className={this._prefixClass('footer')} style={{ height: footerHeight }}>
        {renderElement(footerRenderer)}
      </div>
    );
  }

  renderEmptyLayer() {
    const { data, footerHeight, emptyRenderer } = this.props;

    if (data && data.length) return null;
    const headerHeight = this._getHeaderHeight();
    return (
      <div className={this._prefixClass('empty-layer')} style={{ top: headerHeight, bottom: footerHeight }}>
        {renderElement(emptyRenderer)}
      </div>
    );
  }

  renderOverlay() {
    const { overlayRenderer } = this.props;

    return <div className={this._prefixClass('overlay')}>{!!overlayRenderer && renderElement(overlayRenderer)}</div>;
  }

  render() {
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
      this._data = this._flattenOnKeys(data, this.state.expandedRowKeys, this.props.rowKey);
    } else {
      this._data = data;
    }
    // should be after `this._data` assigned
    this._calcScrollbarSizes();

    const containerStyle = {
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
      <div className={cls} style={containerStyle}>
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

  componentWillReceiveProps(nextProps) {
    const nextColumns = nextProps.columns || normalizeColumns(nextProps.children);
    const columns = this.columnManager.getOriginalColumns();
    if (!isObjectEqual(nextColumns, columns) || nextProps.fixed !== this.props.fixed) {
      this.columnManager.reset(nextColumns, nextProps.fixed);
    }

    if (nextProps.data !== this.props.data) {
      this._lastScannedRowIndex = -1;
      this._hasDataChangedSinceEndReached = true;
    }

    if (nextProps.height !== this.props.height) {
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

  componentDidMount() {
    const scrollbarSize = this.props.getScrollbarSize();
    if (scrollbarSize > 0) {
      this.setState({ scrollbarSize });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    this._maybeScrollbarPresenceChange();
  }

  _prefixClass(className) {
    return `${this.props.classPrefix}__${className}`;
  }

  _setMainTableRef(ref) {
    this.table = ref;
  }

  _setLeftTableRef(ref) {
    this.leftTable = ref;
  }

  _setRightTableRef(ref) {
    this.rightTable = ref;
  }

  _getComponent(name) {
    if (this.props.components && this.props.components[name]) return this.props.components[name];
    return DEFAULT_COMPONENTS[name];
  }

  _getHeaderHeight() {
    const { headerHeight } = this.props;
    if (Array.isArray(headerHeight)) {
      return headerHeight.reduce((sum, height) => sum + height, 0);
    }
    return headerHeight;
  }

  _getFrozenRowsHeight() {
    const { frozenData, rowHeight } = this.props;
    return frozenData.length * rowHeight;
  }

  _getTableHeight() {
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

  _getBodyHeight() {
    return this._getTableHeight() - this._getHeaderHeight() - this._getFrozenRowsHeight();
  }

  _getFrozenContainerHeight() {
    const { maxHeight } = this.props;

    const tableHeight = this._getTableHeight() - (this._data.length > 0 ? this._horizontalScrollbarSize : 0);
    // in auto height mode tableHeight = totalHeight
    if (maxHeight > 0) return tableHeight;

    const totalHeight = this.getTotalRowsHeight() + this._getHeaderHeight() + this._getFrozenRowsHeight();
    return Math.min(tableHeight, totalHeight);
  }

  _calcScrollbarSizes() {
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

  _maybeScrollbarPresenceChange() {
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

  _maybeCallOnEndReached() {
    const { maxHeight, onEndReached, onEndReachedThreshold } = this.props;
    const { scrollTop } = this._scroll;
    const scrollHeight = this.getTotalRowsHeight();
    const clientHeight = this._getBodyHeight();
    // onEndReached is not available is maxHeight is set
    if (maxHeight || !onEndReached || !clientHeight || !scrollHeight) return;
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

  _handleScroll(args) {
    const lastScrollTop = this._scroll.scrollTop || 0;
    this.scrollToPosition(args);
    this.props.onScroll(args);

    if (args.scrollTop > lastScrollTop) this._maybeCallOnEndReached();
  }

  _handleVerticalScroll({ scrollTop }) {
    const lastScrollTop = this._scroll.scrollTop || 0;
    this.scrollToTop(scrollTop);

    if (scrollTop > lastScrollTop) this._maybeCallOnEndReached();
  }

  _handleRowsRendered(args) {
    this.props.onRowsRendered(args);

    if (args.overscanStopIndex > this._lastScannedRowIndex) {
      this._lastScannedRowIndex = args.overscanStopIndex;
      this._maybeCallOnEndReached();
    }
  }

  _handleRowHover({ hovered, rowKey }) {
    this.setState({ hoveredRowKey: hovered ? rowKey : null });
  }

  _handleRowExpand({ expanded, rowData, rowIndex, rowKey }) {
    const expandedRowKeys = cloneArray(this.state.expandedRowKeys);
    if (expanded) {
      if (!expandedRowKeys.indexOf(rowKey) >= 0) expandedRowKeys.push(rowKey);
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

  _handleColumnResize({ key }, width) {
    this.columnManager.setColumnWidth(key, width);
    this.setState({ resizingWidth: width });

    const column = this.columnManager.getColumn(key);
    this.props.onColumnResize({ column, width });
  }

  _handleColumnResizeStart({ key }) {
    this.setState({ resizingKey: key });
  }

  _handleColumnResizeStop() {
    this.setState({ resizingKey: null });
  }

  _handleColumnSort(event) {
    const key = event.currentTarget.dataset.key;
    const { sortBy, onColumnSort } = this.props;
    let order = SortOrder.ASC;
    if (key === sortBy.key) {
      order = sortBy.order === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC;
    }

    const column = this.columnManager.getColumn(key);
    onColumnSort({ column, key, order });
  }
}

BaseTable.Column = Column;
BaseTable.PlaceholderKey = ColumnManager.PlaceholderKey;

BaseTable.defaultProps = {
  classPrefix: 'BaseTable',
  rowKey: 'id',
  data: [],
  frozenData: [],
  fixed: false,
  headerHeight: 50,
  rowHeight: 50,
  footerHeight: 0,
  defaultExpandedRowKeys: [],
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

BaseTable.propTypes = {
  /**
   * Prefix for table's inner className
   */
  classPrefix: PropTypes.string,
  /**
   * Class name for the table
   */
  className: PropTypes.string,
  /**
   * Custom style for the table
   */
  style: PropTypes.object,
  /**
   * A collection of Column
   */
  children: PropTypes.node,
  /**
   * Columns for the table
   */
  columns: PropTypes.arrayOf(PropTypes.shape(Column.propTypes)),
  /**
   * The data for the table
   */
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  /**
   * The data be frozen to top, `rowIndex` is negative and started from `-1`
   */
  frozenData: PropTypes.arrayOf(PropTypes.object),
  /**
   * The key field of each data item
   */
  rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  /**
   * The width of the table
   */
  width: PropTypes.number.isRequired,
  /**
   * The height of the table, will be ignored if `maxHeight` is set
   */
  height: PropTypes.number,
  /**
   * The max height of the table, the table's height will auto change when data changes,
   * will turns to vertical scroll if reaches the max height
   */
  maxHeight: PropTypes.number,
  /**
   * The height of each table row
   */
  rowHeight: PropTypes.number.isRequired,
  /**
   * The height of the table header, set to 0 to hide the header, could be an array to render multi headers.
   */
  headerHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]).isRequired,
  /**
   * The height of the table footer
   */
  footerHeight: PropTypes.number,
  /**
   * Whether the width of the columns are fixed or flexible
   */
  fixed: PropTypes.bool,
  /**
   * Whether the table is disabled
   */
  disabled: PropTypes.bool,
  /**
   * Custom renderer on top of the table component
   */
  overlayRenderer: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  /**
   * Custom renderer when the length of data is 0
   */
  emptyRenderer: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  /**
   * Custom footer renderer, available only if `footerHeight` is larger then 0
   */
  footerRenderer: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  /**
   * Custom header renderer
   * The renderer receives props `{ cells, columns, headerIndex }`
   */
  headerRenderer: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  /**
   * Custom row renderer
   * The renderer receives props `{ isScrolling, cells, columns, rowData, rowIndex, depth }`
   */
  rowRenderer: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  /**
   * Class name for the table header, could be a callback to return the class name
   * The callback is of the shape of `({ columns, headerIndex }) => string`
   */
  headerClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  /**
   * Class name for the table row, could be a callback to return the class name
   * The callback is of the shape of `({ columns, rowData, rowIndex }) => string`
   */
  rowClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  /**
   * Extra props applied to header element
   * The handler is of the shape of `({ columns, headerIndex }) object`
   */
  headerProps: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  /**
   * Extra props applied to header cell element
   * The handler is of the shape of `({ columns, column, columnIndex, headerIndex }) => object`
   */
  headerCellProps: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  /**
   * Extra props applied to row element
   * The handler is of the shape of `({ columns, rowData, rowIndex }) => object`
   */
  rowProps: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  /**
   * Extra props applied to row cell element
   * The handler is of the shape of `({ columns, column, columnIndex, rowData, rowIndex }) => object`
   */
  cellProps: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  /**
   * Extra props applied to ExpandIcon component
   * The handler is of the shape of `({ rowData, rowIndex, depth, expandable, expanded }) => object`
   */
  expandIconProps: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  /**
   * The key for the expand column which render the expand icon if the data is a tree
   */
  expandColumnKey: PropTypes.string,
  /**
   * Default expanded row keys when initialize the table
   */
  defaultExpandedRowKeys: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  /**
   * Controlled expanded row keys
   */
  expandedRowKeys: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  /**
   * A callback function when expand or collapse a tree node
   * The handler is of the shape of `({ expanded, rowData, rowIndex, rowKey }) => *`
   */
  onRowExpand: PropTypes.func,
  /**
   * A callback function when the expanded row keys changed
   * The handler is of the shape of `(expandedRowKeys) => *`
   */
  onExpandedRowsChange: PropTypes.func,
  /**
   * The sort state for the table
   */
  sortBy: PropTypes.shape({
    /**
     * Sort key
     */
    key: PropTypes.string,
    /**
     * Sort order
     */
    order: PropTypes.oneOf([SortOrder.ASC, SortOrder.DESC]),
  }),
  /**
   * A callback function for the header cell click event
   * The handler is of the shape of `({ column, key, order }) => *`
   */
  onColumnSort: PropTypes.func,
  /**
   * A callback function when resizing the column width
   * The handler is of the shape of `({ column, width }) => *`
   */
  onColumnResize: PropTypes.func,
  /**
   * Adds an additional isScrolling parameter to the row renderer.
   * This parameter can be used to show a placeholder row while scrolling.
   */
  useIsScrolling: PropTypes.bool,
  /**
   * Number of rows to render above/below the visible bounds of the list
   */
  overscanRowCount: PropTypes.number,
  /**
   * Custom scrollbar size measurement
   */
  getScrollbarSize: PropTypes.func,
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
  onScroll: PropTypes.func,
  /**
   * A callback function when scrolling the table within `onEndReachedThreshold` of the bottom
   * The handler is of the shape of `({ distanceFromEnd }) => *`
   */
  onEndReached: PropTypes.func,
  /**
   * Threshold in pixels for calling `onEndReached`.
   */
  onEndReachedThreshold: PropTypes.number,
  /**
   * A callback function with information about the slice of rows that were just rendered
   * The handler is of the shape of `({ overscanStartIndex, overscanStopIndex, startIndex， stopIndex }) => *`
   */
  onRowsRendered: PropTypes.func,
  /**
   * A callback function when the scrollbar presence state changed
   * The handler is of the shape of `({ size, vertical, horizontal }) => *`
   */
  onScrollbarPresenceChange: PropTypes.func,
  /**
   * A object for the row event handlers
   * Each of the keys is row event name, like `onClick`, `onDoubleClick` and etc.
   * Each of the handlers is of the shape of `({ rowData, rowIndex, rowKey, event }) => object`
   */
  rowEventHandlers: PropTypes.object,
  /**
   * A object for the custom components, like `ExpandIcon` and `SortIndicator`
   */
  components: PropTypes.shape({
    TableCell: PropTypes.func,
    TableHeaderCell: PropTypes.func,
    ExpandIcon: PropTypes.func,
    SortIndicator: PropTypes.func,
  }),
};

export default BaseTable;
