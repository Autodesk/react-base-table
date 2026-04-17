import React from 'react';
import PropTypes from 'prop-types';

import type { ColumnShape } from './types';

export interface TableHeaderCellProps {
  className?: string;
  column?: ColumnShape;
  columnIndex?: number;
}

/**
 * HeaderCell component for BaseTable
 */
const TableHeaderCell: React.FC<TableHeaderCellProps> = ({ className, column, columnIndex }) => (
  <div className={className}>{column?.title}</div>
);

TableHeaderCell.propTypes = {
  className: PropTypes.string,
  column: PropTypes.object,
  columnIndex: PropTypes.number,
};

export default TableHeaderCell;
