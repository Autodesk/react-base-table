import React from 'react';
import { toString } from './utils';

interface TableCellProps {
    className?: string;
    cellData?: any;
    column?: any;
    columnIndex: number;
    rowData: any;
    rowIndex: number;
}

/**
 * Cell component for BaseTable
 */
const TableCell = ({ className, cellData, column, columnIndex, rowData, rowIndex }: TableCellProps) => (
    <div className={className}>{React.isValidElement(cellData) ? cellData : toString(cellData)}</div>
);

export default TableCell;
