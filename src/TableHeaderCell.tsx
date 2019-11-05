import React from 'react';
import PropTypes from 'prop-types';

export interface TableHeaderCellProps<T = any> {
  className?: string;
  column?: T;
  columnIndex?: number;
}

/**
 * HeaderCell component for BaseTable
 */
const TableHeaderCell: React.FunctionComponent<TableHeaderCellProps> = ({ className, column }) => (
  <div className={className}>{column.title}</div>
);

TableHeaderCell.propTypes = {
  className: PropTypes.string,
  column: PropTypes.object,
  columnIndex: PropTypes.number,
};

export default TableHeaderCell;
