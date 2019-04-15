import React from 'react';
import PropTypes from 'prop-types';

class TableHeeader extends React.PureComponent {
  constructor(props) {
    super(props);

    this.renderHeaderRow = this.renderHeaderRow.bind(this);
    this.renderFrozenRow = this.renderFrozenRow.bind(this);
    this._setRef = this._setRef.bind(this);
  }

  scrollToLeft(offset) {
    if (this.headerRef) this.headerRef.scrollLeft = offset;
  }

  renderHeaderRow(height, index) {
    const { columns, headerRenderer, rowWidth } = this.props;
    if (height <= 0) return null;

    const style = { width: rowWidth, height };
    return headerRenderer({ headerIndex: index, style, columns });
  }

  renderFrozenRow(rowData, index) {
    const { columns, rowRenderer, rowHeight, rowWidth } = this.props;
    const style = {
      width: rowWidth,
      height: rowHeight,
    };
    // for frozen row the `rowIndex` is negative
    const rowIndex = -index - 1;
    return rowRenderer({ rowIndex, style, columns, rowData });
  }

  render() {
    const { className, width, height, headerHeight, frozenData } = this.props;
    if (height <= 0) return null;

    const style = {
      width,
      height: height,
      position: 'relative',
      overflow: 'hidden',
    };

    const headerHeights = Array.isArray(headerHeight) ? headerHeight : [headerHeight];
    return (
      <div ref={this._setRef} className={className} style={style}>
        {headerHeights.map(this.renderHeaderRow)}
        {frozenData.map(this.renderFrozenRow)}
      </div>
    );
  }

  _setRef(ref) {
    this.headerRef = ref;
  }
}

TableHeeader.propTypes = {
  className: PropTypes.string,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  headerHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]).isRequired,
  rowWidth: PropTypes.number.isRequired,
  rowHeight: PropTypes.number.isRequired,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  frozenData: PropTypes.arrayOf(PropTypes.object),
  headerRenderer: PropTypes.func.isRequired,
  rowRenderer: PropTypes.func.isRequired,
};

export default TableHeeader;
