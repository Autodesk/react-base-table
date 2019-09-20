import React from 'react';
export interface TableCellProps<T = any> {
    className?: string;
    cellData?: any;
    column?: T;
    columnIndex?: number;
    rowData?: object;
    rowIndex?: number;
}
/**
 * Cell component for BaseTable
 */
declare const TableCell: React.FC<TableCellProps>;
export default TableCell;
