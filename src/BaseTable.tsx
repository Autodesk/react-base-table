import React, { useState, useRef, useCallback, useMemo, useEffect, useReducer, useImperativeHandle } from 'react';
import cn from 'classnames';
import memoize from 'memoize-one';

import GridTable from './GridTable';
import type { GridTableHandle } from './types';
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
  getEstimatedTotalRowsHeight,
  isObjectEqual,
  callOrReturn,
  hasChildren,
  flattenOnKeys,
  cloneArray,
  getValue,
  throttle,
  debounce,
  noop,
} from './utils';

import type {
  BaseTableProps,
  BaseTableHandle,
  ColumnShape,
  RowData,
  RowKey,
  ScrollArgs,
  RowsRenderedArgs,
  SortByShape,
  SortState,
  TableComponents,
  RowEventHandlers,
} from './types';

const getColumns = memoize(
  (columns: ColumnShape[] | undefined, children: React.ReactNode): ColumnShape[] =>
    columns || normalizeColumns(children),
);

const getContainerStyle = (width: number, maxWidth: number, height: number): React.CSSProperties => ({
  width,
  maxWidth,
  height,
  overflow: 'hidden',
});

const DEFAULT_COMPONENTS: Record<string, React.ComponentType<any>> = {
  TableCell,
  TableHeaderCell,
  TableHeaderRow,
  ExpandIcon,
  SortIndicator,
};

const RESIZE_THROTTLE_WAIT = 50;

const EMPTY_ARRAY: any[] = [];

const DEFAULT_PROPS = {
  classPrefix: 'BaseTable',
  rowKey: 'id' as string | number,
  data: [] as RowData[],
  frozenData: [] as RowData[],
  fixed: false,
  headerHeight: 50 as number | number[],
  rowHeight: 50,
  footerHeight: 0,
  defaultExpandedRowKeys: [] as RowKey[],
  sortBy: {} as SortByShape,
  useIsScrolling: false,
  overscanRowCount: 1,
  onEndReachedThreshold: 500,
  getScrollbarSize: defaultGetScrollbarSize,
  ignoreFunctionInColumnCompare: true,
  onScroll: noop as (...args: any[]) => void,
  onRowsRendered: noop as (...args: any[]) => void,
  onScrollbarPresenceChange: noop as (...args: any[]) => void,
  onRowExpand: noop as (...args: any[]) => void,
  onExpandedRowsChange: noop as (...args: any[]) => void,
  onColumnSort: noop as (...args: any[]) => void,
  onColumnResize: noop as (...args: any[]) => void,
  onColumnResizeEnd: noop as (...args: any[]) => void,
};

/**
 * React table component
 */
