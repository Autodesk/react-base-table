import React from 'react';
import PropTypes from 'prop-types';

import { Values } from './type-utils';

export const Alignment = {
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right',
} as const;

export type AlignmentValue = Values<typeof Alignment>;

export const FrozenDirection = {
  LEFT: 'left',
  RIGHT: 'right',
  DEFAULT: true,
  NONE: false,
} as const;

export type FrozenDirectionValue = Values<typeof FrozenDirection>;

export interface ColumnCellProps {
  cellData: any;
  columns: any[];
  column: any;
  columnIndex: number;
  rowData: any;
  rowIndex: number;
}

export interface ColumnHeaderProps {
  columns: any[];
  column: any;
  columnIndex: number;
  headerIndex: number;
}

export interface ColumnProps {
  /**
   * Class name for the column cell, could be a callback to return the class name
   * The callback is of the shape of `({ cellData, columns, column, columnIndex, rowData, rowIndex }) => string`
   */
  className?: ((args: ColumnCellProps) => string) | string;
  /**
   * Class name for the column header, could be a callback to return the class name
   * The callback is of the shape of `({ columns, column, columnIndex, headerIndex }) => string`
   */
  headerClassName?: ((args: ColumnHeaderProps) => string) | string;
  /**
   * Custom style for the column cell, including the header cells
   */
  style?: React.CSSProperties;
  /**
   * Title for the column header
   */
  title?: string;
  /**
   * Data key for the column cell, could be `a.b.c`
   */
  dataKey?: string;
  /**
   * Custom cell data getter
   * The handler is of the shape of `({ columns, column, columnIndex, rowData, rowIndex }) => node`
   */
  dataGetter?(args: Omit<ColumnCellProps, 'cellData'>): any;
  /**
   * Alignment of the column cell
   */
  align?: AlignmentValue;
  /**
   * Flex grow style, defaults to 0
   */
  flexGrow?: number;
  /**
   * Flex shrink style, defaults to 1 for flexible table and 0 for fixed table
   */
  flexShrink?: number;
  /**
   * The width of the column, gutter width is not included
   */
  width: number;
  /**
   * Maximum width of the column, used if the column is resizable
   */
  maxWidth?: number;
  /**
   * Minimum width of the column, used if the column is resizable
   */
  minWidth?: number;
  /**
   * Whether the column is frozen and what's the frozen side
   */
  frozen?: FrozenDirectionValue;
  /**
   * Whether the column is hidden
   */
  hidden?: boolean;
  /**
   * Whether the column is resizable, defaults to false
   */
  resizable?: boolean;
  /**
   * Whether the column is sortable, defaults to false
   */
  sortable?: boolean;
  /**
   * Custom column cell renderer
   * The renderer receives props `{ cellData, columns, column, columnIndex, rowData, rowIndex, container, isScrolling }`
   */
  cellRenderer?: React.ElementType<ColumnCellProps & { container: any; isScrolling: boolean }>;
  /**
   * Custom column header renderer
   * The renderer receives props `{ columns, column, columnIndex, headerIndex, container }`
   */
  headerRenderer?: React.ElementType<ColumnHeaderProps & { container: any }>;
}

/**
 * Column for BaseTable
 */
export default class Column extends React.Component<ColumnProps> {
  public static readonly Alignment = Alignment;
  public static readonly FrozenDirection = FrozenDirection;

  static propTypes = {
    className: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    headerClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    style: PropTypes.object,
    title: PropTypes.string,
    dataKey: PropTypes.string,
    dataGetter: PropTypes.func,
    align: PropTypes.oneOf(['left', 'center', 'right']),
    flexGrow: PropTypes.number,
    flexShrink: PropTypes.number,
    width: PropTypes.number.isRequired,
    maxWidth: PropTypes.number,
    minWidth: PropTypes.number,
    frozen: PropTypes.oneOf(['left', 'right', true, false]),
    hidden: PropTypes.bool,
    resizable: PropTypes.bool,
    sortable: PropTypes.bool,
    cellRenderer: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
    headerRenderer: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  };
}
