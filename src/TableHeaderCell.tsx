import React from 'react';

export interface ITableHeaderCellProps {
  className?: string;
  column?: {title: string};
  columnIndex?: number;
};

/**
 * HeaderCell component for BaseTable
 */
export type TTableHeaderCell = React.FunctionComponent<ITableHeaderCellProps>;
const TableHeaderCell: TTableHeaderCell = ({ className, column, columnIndex }) => 
  (<div className={className}>{column.title}</div>);


export default TableHeaderCell;
