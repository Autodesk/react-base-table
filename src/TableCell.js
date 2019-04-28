import React from 'react';
import PropTypes from 'prop-types';
import { toString } from './utils';

/**
 * Cell component for BaseTable
 */
const TableCell = ({ className, cellData, column, columnIndex, rowData, rowIndex }) => (
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
