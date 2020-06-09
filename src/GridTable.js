import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { FixedSizeGrid, VariableSizeGrid } from 'react-window';

import Header from './TableHeader';

/**
 * A wrapper of the Grid for internal only
 */
export const RowHeightContext = React.createContext({});
class GridTable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { rowHeightMap: {} };

    this._setHeaderRef = this._setHeaderRef.bind(this);
    this._setBodyRef = this._setBodyRef.bind(this);
    this._itemKey = this._itemKey.bind(this);
    this._handleItemsRendered = this._handleItemsRendered.bind(this);

    this.renderRow = this.renderRow.bind(this);
    this.clearRowHeightCache = this.clearRowHeightCache.bind(this);
    this.getRowHeight = this.getRowHeight.bind(this);
    this.setRowHeightMap = this.setRowHeightMap.bind(this);
  }

  forceUpdateTable() {
    this.headerRef && this.headerRef.forceUpdate();
    this.bodyRef && this.bodyRef.forceUpdate();
  }

  scrollToPosition(args) {
    this.headerRef && this.headerRef.scrollTo(args.scrollLeft);
    this.bodyRef && this.bodyRef.scrollTo(args);
  }

  scrollToTop(scrollTop) {
    this.bodyRef && this.bodyRef.scrollTo({ scrollTop });
  }

  scrollToLeft(scrollLeft) {
    this.headerRef && this.headerRef.scrollTo(scrollLeft);
    this.bodyRef && this.bodyRef.scrollToPosition({ scrollLeft });
  }

  scrollToRow(rowIndex = 0, align = 'auto') {
    this.bodyRef && this.bodyRef.scrollToItem({ rowIndex, align });
  }

  clearRowHeightCache(rowKey, size) {
    if (this.props.setRowHeight) {
      this.props.setRowHeight(rowKey, size);
    }

    if (this.bodyRef) {
      this.bodyRef.resetAfterRowIndex(rowKey);
    }
  }

  getRowHeight(rowKey) {
    if (!this.props.useDynamicRowHeight) {
      return this.props.rowHeight;
    }

    return this.props.rowHeightMap[rowKey] || 60;
  }

  setRowHeightMap(rowKey, size) {
    const { useDynamicRowHeight } = this.props;

    if (!useDynamicRowHeight) {
      return;
    }

    this.setState(
      ({ rowHeightMap }) => ({ rowHeightMap: { ...rowHeightMap, [rowKey]: size } }),
      () => this.clearRowHeightCache(rowKey, size)
    );
  }

  renderRow(args) {
    const { data, columns, rowRenderer } = this.props;
    const rowData = data[args.rowIndex];
    return rowRenderer({ ...args, columns, rowData });
  }

  render() {
    const {
      useDynamicRowHeight,
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
      rowHeightMap,
      ...rest
    } = this.props;
    const headerHeight = this._getHeaderHeight();
    const frozenRowCount = frozenData.length;
    const frozenRowsHeight = () => {
      if (!useDynamicRowHeight) {
        return rowHeight * frozenRowCount;
      }

      return frozenData.reduce((acc, _, i) => (acc += rowHeightMap[-i - 1] || 60), 0);
    };
    const cls = cn(`${classPrefix}__table`, className);
    const containerProps = containerStyle ? { style: containerStyle } : null;
    const Grid = useDynamicRowHeight ? VariableSizeGrid : FixedSizeGrid;
    return (
      <div role="table" className={cls} {...containerProps}>
        <RowHeightContext.Provider value={{ setRowHeightMap: this.setRowHeightMap }}>
          <Grid
            {...rest}
            className={`${classPrefix}__body`}
            ref={this._setBodyRef}
            data={data}
            itemKey={this._itemKey}
            frozenData={frozenData}
            width={width}
            height={Math.max(height - headerHeight - frozenRowsHeight(), 0)}
            rowHeight={useDynamicRowHeight ? this.getRowHeight : rowHeight}
            rowCount={data.length}
            overscanRowCount={overscanRowCount}
            columnWidth={useDynamicRowHeight ? _ => bodyWidth : bodyWidth}
            columnCount={1}
            overscanColumnCount={0}
            useIsScrolling={useIsScrolling}
            hoveredRowKey={hoveredRowKey}
            onScroll={onScroll}
            onItemsRendered={this._handleItemsRendered}
            children={this.renderRow}
          />
          {headerHeight + frozenRowsHeight() > 0 && (
            // put header after body and reverse the display order via css
            // to prevent header's shadow being covered by body
            <Header
              {...rest}
              className={`${classPrefix}__header`}
              ref={this._setHeaderRef}
              data={data}
              frozenData={frozenData}
              width={width}
              height={Math.min(headerHeight + frozenRowsHeight(), height)}
              rowWidth={headerWidth}
              rowHeight={this.getRowHeight}
              headerHeight={this.props.headerHeight}
              headerRenderer={this.props.headerRenderer}
              rowRenderer={this.props.rowRenderer}
              hoveredRowKey={frozenRowCount > 0 ? hoveredRowKey : null}
              useDynamicRowHeight={useDynamicRowHeight}
              rowHeightMap={this.state.rowHeightMap}
            />
          )}
        </RowHeightContext.Provider>
      </div>
    );
  }

  _setHeaderRef(ref) {
    this.headerRef = ref;
  }

  _setBodyRef(ref) {
    this.bodyRef = ref;
  }

  _itemKey({ rowIndex }) {
    const { data, rowKey } = this.props;
    return data[rowIndex][rowKey];
  }

  _getHeaderHeight() {
    const { headerHeight } = this.props;
    if (Array.isArray(headerHeight)) {
      return headerHeight.reduce((sum, height) => sum + height, 0);
    }
    return headerHeight;
  }

  _handleItemsRendered({ overscanRowStartIndex, overscanRowStopIndex, visibleRowStartIndex, visibleRowStopIndex }) {
    this.props.onRowsRendered({
      overscanStartIndex: overscanRowStartIndex,
      overscanStopIndex: overscanRowStopIndex,
      startIndex: visibleRowStartIndex,
      stopIndex: visibleRowStopIndex,
    });
  }
}

GridTable.propTypes = {
  useDynamicRowHeight: PropTypes.bool,
  containerStyle: PropTypes.object,
  classPrefix: PropTypes.string,
  className: PropTypes.string,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  headerHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]).isRequired,
  headerWidth: PropTypes.number.isRequired,
  bodyWidth: PropTypes.number.isRequired,
  rowHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.func]).isRequired,
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
  setRowHeight: PropTypes.func,
  rowHeightMap: PropTypes.object,
};

export default GridTable;
