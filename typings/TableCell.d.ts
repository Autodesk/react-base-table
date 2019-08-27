import * as React from 'react';

export interface ITableCellProps {
  className?: string;
  cellData?: any;
  column?: any;
  columnIndex?: number;
  rowData?: any;
  rowIndex?: number;
}
/**
 * Cell component for BaseTable
 */
declare const TableCell: React.FC<ITableCellProps>;
export default TableCell;
