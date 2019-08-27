import * as React from 'react';

export interface ITableHeaderRowProps {
  columns: any[];
  isScrolling?: boolean;
  className?: string;
  style?: React.CSSProperties;
  headerIndex?: number;
  cellRenderer?: (...args: any) => any;
  headerRenderer?: React.ReactNode;
  expandColumnKey?: string;
  expandIcon?: (...args: any) => any;
  tagName?: React.ReactNode;
}

/**
 * HeaderRow component for BaseTable
 */
declare const TableHeaderRow: React.FC<ITableHeaderRowProps>;
export default TableHeaderRow;
