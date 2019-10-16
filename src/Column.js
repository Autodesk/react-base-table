import React from 'react';
import PropTypes from 'prop-types';

export const Alignment = {
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right',
};

export const FrozenDirection = {
  LEFT: 'left',
  RIGHT: 'right',
  DEFAULT: true,
  NONE: false,
};

/**
 * Column for BaseTable
 */
class Column extends React.Component {}

Column.propTypes = {
  /**
   * Class name for the column cell, could be a callback to return the class name
   * The callback is of the shape of `({ cellData, columns, column, columnIndex, rowData, rowIndex }) => string`
   */
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  /**
   * Class name for the column header, could be a callback to return the class name
   * The callback is of the shape of `({ columns, column, columnIndex, headerIndex }) => string`
   */
  headerClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  /**
   * Custom style for the column cell, including the header cells
   */
  style: PropTypes.object,
  /**
   * Title for the column header
   */
  title: PropTypes.string,
  /**
   * Data key for the column cell, could be "a.b.c"
   */
  dataKey: PropTypes.string,
  /**
   * Custom cell data getter
   * The handler is of the shape of `({ columns, column, columnIndex, rowData, rowIndex }) => node`
   */
  dataGetter: PropTypes.func,
  /**
   * Alignment of the column cell
   */
  align: PropTypes.oneOf(['left', 'center', 'right']),
  /**
   * Flex grow style, defaults to 0
   */
  flexGrow: PropTypes.number,
  /**
   * Flex shrink style, defaults to 1 for flexible table and 0 for fixed table
   */
  flexShrink: PropTypes.number,
  /**
   * The width of the column, gutter width is not included
   */
  width: PropTypes.number.isRequired,
  /**
   * Maximum width of the column, used if the column is resizable
   */
  maxWidth: PropTypes.number,
  /**
   * Minimum width of the column, used if the column is resizable
   */
  minWidth: PropTypes.number,
  /**
   * Whether the column is frozen and what's the frozen side
   */
  frozen: PropTypes.oneOf(['left', 'right', true, false]),
  /**
   * Whether the column is hidden
   */
  hidden: PropTypes.bool,
  /**
   * Whether the column is resizable, defaults to true
   */
  resizable: PropTypes.bool,
  /**
   * Whether the column is sortable, defaults to true
   */
  sortable: PropTypes.bool,
  /**
   * Custom column cell renderer
   * The renderer receives props `{ cellData, columns, column, columnIndex, rowData, rowIndex, container, isScrolling }`
   */
  cellRenderer: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  /**
   * Custom column header renderer
   * The renderer receives props `{ columns, column, columnIndex, headerIndex, container }`
   */
  headerRenderer: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
};

Column.Alignment = Alignment;
Column.FrozenDirection = FrozenDirection;

export default Column;
