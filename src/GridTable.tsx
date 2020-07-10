import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { FixedSizeGrid, VariableSizeGrid, FixedSizeGridProps, GridOnItemsRenderedProps, Align } from 'react-window';
import memoize from 'memoize-one';

import Header from './TableHeader';
import { fn } from './type-utils';
import { RowKey } from './TableRow';

export type PickProps = Pick<
  FixedSizeGridProps,
  'className' | 'width' | 'height' | 'rowHeight' | 'useIsScrolling' | 'overscanRowCount' | 'style' | 'onScroll'
>;

export type Grid = FixedSizeGrid | VariableSizeGrid | null;

export interface GridTableProps<T = any> extends PickProps {
  containerStyle?: React.CSSProperties;
  classPrefix?: string;
  headerHeight: number | number[];
  headerWidth: number;
  bodyWidth: number;
  estimatedRowHeight?: number;
  getRowHeight?: (rowIndex: number) => number;
  columns: T[];
  data: any[];
  rowKey: RowKey;
  frozenData?: any[];
  overscanRowCount?: number;
  hoveredRowKey?: RowKey | null;
  onScrollbarPresenceChange?: fn;
  onRowsRendered?: (p: {
    overscanStartIndex: number;
    overscanStopIndex: number;
    startIndex: number;
    stopIndex: number;
  }) => void;
  headerRenderer: fn;
  rowRenderer: fn;
}

/**
 * A wrapper of the Grid for internal only
 */
