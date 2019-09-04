import React from 'react';
import PropTypes from 'prop-types';
import { toString } from './utils';

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
const TableCell: React.FC<TableCellProps> = ({ className, cellData }) => (
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
