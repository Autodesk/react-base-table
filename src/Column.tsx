import React from 'react';

export enum Alignment {
  LEFT = 'left',
  CENTER = 'center',
  RIGHT = 'right',
}

export const FrozenDirection = {
  LEFT: 'left',
  RIGHT: 'right',
  DEFAULT: true,
  NONE: false,
};

/**
 * Column for BaseTable
 */
class Column extends React.Component<IColumnProps> {
  public static Alignment = Alignment;
  public static FrozenDirection = FrozenDirection;
}

export interface IColumnEssential {
  columns?: IColumnProps[];
  column?: IColumnProps;
  columnIndex?: number;
}

export interface RowDataType {
  [key: string]: any;
}
export interface IRowEssential<T = RowDataType> {
  rowData?: T;
  rowIndex?: number;
}

export type IColumnCallback<T> = (param: T) => string;
export type IColumnRenderCallback<T> = (param: T) => React.ReactElement;

export interface IClassNameCBParam<T = RowDataType> extends IColumnEssential, IRowEssential<T> {
  cellData: any;
}

export interface IHeaderClassNameCBParam extends IColumnEssential {
  headerIndex: number;
}

export interface IDataGetterCBParam<T = RowDataType> extends IColumnEssential, IRowEssential<T> {}

export interface IHeaderRendererCBParam extends IColumnEssential {
  headerIndex?: number;
  container?: any;
  style?: React.CSSProperties;
}

export interface ICellRendererCBParam<T = RowDataType> extends IColumnEssential, IRowEssential<T> {
  cellData?: any;
  container?: any;
  isScrolling?: boolean;
  headerIndex?: number;
  expandIcon?: React.ReactNode;
}

export interface IColumnProps<T = any> {
  /**
   * Class name for the column cell, could be a callback to return the class name
   * The callback is of the shape of `({ cellData, columns, column, columnIndex, rowData, rowIndex }) => string`
   */
  className?: string | IColumnCallback<IClassNameCBParam<T>>;
  /**
   * Class name for the column header, could be a callback to return the class name
   * The callback is of the shape of `({ columns, column, columnIndex, headerIndex }) => string`
   */
  headerClassName?: string | IColumnCallback<IHeaderClassNameCBParam>;
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
  dataGetter?: IColumnCallback<IDataGetterCBParam<T>>;
  /**
   * Alignment of the column cell
   */
  align?: Alignment.LEFT | Alignment.CENTER | Alignment.RIGHT;
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
  frozen?: 'left' | 'right' | boolean;
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
  cellRenderer?: IColumnRenderCallback<ICellRendererCBParam<T>> | React.ElementType;
  /**
   * Custom column header renderer
   * The renderer receives props `{ columns, column, columnIndex, headerIndex, container }`
   */
  headerRenderer?: IColumnRenderCallback<IHeaderRendererCBParam> | React.ReactElement;
  /**
   * Key
   */
  key?: React.Key;
  /**
   * placeholder key
   */
  __placeholder__?: boolean;
}

export default Column;