export default class GridTable<T = any> extends React.PureComponent<GridTableProps<T>> {
  static propTypes = {
    containerStyle: PropTypes.object,
    classPrefix: PropTypes.string,
    className: PropTypes.string,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    headerHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]).isRequired,
    headerWidth: PropTypes.number.isRequired,
    bodyWidth: PropTypes.number.isRequired,
    rowHeight: PropTypes.number.isRequired,
    estimatedRowHeight: PropTypes.number,
    getRowHeight: PropTypes.func,
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    data: PropTypes.array.isRequired,
    frozenData: PropTypes.array,
    rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    useIsScrolling: PropTypes.bool,
    overscanRowCount: PropTypes.number,
    hoveredRowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    style: PropTypes.object,
    onScrollbarPresenceChange: PropTypes.func,
    onScroll: PropTypes.func,
    onRowsRendered: PropTypes.func,
    headerRenderer: PropTypes.func.isRequired,
    rowRenderer: PropTypes.func.isRequired,
  };

  headerRef?: Header | null;
  bodyRef?: Grid | null;
  innerRef?: HTMLDivElement | null;
  _resetColumnWidthCache: fn;

  constructor(props: Readonly<GridTableProps<T>>) {
    super(props);

    this._setHeaderRef = this._setHeaderRef.bind(this);
    this._setBodyRef = this._setBodyRef.bind(this);
    this._setInnerRef = this._setInnerRef.bind(this);
    this._itemKey = this._itemKey.bind(this);
    this._getBodyWidth = this._getBodyWidth.bind(this);
    this._handleItemsRendered = this._handleItemsRendered.bind(this);
    // @ts-ignore
    this._resetColumnWidthCache = memoize(bodyWidth => {
      if (!this.props.estimatedRowHeight) return;
      this.bodyRef && (this.bodyRef as VariableSizeGrid).resetAfterColumnIndex(0, false);
    });

    this.renderRow = this.renderRow.bind(this);
  }

  resetAfterRowIndex(rowIndex = 0, shouldForceUpdate: boolean) {
    if (!this.props.estimatedRowHeight) return;
    this.bodyRef && (this.bodyRef as VariableSizeGrid).resetAfterRowIndex(rowIndex, shouldForceUpdate);
  }

  forceUpdateTable() {
    this.headerRef && this.headerRef.forceUpdate();
    this.bodyRef && this.bodyRef.forceUpdate();
  }

  scrollToPosition(args: { scrollLeft: number; scrollTop: number }) {
    this.headerRef && this.headerRef.scrollTo(args.scrollLeft);
    this.bodyRef && this.bodyRef.scrollTo(args);
  }

  scrollToTop(scrollTop: number) {
    this.bodyRef && this.bodyRef.scrollTo({ scrollTop } as any);
  }

  scrollToLeft(scrollLeft: number) {
    this.headerRef && this.headerRef.scrollTo(scrollLeft);
    this.bodyRef && (this.bodyRef as any).scrollToPosition({ scrollLeft });
  }

  scrollToRow(rowIndex = 0, align: Align = 'auto') {
    this.bodyRef && this.bodyRef.scrollToItem({ rowIndex, align });
  }

  getTotalRowsHeight() {
    const { data, rowHeight, estimatedRowHeight } = this.props;

    if (estimatedRowHeight) {
      return (this.innerRef && this.innerRef.clientHeight) || data.length * estimatedRowHeight;
    }
    return data.length * rowHeight;
  }

  renderRow(args: { rowIndex: number }) {
    const { data, columns, rowRenderer } = this.props;
    const rowData = data[args.rowIndex];
    return rowRenderer({ ...args, columns, rowData });
  }

  render() {
    const {
      containerStyle,
      classPrefix,
      className,
      data,
      frozenData,
      width,
      height,
      rowHeight,
      estimatedRowHeight,
      getRowHeight,
      headerWidth,
      bodyWidth,
      useIsScrolling,
      onScroll,
      hoveredRowKey,
      overscanRowCount,
      // omit from rest
      style,
      onScrollbarPresenceChange,
      ...rest
    } = this.props;
    const headerHeight = this._getHeaderHeight();
    const frozenRowCount = frozenData!.length;
    const frozenRowsHeight = rowHeight * frozenRowCount;
    const cls = cn(`${classPrefix}__table`, className);
    const containerProps = containerStyle ? { style: containerStyle } : null;
    const Grid: React.ElementType = estimatedRowHeight ? VariableSizeGrid : FixedSizeGrid;

    this._resetColumnWidthCache(bodyWidth);
    return (
      <div role="table" className={cls} {...containerProps}>
        <Grid
          {...(rest as any)}
          className={`${classPrefix}__body`}
          ref={this._setBodyRef}
          innerRef={this._setInnerRef}
          itemKey={this._itemKey}
          data={data}
          frozenData={frozenData}
          width={width}
          height={Math.max(height - headerHeight - frozenRowsHeight, 0)}
          rowHeight={estimatedRowHeight ? getRowHeight : rowHeight}
          estimatedRowHeight={estimatedRowHeight}
          rowCount={data.length}
          overscanRowCount={overscanRowCount}
          columnWidth={estimatedRowHeight ? this._getBodyWidth : bodyWidth}
          columnCount={1}
          overscanColumnCount={0}
          useIsScrolling={useIsScrolling}
          hoveredRowKey={hoveredRowKey}
          onScroll={onScroll}
          onItemsRendered={this._handleItemsRendered}
          children={this.renderRow}
        />
        {headerHeight + frozenRowsHeight > 0 && (
          // put header after body and reverse the display order via css
          // to prevent header's shadow being covered by body
          <Header
            {...rest}
            className={`${classPrefix}__header`}
            ref={this._setHeaderRef}
            data={data}
            frozenData={frozenData}
            width={width}
            height={Math.min(headerHeight + frozenRowsHeight, height)}
            rowWidth={headerWidth}
            rowHeight={rowHeight}
            headerHeight={this.props.headerHeight}
            headerRenderer={this.props.headerRenderer}
            rowRenderer={this.props.rowRenderer}
            hoveredRowKey={frozenRowCount > 0 ? hoveredRowKey : null}
          />
        )}
      </div>
    );
  }

  private _setHeaderRef(ref: Header | null) {
    this.headerRef = ref;
  }

  private _setBodyRef(ref: Grid | null) {
    this.bodyRef = ref;
  }

  private _setInnerRef(ref: HTMLDivElement | null) {
    this.innerRef = ref;
  }

  private _itemKey({ rowIndex }: { rowIndex: number }) {
    const { data, rowKey } = this.props;
    return data[rowIndex][rowKey];
  }

  private _getHeaderHeight() {
    const { headerHeight } = this.props;
    if (Array.isArray(headerHeight)) {
      return headerHeight.reduce((sum, height) => sum + height, 0);
    }
    return headerHeight;
  }

  private _getBodyWidth() {
    return this.props.bodyWidth;
  }

  private _handleItemsRendered({
    overscanRowStartIndex,
    overscanRowStopIndex,
    visibleRowStartIndex,
    visibleRowStopIndex,
  }: GridOnItemsRenderedProps) {
    (this.props as any).onRowsRendered({
      overscanStartIndex: overscanRowStartIndex,
      overscanStopIndex: overscanRowStopIndex,
      startIndex: visibleRowStartIndex,
      stopIndex: visibleRowStopIndex,
    });
  }
}
