import React from 'react';
import PropTypes from 'prop-types';
import { toString } from './utils';

import type { ColumnShape, RowData } from './types';

export interface TableCellProps {
  className?: string;
  cellData?: any;
  column?: ColumnShape;
  columnIndex?: number;
  rowData?: RowData;
  rowIndex?: number;
}

/**
 * Cell component for BaseTable
 */
const TableCell: React.FC<TableCellProps> = ({ className, cellData, column, columnIndex, rowData, rowIndex }) => (
  <div className={className}>{React.isValidElement(cellData) ? cellData : toString(cellData)}</div>
);

TableCell.propTypes = {
  className: PropTypes.string,
  cellData: PropTypes.any,
  column: PropTypes.object,
  columnIndex: PropTypes.number,
  rowData: PropTypes.object,
  rowIndex: PropTypes.number,
};

export default TableCell;