const InnerBaseTable = React.forwardRef<BaseTableHandle, BaseTableProps>((rawProps, ref) => {
  // Merge with defaults (equivalent to static defaultProps)
  const props = { ...DEFAULT_PROPS, ...rawProps };
  const {
    classPrefix,
    className,
    style,
    children,
    columns,
    data,
    frozenData,
    rowKey,
    width,
    height,
    maxHeight,
    rowHeight,
    estimatedRowHeight,
    headerHeight,
    footerHeight,
    fixed,
    disabled,
    overlayRenderer,
    emptyRenderer,
    footerRenderer,
    headerRenderer,
    rowRenderer,
    headerClassName,
    rowClassName,
    rowProps: rowPropsProp,
    headerProps: headerPropsProp,
    headerCellProps: headerCellPropsProp,
    cellProps: cellPropsProp,
    expandIconProps,
    expandColumnKey,
    defaultExpandedRowKeys,
    expandedRowKeys: expandedRowKeysProp,
    onRowExpand,
    onExpandedRowsChange,
    sortBy,
    sortState,
    onColumnSort,
    onColumnResize,
    onColumnResizeEnd,
    useIsScrolling,
    overscanRowCount,
    getScrollbarSize,
    onScroll,
    onEndReached,
    onEndReachedThreshold,
    onRowsRendered,
    onScrollbarPresenceChange,
    rowEventHandlers,
    ignoreFunctionInColumnCompare,
    components,
  } = props;

  // State
  const [scrollbarSize, setScrollbarSize] = useState(0);
  const [hoveredRowKey, setHoveredRowKey] = useState<RowKey | null>(null);
  const [resizingKey, setResizingKey] = useState<string | null>(null);
  const [resizingWidth, setResizingWidth] = useState(0);
  const [expandedRowKeysState, setExpandedRowKeysState] = useState<RowKey[]>(() =>
    cloneArray(rawProps.defaultExpandedRowKeys || []),
  );
  const [, forceRender] = useReducer((x: number) => x + 1, 0);

  // DOM/component refs
  const tableNodeRef = useRef<HTMLDivElement | null>(null);
  const tableRef = useRef<GridTableHandle | null>(null);
  const leftTableRef = useRef<GridTableHandle | null>(null);
  const rightTableRef = useRef<GridTableHandle | null>(null);

  // Instance variable refs
  const isResettingRef = useRef(false);
  const resetIndexRef = useRef<number | null>(null);
  const rowHeightMapRef = useRef<Record<string, number>>({});
  const rowHeightMapBufferRef = useRef<Record<string, number>>({});
  const mainRowHeightMapRef = useRef<Record<string, number>>({});
  const leftRowHeightMapRef = useRef<Record<string, number>>({});
  const rightRowHeightMapRef = useRef<Record<string, number>>({});
  const scrollRef = useRef({ scrollLeft: 0, scrollTop: 0 });
  const scrollHeightRef = useRef(0);
  const lastScannedRowIndexRef = useRef(-1);
  const hasDataChangedSinceEndReachedRef = useRef(true);
  const dataRef = useRef<RowData[]>(data);
  const depthMapRef = useRef<Record<string, number>>({});
  const horizontalScrollbarSizeRef = useRef(0);
  const verticalScrollbarSizeRef = useRef(0);
  const scrollbarPresenceChangedRef = useRef(false);
  const totalRowsHeightRef = useRef(0);

  // ColumnManager — initialized once
  const columnManagerRef = useRef<ColumnManager | null>(null);
  if (!columnManagerRef.current) {
    columnManagerRef.current = new ColumnManager(getColumns(columns, children), fixed);
  }
  const columnManager = columnManagerRef.current;

  // Refs to hold latest prop values for use in stable callbacks
  const onColumnResizeRef = useRef(onColumnResize);
  onColumnResizeRef.current = onColumnResize;
  const estimatedRowHeightRef = useRef(estimatedRowHeight);
  estimatedRowHeightRef.current = estimatedRowHeight;
  const ignoreFunctionInColumnCompareRef = useRef(ignoreFunctionInColumnCompare);
  ignoreFunctionInColumnCompareRef.current = ignoreFunctionInColumnCompare;

  // Memoized helpers (stable across renders)
  const _getLeftTableContainerStyle = useMemo(() => memoize(getContainerStyle), []);
  const _getRightTableContainerStyle = useMemo(() => memoize(getContainerStyle), []);

  const _flattenOnKeys = useMemo(
    () =>
      memoize((tree: RowData[], keys: RowKey[], dataKey: string | number) => {
        depthMapRef.current = {};
        return flattenOnKeys(tree, keys, depthMapRef.current, dataKey as string);
      }),
    [],
  );

  const _getEstimatedTotalRowsHeight = useMemo(() => memoize(getEstimatedTotalRowsHeight), []);

  const _resetColumnManager = useMemo(
    () =>
      memoize(
        (cols: ColumnShape[], isFixed: boolean) => {
          columnManager.reset(cols, isFixed);
          if (estimatedRowHeightRef.current && isFixed) {
            if (!columnManager.hasLeftFrozenColumns()) {
              leftRowHeightMapRef.current = {};
            }
            if (!columnManager.hasRightFrozenColumns()) {
              rightRowHeightMapRef.current = {};
            }
          }
        },
        (newArgs: any, lastArgs: any) => isObjectEqual(newArgs, lastArgs, ignoreFunctionInColumnCompareRef.current),
      ),
    [columnManager],
  );

  // Helper methods
  const _prefixClass = (cls: string): string => `${classPrefix}__${cls}`;

  const _getComponent = (name: keyof TableComponents): React.ComponentType<any> => {
    if (components && components[name]) return components[name] as React.ComponentType<any>;
    return DEFAULT_COMPONENTS[name];
  };

  const getExpandedRowKeys = (): RowKey[] => {
    return expandedRowKeysProp !== undefined ? expandedRowKeysProp || EMPTY_ARRAY : expandedRowKeysState;
  };

  const _getHeaderHeight = (): number => {
    if (Array.isArray(headerHeight)) {
      return headerHeight.reduce((sum, h) => sum + h, 0);
    }
    return headerHeight;
  };

  const _getFrozenRowsHeight = (): number => {
    return frozenData.length * rowHeight;
  };

  const getTotalRowsHeight = (): number => {
    if (estimatedRowHeight) {
      return tableRef.current
        ? tableRef.current.getTotalRowsHeight()
        : _getEstimatedTotalRowsHeight(dataRef.current, estimatedRowHeight);
    }
    return dataRef.current.length * rowHeight;
  };

  const _getTableHeight = (): number => {
    let tableHeight = height! - footerHeight;

    if (maxHeight! > 0) {
      const frozenRowsHeight = _getFrozenRowsHeight();
      const totalRowsHeight = getTotalRowsHeight();
      const hHeight = _getHeaderHeight();
      const totalHeight = hHeight + frozenRowsHeight + totalRowsHeight + horizontalScrollbarSizeRef.current;
      tableHeight = Math.min(totalHeight, maxHeight! - footerHeight);
    }

    return tableHeight;
  };

  const _getBodyHeight = (): number => {
    return _getTableHeight() - _getHeaderHeight() - _getFrozenRowsHeight();
  };

  const _getFrozenContainerHeight = (): number => {
    const tableHeight = _getTableHeight() - (dataRef.current.length > 0 ? horizontalScrollbarSizeRef.current : 0);
    if (maxHeight! > 0) return tableHeight;

    const totalHeight = getTotalRowsHeight() + _getHeaderHeight() + _getFrozenRowsHeight();
    return Math.min(tableHeight, totalHeight);
  };

  const _calcScrollbarSizes = () => {
    const totalRowsHeight = getTotalRowsHeight();
    const totalColumnsWidth = columnManager.getColumnsWidth();

    const prevHorizontalScrollbarSize = horizontalScrollbarSizeRef.current;
    const prevVerticalScrollbarSize = verticalScrollbarSizeRef.current;

    if (scrollbarSize === 0) {
      horizontalScrollbarSizeRef.current = 0;
      verticalScrollbarSizeRef.current = 0;
    } else {
      if (!fixed || totalColumnsWidth <= width - scrollbarSize) {
        horizontalScrollbarSizeRef.current = 0;
        verticalScrollbarSizeRef.current = totalRowsHeight > _getBodyHeight() ? scrollbarSize : 0;
      } else {
        if (totalColumnsWidth > width) {
          horizontalScrollbarSizeRef.current = scrollbarSize;
          verticalScrollbarSizeRef.current =
            totalRowsHeight > _getBodyHeight() - horizontalScrollbarSizeRef.current ? scrollbarSize : 0;
        } else {
          horizontalScrollbarSizeRef.current = 0;
          verticalScrollbarSizeRef.current = 0;
          if (totalRowsHeight > _getBodyHeight()) {
            horizontalScrollbarSizeRef.current = scrollbarSize;
            verticalScrollbarSizeRef.current = scrollbarSize;
          }
        }
      }
    }

    if (
      prevHorizontalScrollbarSize !== horizontalScrollbarSizeRef.current ||
      prevVerticalScrollbarSize !== verticalScrollbarSizeRef.current
    ) {
      scrollbarPresenceChangedRef.current = true;
    }
  };

  const _maybeScrollbarPresenceChange = () => {
    if (scrollbarPresenceChangedRef.current) {
      scrollbarPresenceChangedRef.current = false;
      onScrollbarPresenceChange({
        size: scrollbarSize,
        horizontal: horizontalScrollbarSizeRef.current > 0,
        vertical: verticalScrollbarSizeRef.current > 0,
      });
    }
  };

  const _maybeCallOnEndReached = () => {
    const { scrollTop } = scrollRef.current;
    const scrollHeight = getTotalRowsHeight();
    const clientHeight = _getBodyHeight();

    if (!onEndReached || !clientHeight || !scrollHeight) return;
    const distanceFromEnd = scrollHeight - scrollTop - clientHeight + horizontalScrollbarSizeRef.current;
    if (
      lastScannedRowIndexRef.current >= 0 &&
      distanceFromEnd <= onEndReachedThreshold &&
      (hasDataChangedSinceEndReachedRef.current || scrollHeight !== scrollHeightRef.current)
    ) {
      hasDataChangedSinceEndReachedRef.current = false;
      scrollHeightRef.current = scrollHeight;
      onEndReached({ distanceFromEnd });
    }
  };

  // Imperative scroll methods (used internally and exposed via ref)
  const _forceUpdateTable = () => {
    tableRef.current && tableRef.current.forceUpdateTable();
    leftTableRef.current && leftTableRef.current.forceUpdateTable();
    rightTableRef.current && rightTableRef.current.forceUpdateTable();
  };

  const _resetAfterRowIndex = (rowIndex: number = 0, shouldForceUpdate: boolean = true) => {
    if (!estimatedRowHeightRef.current) return;
    tableRef.current && tableRef.current.resetAfterRowIndex(rowIndex, shouldForceUpdate);
    leftTableRef.current && leftTableRef.current.resetAfterRowIndex(rowIndex, shouldForceUpdate);
    rightTableRef.current && rightTableRef.current.resetAfterRowIndex(rowIndex, shouldForceUpdate);
  };

  const _scrollToPosition = (offset: { scrollLeft: number; scrollTop: number }) => {
    scrollRef.current = offset;
    tableRef.current && tableRef.current.scrollToPosition(offset);
    leftTableRef.current && leftTableRef.current.scrollToTop(offset.scrollTop);
    rightTableRef.current && rightTableRef.current.scrollToTop(offset.scrollTop);
  };

  const _scrollToTop = (scrollTop: number) => {
    scrollRef.current.scrollTop = scrollTop;
    tableRef.current && tableRef.current.scrollToPosition(scrollRef.current);
    leftTableRef.current && leftTableRef.current.scrollToTop(scrollTop);
    rightTableRef.current && rightTableRef.current.scrollToTop(scrollTop);
  };

  // Stable callbacks (throttled/debounced — must have stable identity)
  const _updateRowHeights = useMemo(
    () =>
      debounce(() => {
        isResettingRef.current = true;
        rowHeightMapRef.current = { ...rowHeightMapRef.current, ...rowHeightMapBufferRef.current };
        _resetAfterRowIndex(resetIndexRef.current!, false);
        rowHeightMapBufferRef.current = {};
        resetIndexRef.current = null;
        _forceUpdateTable();
        forceRender();
        isResettingRef.current = false;
      }, 0),
    [],
  );

  const _handleColumnResize = useMemo(
    () =>
      throttle((column: { key: string }, w: number) => {
        columnManager.setColumnWidth(column.key, w);
        setResizingWidth(w);
        const col = columnManager.getColumn(column.key);
        onColumnResizeRef.current({ column: col, width: w });
      }, RESIZE_THROTTLE_WAIT),
    [columnManager],
  );

  // Stable callback for _getIsResetting (reads only from ref)
  const _getIsResetting = useCallback((): boolean => isResettingRef.current, []);

  const _getRowHeight = (rowIndex: number): number => {
    return (
      rowHeightMapRef.current[dataRef.current[rowIndex][rowKey as string]] ||
      callOrReturn(estimatedRowHeight!, { rowData: dataRef.current[rowIndex], rowIndex })
    );
  };

  // Ref setters
  const _setContainerRef = useCallback((r: HTMLDivElement | null) => {
    tableNodeRef.current = r;
  }, []);
  const _setMainTableRef = useCallback((r: GridTableHandle | null) => {
    tableRef.current = r;
  }, []);
  const _setLeftTableRef = useCallback((r: GridTableHandle | null) => {
    leftTableRef.current = r;
  }, []);
  const _setRightTableRef = useCallback((r: GridTableHandle | null) => {
    rightTableRef.current = r;
  }, []);

  // Event handlers
  const _handleScroll = (args: any) => {
    const lastScrollTop = scrollRef.current.scrollTop;
    _scrollToPosition(args);
    onScroll(args);
    if (args.scrollTop > lastScrollTop) _maybeCallOnEndReached();
  };

  const _handleVerticalScroll = ({ scrollTop }: { scrollTop: number }) => {
    const lastScrollTop = scrollRef.current.scrollTop;
    if (scrollTop !== lastScrollTop) _scrollToTop(scrollTop);
    if (scrollTop > lastScrollTop) _maybeCallOnEndReached();
  };

  const _handleRowsRendered = (args: RowsRenderedArgs) => {
    onRowsRendered(args);
    if (args.overscanStopIndex > lastScannedRowIndexRef.current) {
      lastScannedRowIndexRef.current = args.overscanStopIndex;
      _maybeCallOnEndReached();
    }
  };

  const _handleRowHover = ({ hovered, rowKey: rk }: { hovered: boolean; rowKey: RowKey }) => {
    setHoveredRowKey(hovered ? rk : null);
  };

  const _handleRowExpand = ({
    expanded,
    rowData,
    rowIndex,
    rowKey: rk,
  }: {
    expanded: boolean;
    rowData: RowData;
    rowIndex: number;
    rowKey: RowKey;
  }) => {
    const keys = cloneArray(getExpandedRowKeys());
    if (expanded) {
      if (keys.indexOf(rk) < 0) keys.push(rk);
    } else {
      const index = keys.indexOf(rk);
      if (index > -1) keys.splice(index, 1);
    }
    if (expandedRowKeysProp === undefined) {
      setExpandedRowKeysState(keys);
    }
    onRowExpand({ expanded, rowData, rowIndex, rowKey: rk });
    onExpandedRowsChange(keys);
  };

  const _handleColumnResizeStart = ({ key }: { key: string }) => {
    setResizingKey(key);
  };

  const _handleColumnResizeStop = () => {
    const rk = resizingKey;
    const rw = resizingWidth;
    setResizingKey(null);
    setResizingWidth(0);
    if (!rk || !rw) return;
    const column = columnManager.getColumn(rk);
    onColumnResizeEnd({ column, width: rw });
  };

  const _handleColumnSort = (event: React.MouseEvent) => {
    const key = (event.currentTarget as HTMLElement).dataset.key!;
    let order: string = SortOrder.ASC;

    if (sortState) {
      order = sortState[key] === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC;
    } else if (key === sortBy.key) {
      order = sortBy.order === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC;
    }

    const column = columnManager.getColumn(key);
    onColumnSort({ column, key, order });
  };

  const _handleFrozenRowHeightChange = (rk: RowKey, size: number, rowIndex: number, frozen: any) => {
    if (!frozen) {
      mainRowHeightMapRef.current[rk] = size;
    } else if (frozen === FrozenDirection.RIGHT) {
      rightRowHeightMapRef.current[rk] = size;
    } else {
      leftRowHeightMapRef.current[rk] = size;
    }

    const h = Math.max(
      mainRowHeightMapRef.current[rk] || 0,
      leftRowHeightMapRef.current[rk] || 0,
      rightRowHeightMapRef.current[rk] || 0,
    );

    if (rowHeightMapRef.current[rk] !== h) {
      _handleRowHeightChange(rk, h, rowIndex);
    }
  };

  const _handleRowHeightChange = (rk: RowKey, size: number, rowIndex: number) => {
    if (resetIndexRef.current === null) resetIndexRef.current = rowIndex;
    else if (resetIndexRef.current > rowIndex) resetIndexRef.current = rowIndex;

    rowHeightMapBufferRef.current[rk] = size;
    _updateRowHeights();
  };

  // Render methods
  const renderExpandIcon = ({
    rowData,
    rowIndex,
    depth,
    onExpand,
  }: {
    rowData: RowData;
    rowIndex: number;
    depth: number;
    onExpand: (expanded: boolean) => void;
  }) => {
    if (!expandColumnKey) return null;

    const expandable = rowIndex >= 0 && hasChildren(rowData);
    const expanded = rowIndex >= 0 && getExpandedRowKeys().indexOf(rowData[rowKey as string]) >= 0;
    const extraProps = callOrReturn(expandIconProps, { rowData, rowIndex, depth, expandable, expanded });
    const ExpandIconComp = _getComponent('ExpandIcon');

    return (
      <ExpandIconComp depth={depth} expandable={expandable} expanded={expanded} {...extraProps} onExpand={onExpand} />
    );
  };

  const renderRow = ({
    isScrolling,
    columns: cols,
    rowData,
    rowIndex,
    style: rowStyle,
  }: {
    isScrolling: boolean;
    columns: ColumnShape[];
    rowData: RowData;
    rowIndex: number;
    style: React.CSSProperties;
  }) => {
    const rowClass = callOrReturn(rowClassName, { columns: cols, rowData, rowIndex });
    const extraProps = callOrReturn(rowPropsProp, { columns: cols, rowData, rowIndex });
    const rk = rowData[rowKey as string];
    const depth = depthMapRef.current[rk] || 0;

    const cls = cn(_prefixClass('row'), rowClass, {
      [_prefixClass(`row--depth-${depth}`)]: !!expandColumnKey && rowIndex >= 0,
      [_prefixClass('row--expanded')]: !!expandColumnKey && getExpandedRowKeys().indexOf(rk) >= 0,
      [_prefixClass('row--hovered')]: !isScrolling && rk === hoveredRowKey,
      [_prefixClass('row--frozen')]: depth === 0 && rowIndex < 0,
      [_prefixClass('row--customized')]: rowRenderer,
    });

    const hasFrozenColumns = columnManager.hasFrozenColumns();
    const rowProps = {
      ...extraProps,
      role: 'row',
      key: `row-${rk}`,
      isScrolling,
      className: cls,
      style: rowStyle,
      columns: cols,
      rowIndex,
      rowData,
      rowKey: rk,
      expandColumnKey,
      depth,
      rowEventHandlers,
      rowRenderer,
      estimatedRowHeight: rowIndex >= 0 ? estimatedRowHeight : undefined,
      getIsResetting: _getIsResetting,
      cellRenderer: renderRowCell,
      expandIconRenderer: renderExpandIcon,
      onRowExpand: _handleRowExpand,
      onRowHover: hasFrozenColumns ? _handleRowHover : undefined,
      onRowHeightChange: hasFrozenColumns ? _handleFrozenRowHeightChange : _handleRowHeightChange,
    };

    return <TableRow {...rowProps} />;
  };

  const renderRowCell = ({ isScrolling, columns: cols, column, columnIndex, rowData, rowIndex, expandIcon }: any) => {
    if (column[ColumnManager.PlaceholderKey]) {
      return (
        <div
          key={`row-${rowData[rowKey as string]}-cell-${column.key}-placeholder`}
          className={_prefixClass('row-cell-placeholder')}
          style={columnManager.getColumnStyle(column.key)}
        />
      );
    }

    const { className: colClassName, dataKey, dataGetter, cellRenderer } = column;
    const TableCellComp = _getComponent('TableCell');

    const cellData = dataGetter
      ? dataGetter({ columns: cols, column, columnIndex, rowData, rowIndex })
      : getValue(rowData, dataKey);
    const cellProps = {
      isScrolling,
      cellData,
      columns: cols,
      column,
      columnIndex,
      rowData,
      rowIndex,
      container: containerRef,
    };
    const cell = renderElement(cellRenderer || <TableCellComp className={_prefixClass('row-cell-text')} />, cellProps);

    const cellCls = callOrReturn(colClassName, { cellData, columns: cols, column, columnIndex, rowData, rowIndex });
    const cls = cn(_prefixClass('row-cell'), cellCls, {
      [_prefixClass('row-cell--align-center')]: column.align === Alignment.CENTER,
      [_prefixClass('row-cell--align-right')]: column.align === Alignment.RIGHT,
    });

    const extraProps = callOrReturn(cellPropsProp, { columns: cols, column, columnIndex, rowData, rowIndex });
    const { tagName, ...rest } = extraProps || {};
    const Tag = tagName || 'div';
    return (
      <Tag
        role="gridcell"
        key={`row-${rowData[rowKey as string]}-cell-${column.key}`}
        {...rest}
        className={cls}
        style={columnManager.getColumnStyle(column.key)}
      >
        {expandIcon}
        {cell}
      </Tag>
    );
  };

  const renderHeader = ({
    columns: cols,
    headerIndex,
    style: headerStyle,
  }: {
    columns: ColumnShape[];
    headerIndex: number;
    style: React.CSSProperties;
  }) => {
    const headerClass = callOrReturn(headerClassName, { columns: cols, headerIndex });
    const extraProps = callOrReturn(headerPropsProp, { columns: cols, headerIndex });

    const cls = cn(_prefixClass('header-row'), headerClass, {
      [_prefixClass('header-row--resizing')]: !!resizingKey,
      [_prefixClass('header-row--customized')]: headerRenderer,
    });

    const hProps = {
      ...extraProps,
      role: 'row',
      key: `header-${headerIndex}`,
      className: cls,
      style: headerStyle,
      columns: cols,
      headerIndex,
      headerRenderer,
      cellRenderer: renderHeaderCell,
      expandColumnKey,
      expandIcon: _getComponent('ExpandIcon'),
    };
    const TableHeaderRowComp = _getComponent('TableHeaderRow');
    return <TableHeaderRowComp {...hProps} />;
  };

  const renderHeaderCell = ({ columns: cols, column, columnIndex, headerIndex, expandIcon }: any) => {
    if (column[ColumnManager.PlaceholderKey]) {
      return (
        <div
          key={`header-${headerIndex}-cell-${column.key}-placeholder`}
          className={_prefixClass('header-cell-placeholder')}
          style={columnManager.getColumnStyle(column.key)}
        />
      );
    }

    const { headerClassName: colHeaderClassName, headerRenderer: colHeaderRenderer } = column;
    const TableHeaderCellComp = _getComponent('TableHeaderCell');
    const SortIndicatorComp = _getComponent('SortIndicator');

    const cellProps = { columns: cols, column, columnIndex, headerIndex, container: containerRef };
    const cell = renderElement(
      colHeaderRenderer || <TableHeaderCellComp className={_prefixClass('header-cell-text')} />,
      cellProps,
    );

    let sorting: boolean, sortOrder: string;

    if (sortState) {
      const order = sortState[column.key];
      sorting = order === SortOrder.ASC || order === SortOrder.DESC;
      sortOrder = sorting ? order : SortOrder.ASC;
    } else {
      sorting = column.key === sortBy.key;
      sortOrder = sorting ? sortBy.order! : SortOrder.ASC;
    }

    const cellCls = callOrReturn(colHeaderClassName, { columns: cols, column, columnIndex, headerIndex });
    const cls = cn(_prefixClass('header-cell'), cellCls, {
      [_prefixClass('header-cell--align-center')]: column.align === Alignment.CENTER,
      [_prefixClass('header-cell--align-right')]: column.align === Alignment.RIGHT,
      [_prefixClass('header-cell--sortable')]: column.sortable,
      [_prefixClass('header-cell--sorting')]: sorting,
      [_prefixClass('header-cell--resizing')]: column.key === resizingKey,
    });
    const extraProps = callOrReturn(headerCellPropsProp, { columns: cols, column, columnIndex, headerIndex });
    const { tagName, ...rest } = extraProps || {};
    const Tag = tagName || 'div';
    return (
      <Tag
        role="gridcell"
        key={`header-${headerIndex}-cell-${column.key}`}
        onClick={column.sortable ? _handleColumnSort : null}
        {...rest}
        className={cls}
        style={columnManager.getColumnStyle(column.key)}
        data-key={column.key}
      >
        {expandIcon}
        {cell}
        {column.sortable && (
          <SortIndicatorComp
            sorting={sorting}
            sortOrder={sortOrder}
            className={cn(_prefixClass('sort-indicator'), {
              [_prefixClass('sort-indicator--descending')]: sortOrder === SortOrder.DESC,
            })}
          />
        )}
        {column.resizable && (
          <ColumnResizer
            className={_prefixClass('column-resizer')}
            column={column}
            onResizeStart={_handleColumnResizeStart}
            onResizeStop={_handleColumnResizeStop}
            onResize={_handleColumnResize}
          />
        )}
      </Tag>
    );
  };

  const renderMainTable = () => {
    const tableHeight = _getTableHeight();

    let tableWidth = width - verticalScrollbarSizeRef.current;
    if (fixed) {
      const columnsWidth = columnManager.getColumnsWidth();
      tableWidth = Math.max(Math.round(columnsWidth), tableWidth);
    }
    return (
      <GridTable
        classPrefix={classPrefix}
        frozenData={frozenData}
        rowKey={rowKey}
        useIsScrolling={useIsScrolling}
        overscanRowCount={overscanRowCount}
        onScrollbarPresenceChange={onScrollbarPresenceChange}
        scrollbarSize={scrollbarSize}
        hoveredRowKey={hoveredRowKey}
        resizingKey={resizingKey}
        resizingWidth={resizingWidth}
        expandedRowKeys={getExpandedRowKeys()}
        className={_prefixClass('table-main')}
        ref={_setMainTableRef}
        data={dataRef.current}
        columns={columnManager.getMainColumns()}
        width={width}
        height={tableHeight}
        headerHeight={headerHeight}
        rowHeight={rowHeight}
        estimatedRowHeight={estimatedRowHeight}
        getRowHeight={estimatedRowHeight ? _getRowHeight : undefined}
        headerWidth={tableWidth + (fixed ? verticalScrollbarSizeRef.current : 0)}
        bodyWidth={tableWidth}
        headerRenderer={renderHeader}
        rowRenderer={renderRow}
        onScroll={_handleScroll}
        onRowsRendered={_handleRowsRendered}
      />
    );
  };

  const renderLeftTable = () => {
    if (!columnManager.hasLeftFrozenColumns()) return null;

    const containerHeight = _getFrozenContainerHeight();
    const offset = verticalScrollbarSizeRef.current || 20;
    const columnsWidth = columnManager.getLeftFrozenColumnsWidth();
    return (
      <GridTable
        classPrefix={classPrefix}
        frozenData={frozenData}
        rowKey={rowKey}
        useIsScrolling={useIsScrolling}
        overscanRowCount={overscanRowCount}
        onScrollbarPresenceChange={onScrollbarPresenceChange}
        scrollbarSize={scrollbarSize}
        hoveredRowKey={hoveredRowKey}
        resizingKey={resizingKey}
        resizingWidth={resizingWidth}
        expandedRowKeys={getExpandedRowKeys()}
        containerStyle={_getLeftTableContainerStyle(columnsWidth, width, containerHeight)}
        className={_prefixClass('table-frozen-left')}
        ref={_setLeftTableRef}
        data={dataRef.current}
        columns={columnManager.getLeftFrozenColumns()}
        initialScrollTop={scrollRef.current.scrollTop}
        width={columnsWidth + offset}
        height={containerHeight}
        headerHeight={headerHeight}
        rowHeight={rowHeight}
        estimatedRowHeight={estimatedRowHeight}
        getRowHeight={estimatedRowHeight ? _getRowHeight : undefined}
        headerWidth={columnsWidth + offset}
        bodyWidth={columnsWidth + offset}
        headerRenderer={renderHeader}
        rowRenderer={renderRow}
        onScroll={_handleVerticalScroll}
        onRowsRendered={noop}
      />
    );
  };

  const renderRightTable = () => {
    if (!columnManager.hasRightFrozenColumns()) return null;

    const containerHeight = _getFrozenContainerHeight();
    const columnsWidth = columnManager.getRightFrozenColumnsWidth();
    const scrollbarWidth = verticalScrollbarSizeRef.current;
    return (
      <GridTable
        classPrefix={classPrefix}
        frozenData={frozenData}
        rowKey={rowKey}
        useIsScrolling={useIsScrolling}
        overscanRowCount={overscanRowCount}
        onScrollbarPresenceChange={onScrollbarPresenceChange}
        scrollbarSize={scrollbarSize}
        hoveredRowKey={hoveredRowKey}
        resizingKey={resizingKey}
        resizingWidth={resizingWidth}
        expandedRowKeys={getExpandedRowKeys()}
        containerStyle={_getRightTableContainerStyle(columnsWidth + scrollbarWidth, width, containerHeight)}
        className={_prefixClass('table-frozen-right')}
        ref={_setRightTableRef}
        data={dataRef.current}
        columns={columnManager.getRightFrozenColumns()}
        initialScrollTop={scrollRef.current.scrollTop}
        width={columnsWidth + scrollbarWidth}
        height={containerHeight}
        headerHeight={headerHeight}
        rowHeight={rowHeight}
        estimatedRowHeight={estimatedRowHeight}
        getRowHeight={estimatedRowHeight ? _getRowHeight : undefined}
        headerWidth={columnsWidth + scrollbarWidth}
        bodyWidth={columnsWidth}
        headerRenderer={renderHeader}
        rowRenderer={renderRow}
        onScroll={_handleVerticalScroll}
        onRowsRendered={noop}
      />
    );
  };

  const renderResizingLine = () => {
    if (!fixed || !resizingKey) return null;

    const cols = columnManager.getMainColumns();
    const idx = cols.findIndex((column) => column.key === resizingKey);
    const column = cols[idx];
    const { width: columnWidth, frozen } = column;
    const leftWidth = columnManager.recomputeColumnsWidth(cols.slice(0, idx));

    let left = leftWidth + columnWidth;
    if (!frozen) {
      left -= scrollRef.current.scrollLeft;
    } else if (frozen === FrozenDirection.RIGHT) {
      const rightWidth = columnManager.recomputeColumnsWidth(cols.slice(idx + 1));
      if (rightWidth + columnWidth > width - verticalScrollbarSizeRef.current) {
        left = columnWidth;
      } else {
        left = width - verticalScrollbarSizeRef.current - rightWidth;
      }
    }
    const lineStyle = {
      left,
      height: _getTableHeight() - horizontalScrollbarSizeRef.current,
    };
    return <div className={_prefixClass('resizing-line')} style={lineStyle} />;
  };

  const renderFooter = () => {
    if (footerHeight === 0) return null;
    return (
      <div className={_prefixClass('footer')} style={{ height: footerHeight }}>
        {renderElement(footerRenderer)}
      </div>
    );
  };

  const renderEmptyLayer = () => {
    if ((data && data.length) || (frozenData && frozenData.length)) return null;
    const hHeight = _getHeaderHeight();
    return (
      <div className={_prefixClass('empty-layer')} style={{ top: hHeight, bottom: footerHeight }}>
        {renderElement(emptyRenderer)}
      </div>
    );
  };

  const renderOverlay = () => {
    return <div className={_prefixClass('overlay')}>{!!overlayRenderer && renderElement(overlayRenderer)}</div>;
  };

  // Container ref for imperative handle (passed as `container` to cell renderers)
  const containerRef = useRef<BaseTableHandle | null>(null);

  // useImperativeHandle
  useImperativeHandle(ref, () => {
    const handle: BaseTableHandle = {
      getDOMNode: () => tableNodeRef.current,
      getColumnManager: () => columnManager,
      getExpandedRowKeys,
      getExpandedState: () => ({
        expandedData: dataRef.current,
        expandedRowKeys: getExpandedRowKeys(),
        expandedDepthMap: depthMapRef.current,
      }),
      getTotalRowsHeight,
      getTotalColumnsWidth: () => columnManager.getColumnsWidth(),
      forceUpdateTable: _forceUpdateTable,
      resetAfterRowIndex: _resetAfterRowIndex,
      resetRowHeightCache: () => {
        if (!estimatedRowHeight) return;
        resetIndexRef.current = null;
        rowHeightMapBufferRef.current = {};
        rowHeightMapRef.current = {};
        mainRowHeightMapRef.current = {};
        leftRowHeightMapRef.current = {};
        rightRowHeightMapRef.current = {};
      },
      scrollToPosition: _scrollToPosition,
      scrollToTop: _scrollToTop,
      scrollToLeft: (scrollLeft: number) => {
        scrollRef.current.scrollLeft = scrollLeft;
        tableRef.current && tableRef.current.scrollToPosition(scrollRef.current);
      },
      scrollToRow: (rowIndex: number = 0, align: string = 'auto') => {
        tableRef.current && tableRef.current.scrollToRow(rowIndex, align);
        leftTableRef.current && leftTableRef.current.scrollToRow(rowIndex, align);
        rightTableRef.current && rightTableRef.current.scrollToRow(rowIndex, align);
      },
      setExpandedRowKeys: (keys: RowKey[]) => {
        if (expandedRowKeysProp !== undefined) return;
        setExpandedRowKeysState(cloneArray(keys));
      },
    };
    containerRef.current = handle;
    return handle;
  });

  // Lifecycle: componentDidMount
  useEffect(() => {
    const size = getScrollbarSize();
    if (size > 0) {
      setScrollbarSize(size);
    }
  }, []);

  // Lifecycle: componentDidUpdate — track data changes
  const prevDataRef = useRef(data);
  const prevHeightRef = useRef(height);
  const prevMaxHeightRef = useRef(maxHeight);
  useEffect(() => {
    if (data !== prevDataRef.current) {
      lastScannedRowIndexRef.current = -1;
      hasDataChangedSinceEndReachedRef.current = true;
    }
    prevDataRef.current = data;

    if (maxHeight !== prevMaxHeightRef.current || height !== prevHeightRef.current) {
      _maybeCallOnEndReached();
    }
    prevHeightRef.current = height;
    prevMaxHeightRef.current = maxHeight;

    _maybeScrollbarPresenceChange();

    if (estimatedRowHeight) {
      if (getTotalRowsHeight() !== totalRowsHeightRef.current) {
        forceRender();
      }
    }
  });

  // === Render logic (equivalent to class render() method) ===

  _resetColumnManager(getColumns(columns, children), fixed);

  const _data = expandColumnKey ? _flattenOnKeys(data, getExpandedRowKeys(), rowKey) : data;
  if (dataRef.current !== _data) {
    _resetAfterRowIndex(0, false);
    dataRef.current = _data;
  }
  _calcScrollbarSizes();
  totalRowsHeightRef.current = getTotalRowsHeight();

  const containerStyle: React.CSSProperties = {
    ...style,
    width,
    height: _getTableHeight() + footerHeight,
    position: 'relative',
  };
  const cls = cn(classPrefix, className, {
    [`${classPrefix}--fixed`]: fixed,
    [`${classPrefix}--expandable`]: !!expandColumnKey,
    [`${classPrefix}--empty`]: data.length === 0,
    [`${classPrefix}--has-frozen-rows`]: frozenData.length > 0,
    [`${classPrefix}--has-frozen-columns`]: columnManager.hasFrozenColumns(),
    [`${classPrefix}--disabled`]: disabled,
    [`${classPrefix}--dynamic`]: !!estimatedRowHeight,
  });

  return (
    <div ref={_setContainerRef} className={cls} style={containerStyle}>
      {renderFooter()}
      {renderMainTable()}
      {renderLeftTable()}
      {renderRightTable()}
      {renderResizingLine()}
      {renderEmptyLayer()}
      {renderOverlay()}
    </div>
  );
});

const BaseTable = React.memo(InnerBaseTable) as React.MemoExoticComponent<
  React.ForwardRefExoticComponent<BaseTableProps & React.RefAttributes<BaseTableHandle>>
> & {
  Column: typeof Column;
  PlaceholderKey: string;
};

(BaseTable as any).Column = Column;
(BaseTable as any).PlaceholderKey = ColumnManager.PlaceholderKey;

export default BaseTable;
