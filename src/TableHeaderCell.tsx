import React from 'react';
import type { TableHeaderCellProps } from './types';

/**
 * HeaderCell component for BaseTable
 */
const TableHeaderCell: React.FC<TableHeaderCellProps> = ({ className, column, columnIndex }) => (
  <div className={className}>{column?.title}</div>
);

export default TableHeaderCell;
