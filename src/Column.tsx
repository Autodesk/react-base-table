import React from 'react';
import PropTypes from 'prop-types';

import { Values, renderElement } from './utils';

export type AlignmentValue = Values<typeof Alignment>;
export type FrozenDirectionValue = Values<typeof FrozenDirection>;

type ClassNameFunc<T = any> = ((args: T) => string) | string;

export const Alignment = {
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right',
} as const;

export const FrozenDirection = {
  LEFT: 'left',
  RIGHT: 'right',
  DEFAULT: true,
  NONE: false,
} as const;

export interface BaseColumnProps {
  /**
   * Class name for the column cell, could be a callback to return the class name
   * The callback is of the shape of `({ cellData, columns, column, columnIndex, rowData, rowIndex }) => string`
   */
  className?: ClassNameFunc<{
    cellData: any;
    columns: any[];
    column: any;
    columnIndex: number;
    rowData: any;
    rowIndex: number;
  }>;
  /**
   * Class name for the column header, could be a callback to return the class name
   * The callback is of the shape of `({ columns, column, columnIndex, headerIndex }) => string`
   */
  headerClassName?: ClassNameFunc<any>;
  /**
   * Custom style for the column cell, including the header cells
   */
  style?: React.CSSProperties;
  /**
   * Title for the column header
   */
  title?: string;
  /**
   * Data key for the column cell, could be "a.b.c"
   */
  dataKey?: string;
  /**
   * Custom cell data getter
   * The handler is of the shape of `({ columns, column, columnIndex, rowData, rowIndex }) => node`
   */
  dataGetter?: ({ columns, column, columnIndex, rowData, rowIndex }: any) => any;
  /**
   * Alignment of the column cell
   */
  align?: AlignmentValue; // PropTypes.oneOf(['left', 'center', 'right']),
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
  frozen?: FrozenDirectionValue; // PropTypes.oneOf(['left', 'right', true, false]),
  /**
   * Whether the column is hidden
   */
  hidden?: boolean;
  /**
   * Whether the column is resizable, defaults to true
   */
  resizable?: boolean;
  /**
   * Whether the column is sortable, defaults to true
   */
  sortable?: boolean;
  /**
   * Custom column cell renderer
   * The renderer receives props `{ cellData, columns, column, columnIndex, rowData, rowIndex, container, isScrolling }`
   */
  cellRenderer?: Parameters<typeof renderElement>[0]; // PropTypes.oneOfType([PropTypes.elementType, PropTypes.element]),
  /**
   * Custom column header renderer
   * The renderer receives props `{ columns, column, columnIndex, headerIndex, container }`
   */
  headerRenderer?: Parameters<typeof renderElement>[0];
}

/**
 * Column for BaseTable
 */
export default class Column extends React.Component<BaseColumnProps> {
  public static readonly Alignment = Alignment;
  public static readonly FrozenDirection = FrozenDirection;

  static propTypes = {
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
    cellRenderer: PropTypes.oneOfType([PropTypes.elementType, PropTypes.element]),
    /**
     * Custom column header renderer
     * The renderer receives props `{ columns, column, columnIndex, headerIndex, container }`
     */
    headerRenderer: PropTypes.oneOfType([PropTypes.elementType, PropTypes.element]),
  };
}
