import * as React from 'react';

export interface IAutoResizerProps {
  /**
   * Class name for the component
   */
  className?: string;
  /**
   * the width of the component, will be the container's width if not set
   */
  width?: number;
  /**
   * the height of the component, will be the container's width if not set
   */
  height?: number;
  /**
   * A callback function to render the children component
   * The handler is of the shape of `({ width, height }) => node`
   */
  children: (props: { width: number; height: number }) => React.ReactNode;
  /**
   * A callback function when the size of the table container changed if the width and height are not set
   * The handler is of the shape of `({ width, height }) => *`
   */
  onResize?(props: { width: number; height: number }): void;
}

declare const AutoResizer: React.FunctionComponent<IAutoResizerProps>;
export default AutoResizer;
