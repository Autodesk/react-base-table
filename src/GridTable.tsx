import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { FixedSizeGrid as Grid, GridOnScrollProps } from 'react-window';

import Header from './TableHeader';
import { fn } from './utils';

export interface GridTableProps<T = any> {
  containerStyle?: React.CSSProperties;
  classPrefix?: string;
  className?: string;
  width: number;
  height: number;
  headerHeight: number | number[]; // PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]).isRequired,
  headerWidth: number;
  bodyWidth: number;
  rowHeight: number;
  columns: T[]; // PropTypes.arrayOf(PropTypes.object).isRequired,
  data: any[]; // PropTypes.arrayOf(PropTypes.object).isRequired,
  rowKey: string | number; // PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  frozenData?: any[];
  useIsScrolling?: boolean;
  overscanRowCount?: number;
  hoveredRowKey?: string | number; // PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  style?: React.CSSProperties; // PropTypes.object,
  onScrollbarPresenceChange?: fn;
  onScroll?: fn;
  onRowsRendered?: fn;
  headerRenderer: fn; // PropTypes.func.isRequired,
  rowRenderer: fn; // PropTypes.func.isRequired,
}

/**
 * A wrapper of the Grid for internal only
 */
export default class GridTable extends React.PureComponent<GridTableProps> {
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
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    frozenData: PropTypes.arrayOf(PropTypes.object),
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

  headerRef: any;
  bodyRef: any;

  constructor(props: Readonly<GridTableProps>) {
    super(props);

    this._setHeaderRef = this._setHeaderRef.bind(this);
    this._setBodyRef = this._setBodyRef.bind(this);
    this._itemKey = this._itemKey.bind(this);
    this._handleItemsRendered = this._handleItemsRendered.bind(this);

    this.renderRow = this.renderRow.bind(this);
  }

  forceUpdateTable() {
    this.headerRef && this.headerRef.forceUpdate();
    this.bodyRef && this.bodyRef.forceUpdate();
  }

  scrollToPosition(args: { scrollLeft: any }) {
    this.headerRef && this.headerRef.scrollTo(args.scrollLeft);
    this.bodyRef && this.bodyRef.scrollTo(args);
  }

  scrollToTop(scrollTop: any) {
    this.bodyRef && this.bodyRef.scrollTo({ scrollTop });
  }

  scrollToLeft(scrollLeft: any) {
    this.headerRef && this.headerRef.scrollTo(scrollLeft);
    this.bodyRef && this.bodyRef.scrollToPosition({ scrollLeft });
  }

  scrollToRow(rowIndex = 0, align = 'auto') {
    this.bodyRef && this.bodyRef.scrollToItem({ rowIndex, align });
  }

  renderRow(args: any) {
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

    return (
      <div role="table" className={cls} {...containerProps}>
        <Grid
          {
            ...(rest as any) // TODO: proper typings
          }
          className={`${classPrefix}__body`}
          ref={this._setBodyRef}
          data={data}
          itemKey={this._itemKey}
          frozenData={frozenData}
          width={width}
          height={Math.max(height - headerHeight - frozenRowsHeight, 0)}
          rowHeight={rowHeight}
          rowCount={data.length}
          overscanRowCount={overscanRowCount}
          columnWidth={bodyWidth}
          columnCount={1}
          overscanColumnCount={0}
          useIsScrolling={useIsScrolling}
          hoveredRowKey={hoveredRowKey}
          onScroll={onScroll as ((props: GridOnScrollProps) => any) | undefined}
          onItemsRendered={this._handleItemsRendered}
          children={this.renderRow}
        />
        {headerHeight + frozenRowsHeight > 0 && (
          // put header after body and reverse the display order via css
          // to prevent header's shadow being covered by body
          <Header
            {
              ...(rest as any) // TODO: proper typings
            }
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

  _setHeaderRef(ref: any) {
    this.headerRef = ref;
  }

  _setBodyRef(ref: any) {
    this.bodyRef = ref;
  }

  _itemKey({ rowIndex }: any) {
    const { data, rowKey } = this.props;
    return (data[rowIndex] as any)[rowKey];
  }

  _getHeaderHeight() {
    const { headerHeight } = this.props;
    if (Array.isArray(headerHeight)) {
      return headerHeight.reduce((sum, height) => sum + height, 0);
    }
    return headerHeight;
  }

  _handleItemsRendered({
    overscanRowStartIndex,
    overscanRowStopIndex,
    visibleRowStartIndex,
    visibleRowStopIndex,
  }: any) {
    this.props.onRowsRendered!({
      overscanStartIndex: overscanRowStartIndex,
      overscanStopIndex: overscanRowStopIndex,
      startIndex: visibleRowStartIndex,
      stopIndex: visibleRowStopIndex,
    });
  }
}
