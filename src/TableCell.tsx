import React from 'react';
import { IColumnEssential, IRowEssential, RowDataType } from './Column';
import { toString } from './utils';

export interface TableCellProps<T = RowDataType, C = any> extends IRowEssential<T>, Omit<IColumnEssential, 'columns'> {
  className?: string;
  cellData?: C;
}

/**
 * Cell component for BaseTable
 */
export type TTableCell<T = any, C = any> = React.FunctionComponent<
  React.HTMLProps<HTMLDivElement> & TableCellProps<T, C>
>;
const TableCell: TTableCell = ({ className, cellData, column, columnIndex, rowData, rowIndex }) => (
  <div className={className}>{React.isValidElement(cellData) ? cellData : toString(cellData)}</div>
);

export default TableCell;
