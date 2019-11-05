import React from 'react';
import PropTypes from 'prop-types';

import { fn } from './type-utils';
import { RowKey } from './TableRow';

export interface TableHeaderProps<T = any> {
  className?: string;
  width: number;
  height: number;
  headerHeight: number | number[];
  rowWidth: number;
  rowHeight: number;
  columns: T[];
  data: any[];
  frozenData?: any[];
  headerRenderer: fn;
  rowRenderer: fn;
  hoveredRowKey?: RowKey | null;
}

export default class TableHeader<T = any> extends React.PureComponent<TableHeaderProps<T>> {
  static propTypes: React.WeakValidationMap<TableHeaderProps<any>> = {
    className: PropTypes.string,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    headerHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]).isRequired as any,
    rowWidth: PropTypes.number.isRequired,
    rowHeight: PropTypes.number.isRequired,
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    frozenData: PropTypes.arrayOf(PropTypes.object),
    headerRenderer: PropTypes.func.isRequired,
    rowRenderer: PropTypes.func.isRequired,
  };

  headerRef?: HTMLDivElement | null;

  constructor(props: Readonly<TableHeaderProps<T>>) {
    super(props);

    this.renderHeaderRow = this.renderHeaderRow.bind(this);
    this.renderFrozenRow = this.renderFrozenRow.bind(this);
    this._setRef = this._setRef.bind(this);
  }

  scrollTo(offset: number) {
    if (this.headerRef) this.headerRef.scrollLeft = offset;
  }

  renderHeaderRow(height: number, index: any) {
    const { columns, headerRenderer } = this.props;
    if (height <= 0) return null;

    const style = { width: '100%', height };
    return headerRenderer({ style, columns, headerIndex: index });
  }

  renderFrozenRow(rowData: any, index: number) {
    const { columns, rowHeight, rowRenderer } = this.props;
    const style = { width: '100%', height: rowHeight };
    // for frozen row the `rowIndex` is negative
    const rowIndex = -index - 1;
    return rowRenderer({ style, columns, rowData, rowIndex });
  }

  render() {
    const { className, width, height, rowWidth, headerHeight, frozenData } = this.props;
    if (height <= 0) return null;

    const style: React.CSSProperties = {
      width,
      height,
      position: 'relative',
      overflow: 'hidden',
    };

    const innerStyle = {
      width: rowWidth,
      height,
    };

    const rowHeights = Array.isArray(headerHeight) ? headerHeight : [headerHeight];
    return (
      <div role="grid" ref={this._setRef} className={className} style={style}>
        <div role="rowgroup" style={innerStyle}>
          {rowHeights.map(this.renderHeaderRow)}
          {frozenData!.map(this.renderFrozenRow)}
        </div>
      </div>
    );
  }

  _setRef(ref: HTMLDivElement | null) {
    this.headerRef = ref;
  }
}
