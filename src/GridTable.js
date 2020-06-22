import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { FixedSizeList as FixedSizeGrid, VariableSizeList as VariableSizeGrid } from 'react-window';

import Header from './TableHeader';

/**
 * A wrapper of the Grid for internal only
 */
class GridTable extends React.PureComponent {
  constructor(props) {
    super(props);

    this._setHeaderRef = this._setHeaderRef.bind(this);
    this._setBodyRef = this._setBodyRef.bind(this);
    this._setOuterRef = this._setOuterRef.bind(this);
    this._setInnerRef = this._setInnerRef.bind(this);
    this._itemKey = this._itemKey.bind(this);
    this._handleItemsRendered = this._handleItemsRendered.bind(this);
    this._handleHorizontalScroll = this._handleHorizontalScroll.bind(this);
    this._handleScroll = this._handleScroll.bind(this);

    this.renderRow = this.renderRow.bind(this);

    this._scrollLeft = 0;
  }

  resetAfterRowIndex(rowIndex = 0, shouldForceUpdate) {
    if (!this.props.estimatedRowHeight) return;
    this.bodyRef && this.bodyRef.resetAfterIndex(rowIndex, shouldForceUpdate);
  }

  forceUpdateTable() {
    this.headerRef && this.headerRef.forceUpdate();
    this.bodyRef && this.bodyRef.forceUpdate();
  }

  scrollToPosition(args) {
    this.headerRef && this.headerRef.scrollTo(args.scrollLeft);
    this.bodyRef && this.bodyRef.scrollTo(args.scrollTop);
    this.outerRef && (this.outerRef.scrollLeft = args.scrollLeft);
  }

  scrollToTop(scrollTop) {
    this.bodyRef && this.bodyRef.scrollTo(scrollTop);
  }

  scrollToLeft(scrollLeft) {
    this.headerRef && this.headerRef.scrollTo(scrollLeft);
    this.outerRef && (this.outerRef.scrollLeft = scrollLeft);
  }

  scrollToRow(rowIndex = 0, align = 'auto') {
    this.bodyRef && this.bodyRef.scrollToItem(rowIndex, align);
  }

  getHeaderHeight() {
    const { headerHeight } = this.props;
    if (Array.isArray(headerHeight)) {
      return headerHeight.reduce((sum, height) => sum + height, 0);
    }
    return headerHeight;
  }

  getFrozenRowsHeight() {
    const { frozenData, rowHeight } = this.props;
    return frozenData.length * rowHeight;
  }

  getTotalRowsHeight() {
    const { data, rowHeight, estimatedRowHeight } = this.props;
    return (this.innerRef && this.innerRef.clientHeight) || data.length * (estimatedRowHeight || rowHeight);
  }

  renderRow({ index, ...rest }) {
    const { data, columns, rowRenderer } = this.props;
    const rowData = data[index];
    return rowRenderer({ ...rest, columns, rowData, rowIndex: index });
  }

  componentDidMount() {
    this.innerRef.style.position = 'relative';
    this.innerRef.style.width = `${this.props.bodyWidth}px`;

    this.outerRef.addEventListener('scroll', this._handleHorizontalScroll);
  }

  componentDidUpdate(prevProps) {
    if (this.props.bodyWidth !== prevProps.bodyWidth) {
      if (this.innerRef) {
        this.innerRef.style.position = 'relative';
        this.innerRef.style.width = `${this.props.bodyWidth}px`;
      }
    }
  }

  componentWillUnmount() {
    this.outerRef.removeEventListener('scroll', this._handleHorizontalScroll);
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
      hoveredRowKey,
      overscanRowCount,
      // omit from rest
      style,
      onScrollbarPresenceChange,
      onScroll,
      ...rest
    } = this.props;
    const headerHeight = this.getHeaderHeight();
    const frozenRowsHeight = this.getFrozenRowsHeight();
    const frozenRowCount = frozenData.length;
    const cls = cn(`${classPrefix}__table`, className);
    const containerProps = containerStyle ? { style: containerStyle } : null;
    const Grid = estimatedRowHeight ? VariableSizeGrid : FixedSizeGrid;
    return (
      <div role="table" className={cls} {...containerProps}>
        <Grid
          {...rest}
          className={`${classPrefix}__body`}
          ref={this._setBodyRef}
          outerRef={this._setOuterRef}
          innerRef={this._setInnerRef}
          itemKey={this._itemKey}
          data={data}
          frozenData={frozenData}
          width={width}
          height={Math.max(height - headerHeight - frozenRowsHeight, 0)}
          itemSize={estimatedRowHeight ? getRowHeight : rowHeight}
          estimatedItemSize={estimatedRowHeight}
          itemCount={data.length}
          overscanCount={overscanRowCount}
          useIsScrolling={useIsScrolling}
          hoveredRowKey={hoveredRowKey}
          onScroll={this._handleScroll}
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

  _setHeaderRef(ref) {
    this.headerRef = ref;
  }

  _setBodyRef(ref) {
    this.bodyRef = ref;
  }

  _setOuterRef(ref) {
    this.outerRef = ref;
  }

  _setInnerRef(ref) {
    this.innerRef = ref;
  }

  _itemKey(rowIndex) {
    const { data, rowKey } = this.props;
    return data[rowIndex][rowKey];
  }

  _handleItemsRendered({ overscanStartIndex, overscanStopIndex, visibleStartIndex, visibleStopIndex }) {
    this.props.onRowsRendered({
      overscanStartIndex: overscanStartIndex,
      overscanStopIndex: overscanStopIndex,
      startIndex: visibleStartIndex,
      stopIndex: visibleStopIndex,
    });
  }

  _handleHorizontalScroll(e) {
    const scrollLeft = e.currentTarget.scrollLeft;
    if (scrollLeft !== this._scrollLeft) {
      this.headerRef && this.headerRef.scrollTo(scrollLeft);
      this._scrollLeft = scrollLeft;
      this.props.onHorizontalScroll && this.props.onHorizontalScroll(scrollLeft);
    }
  }

  _handleScroll({ scrollOffset: scrollTop, ...rest }) {
    this.props.onScroll && this.props.onScroll({ ...rest, scrollTop });
  }
}

GridTable.propTypes = {
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
  onHorizontalScroll: PropTypes.func,
  onRowsRendered: PropTypes.func,
  headerRenderer: PropTypes.func.isRequired,
  rowRenderer: PropTypes.func.isRequired,
};

export default GridTable;
