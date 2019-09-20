import React from 'react';
export interface TableHeaderCellProps<T = any> {
    className?: string;
    column?: T;
    columnIndex?: number;
}
/**
 * HeaderCell component for BaseTable
 */
declare const TableHeaderCell: React.FunctionComponent<TableHeaderCellProps>;
export default TableHeaderCell;
