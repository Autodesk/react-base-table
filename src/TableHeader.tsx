import React from 'react';
import PropTypes from 'prop-types';

import type { ColumnShape, RowData } from './types';

export interface TableHeaderProps {
  className?: string;
  width: number;
  height: number;
  headerHeight: number | number[];
  rowWidth: number;
  rowHeight: number;
  columns: ColumnShape[];
  data: RowData[];
  frozenData?: RowData[];
  headerRenderer: (args: {
    style: React.CSSProperties;
    columns: ColumnShape[];
    headerIndex: number;
  }) => React.ReactNode;
  rowRenderer: (args: {
    style: React.CSSProperties;
    columns: ColumnShape[];
    rowData: RowData;
    rowIndex: number;
  }) => React.ReactNode;
  hoveredRowKey?: string | number | null;
}

class TableHeader extends React.PureComponent<TableHeaderProps> {
  headerRef: HTMLDivElement | null = null;

  static propTypes = {
    className: PropTypes.string,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    headerHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]).isRequired,
    rowWidth: PropTypes.number.isRequired,
    rowHeight: PropTypes.number.isRequired,
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    data: PropTypes.array.isRequired,
    frozenData: PropTypes.array,
    headerRenderer: PropTypes.func.isRequired,
    rowRenderer: PropTypes.func.isRequired,
  };

  constructor(props: TableHeaderProps) {
    super(props);

    this.renderHeaderRow = this.renderHeaderRow.bind(this);
    this.renderFrozenRow = this.renderFrozenRow.bind(this);
    this._setRef = this._setRef.bind(this);
  }

  scrollTo(offset: number) {
    requestAnimationFrame(() => {
      if (this.headerRef) this.headerRef.scrollLeft = offset;
    });
  }

  renderHeaderRow(height: number, index: number) {
    const { columns, headerRenderer } = this.props;
    if (height <= 0) return null;

    const style: React.CSSProperties = { width: '100%', height };
    return headerRenderer({ style, columns, headerIndex: index });
  }

  renderFrozenRow(rowData: RowData, index: number) {
    const { columns, rowHeight, rowRenderer } = this.props;
    const style: React.CSSProperties = { width: '100%', height: rowHeight };
    const rowIndex = -index - 1;
    return rowRenderer({ style, columns, rowData, rowIndex });
  }

  render() {
    const { className, width, height, rowWidth, headerHeight, frozenData } = this.props;
    if (height <= 0) return null;

    const style: React.CSSProperties = {
      width,
      height: height,
      position: 'relative',
      overflow: 'hidden',
    };

    const innerStyle: React.CSSProperties = {
      width: rowWidth,
      height,
    };

    const rowHeights = Array.isArray(headerHeight) ? headerHeight : [headerHeight];
    return (
      <div role="grid" ref={this._setRef} className={className} style={style}>
        <div role="rowgroup" style={innerStyle}>
          {rowHeights.map(this.renderHeaderRow)}
          {frozenData && frozenData.map(this.renderFrozenRow)}
        </div>
      </div>
    );
  }

  _setRef(ref: HTMLDivElement | null) {
    this.headerRef = ref;
  }
}

export default TableHeader;
