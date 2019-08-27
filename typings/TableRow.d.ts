import * as React from 'react';

export interface ITableRowProps {
  isScrolling?: boolean;
  className?: string;
  style?: React.CSSProperties;
  columns: any[];
  rowData: any;
  rowIndex: number;
  rowKey?: string | number;
  expandColumnKey?: string;
  depth?: number;
  rowEventHandlers?: object;
  rowRenderer?: React.ReactElement | any;
  tagName?: React.ReactNode;
  cellRenderer?(...args: any[]): any;
  expandIconRenderer?(...args: any[]): any;
  onRowHover?(...args: any[]): any;
  onRowExpand?(...args: any[]): any;
}

export default class TableRow extends React.PureComponent<ITableRowProps> {}
