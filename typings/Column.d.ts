import * as React from 'react';

export const Alignment: {
  readonly LEFT: 'left';
  readonly CENTER: 'center';
  readonly RIGHT: 'right';
};

export const FrozenDirection: {
  readonly LEFT: 'left';
  readonly RIGHT: 'right';
  readonly DEFAULT: true;
  readonly NONE: false;
};

export type FrozenDirectionValue = typeof FrozenDirection[keyof typeof FrozenDirection];
export type AlignmentValue = typeof Alignment[keyof typeof Alignment];

type ClassNameFunc<T = any> = ((args: T) => string) | string;

export interface IColumnCellRendererProps {
  cellData: any;
  columns: any[];
  column: any;
  columnIndex: number;
  rowData: any;
  rowIndex: number;
  container: any;
  isScrolling: boolean;
}

export interface IColumnHeaderRendererProps {
  columns: any[];
  column: any;
  columnIndex: number;
  headerIndex: number;
  container: any;
}

export interface IColumnProps {
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
  headerClassName?: ClassNameFunc<{ columns: any[]; column: any; columnIndex: number; headerIndex: number }>;
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
  dataGetter?: (props: { columns: any[]; column: any; columnIndex: number; rowData: any; rowIndex: number }) => any;
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
  cellRenderer?: React.ReactElement<IColumnCellRendererProps> | React.ReactElement; // PropTypes.oneOfType([PropTypes.elementType, PropTypes.element]),
  /**
   * Custom column header renderer
   * The renderer receives props `{ columns, column, columnIndex, headerIndex, container }`
   */
  headerRenderer?: React.ReactElement<IColumnHeaderRendererProps> | React.ReactElement;
}

export default class Column extends React.Component<IColumnProps> {
  public static readonly Alignment: typeof Alignment;
  public static readonly FrozenDirection: typeof FrozenDirection;
}
