import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import Grid from 'react-virtualized/dist/commonjs/Grid';

import Header from './TableHeader';
import cellRangeRenderer from './cellRangeRenderer';

/**
 * A wrapper of the Grid for internal only
 */
class GridTable extends React.PureComponent {
  constructor(props) {
    super(props);

    this._setHeaderRef = this._setHeaderRef.bind(this);
    this._setBodyRef = this._setBodyRef.bind(this);
    this._handleSectionRendered = this._handleSectionRendered.bind(this);

    this.renderRow = this.renderRow.bind(this);
    this.renderCellRange = this.renderCellRange.bind(this);
  }

  forceUpdateTable() {
    this.headerRef && this.headerRef.forceUpdate();
    this.bodyRef && this.bodyRef.forceUpdate();
  }

  scrollToPosition(args) {
    this.headerRef && this.headerRef.scrollToLeft(args.scrollLeft);
    this.bodyRef && this.bodyRef.scrollToPosition(args);
  }

  scrollToTop(scrollTop) {
    this.bodyRef && this.bodyRef.scrollToPosition({ scrollTop });
  }

  scrollToLeft(scrollLeft) {
    this.headerRef && this.headerRef.scrollToLeft(scrollLeft);
    this.bodyRef && this.bodyRef.scrollToPosition({ scrollLeft });
  }

  scrollToRow(rowIndex = 0) {
    this.bodyRef &&
      this.bodyRef.scrollToCell({
        rowIndex,
        columnIndex: 0,
      });
  }

  renderRow(args) {
    const { data, columns, rowRenderer } = this.props;
    const rowData = data[args.rowIndex];
    return rowRenderer({ ...args, columns, rowData });
  }

  renderCellRange(args) {
    const { useIsScrolling } = this.props;
    const isScrolling = useIsScrolling ? args.isScrolling : undefined;
    return cellRangeRenderer({ ...args, useIsScrolling, isScrolling });
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
      onScrollbarPresenceChange,
      ...rest
    } = this.props;
    const headerHeight = this._getHeaderHeight();
    const frozenRowCount = frozenData.length;
    const frozenRowsHeight = rowHeight * frozenRowCount;
    const cls = cn(`${classPrefix}__table`, className);
    const containerProps = containerStyle ? { style: containerStyle } : null;
    return (
      <div className={cls} {...containerProps}>
        <Grid
          {...rest}
          className={`${classPrefix}__body`}
          ref={this._setBodyRef}
          data={data}
          frozenData={frozenData}
          width={width}
          height={Math.max(height - headerHeight - frozenRowsHeight, 0)}
          rowHeight={rowHeight}
          rowCount={data.length}
          columnWidth={bodyWidth}
          columnCount={1}
          isScrollingOptOut={!useIsScrolling}
          cellRenderer={this.renderRow}
          cellRangeRenderer={this.renderCellRange}
          onScroll={onScroll}
          onSectionRendered={this._handleSectionRendered}
          onScrollbarPresenceChange={onScrollbarPresenceChange}
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

  _getHeaderHeight() {
    const { headerHeight } = this.props;
    if (Array.isArray(headerHeight)) {
      return headerHeight.reduce((sum, height) => sum + height, 0);
    }
    return headerHeight;
  }

  _handleSectionRendered({ rowOverscanStartIndex, rowOverscanStopIndex, rowStartIndex, rowStopIndex }) {
    const { onRowsRendered } = this.props;

    onRowsRendered({
      overscanStartIndex: rowOverscanStartIndex,
      overscanStopIndex: rowOverscanStopIndex,
      startIndex: rowStartIndex,
      stopIndex: rowStopIndex,
    });
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
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  frozenData: PropTypes.arrayOf(PropTypes.object),
  useIsScrolling: PropTypes.bool,

  onScroll: PropTypes.func,
  onRowsRendered: PropTypes.func,
  onScrollbarPresenceChange: PropTypes.func,
  headerRenderer: PropTypes.func.isRequired,
  rowRenderer: PropTypes.func.isRequired,
};

export default GridTable;
