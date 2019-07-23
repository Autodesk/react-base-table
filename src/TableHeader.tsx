import React from 'react';
import { IHeaderRendererParam } from './GridTable'
import { IColumnProps, IHeaderRendererCBParam, RowDataType } from './Column';
import { RendererArgs, IRowRendererCBParam } from './BaseTable';

export interface TableHeaderProps<T = any> {
  className?: string;
  width: React.Key;
  height: React.Key;
  headerHeight: number | number[];
  rowWidth: number;
  rowHeight: React.Key;
  columns: IColumnProps[];
  data: T[],
  frozenData?: T[],
  headerRenderer: React.ElementType<IHeaderRendererParam>;
  rowRenderer: React.ElementType<RendererArgs>;
  hoveredRowKey?: React.Key;
};

class TableHeader extends React.PureComponent<TableHeaderProps> {

  private headerRef: HTMLDivElement;
  
  public scrollTo(offset: number) {
    if (this.headerRef) this.headerRef.scrollLeft = offset;
  }

  public renderHeaderRow = (height: number, index: number) => {
    const { columns, headerRenderer: HeaderRenderer } = this.props;
    if (height <= 0) return null;

    const style: React.CSSProperties = { width: '100%', height };
    const headerProps: IHeaderRendererCBParam = { style, columns, headerIndex: index };
    return <HeaderRenderer {...headerProps} />;
  }

  public renderFrozenRow = (rowData: RowDataType, index: number) => {
    const { columns, rowHeight, rowRenderer: RowRenderer } = this.props;
    const style = { width: '100%', height: rowHeight };
    // for frozen row the `rowIndex` is negative
    const rowIndex = -index - 1;
    const rowProps: IRowRendererCBParam = { style, columns, rowData, rowIndex };
    return <RowRenderer {...rowProps}/>;
  }

  public render() {
    const { className, width, height, rowWidth, headerHeight, frozenData } = this.props;
    if (height <= 0) return null;

    const style: React.CSSProperties= {
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
          {frozenData.map(this.renderFrozenRow)}
        </div>
      </div>
    );
  }

  private _setRef = (ref: HTMLDivElement) => {
    this.headerRef = ref;
  }
}

export default TableHeader;
