import * as React from 'react';

export function addUserSelectStyles(doc: any): void;
export function removeUserSelectStyles(doc: any): void;

export interface IColumnResizerProps<T = any> {
  className?: string;
  /**
   * Custom style for the drag handler
   */
  style?: React.CSSProperties;
  /**
   * The column object to be dragged
   */
  column?: T;
  /**
   * A callback function when resizing started
   * The callback is of the shape of `(column) => *`
   */
  onResizeStart?: (column: T) => void;
  /**
   * A callback function when resizing the column
   * The callback is of the shape of `(column, width) => *`
   */
  onResize?: (column: T, width: number) => void;
  /**
   * A callback function when resizing stopped
   * The callback is of the shape of `(column) => *`
   */
  onResizeStop?: (column: T) => void;
  /**
   * Minimum width of the column could be resized to if the column's `minWidth` is not set
   */
  minWidth?: number;
}

/**
 * ColumnResizer for BaseTable
 */
export default class ColumnResizer extends React.PureComponent<IColumnResizerProps> {}
