import React from 'react';
import { toString } from './utils';

import type { TableCellProps } from './types';

/**
 * Cell component for BaseTable
 */
const TableCell: React.FC<TableCellProps> = ({ className, cellData, column, columnIndex, rowData, rowIndex }) => (
  <div className={className}>{React.isValidElement(cellData) ? cellData : toString(cellData)}</div>
);

export default TableCell;
