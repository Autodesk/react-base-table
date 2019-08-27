import * as React from 'react';

export interface ITableHeaderCellProps<T = any> {
  className?: string;
  column?: T;
  columnIndex?: number;
}

/**
 * HeaderCell component for BaseTable
 */
declare const TableHeaderCell: React.FunctionComponent<ITableHeaderCellProps>;
export default TableHeaderCell;
