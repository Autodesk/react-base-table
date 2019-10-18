import React from 'react';
import PropTypes from 'prop-types';
import AutoSizer, { Size } from 'react-virtualized-auto-sizer';

export interface AutoResizerProps {
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
  children: (size: Size) => React.ReactNode;
  /**
   * A callback function when the size of the table container changed if the width and height are not set
   * The handler is of the shape of `({ width, height }) => *`
   */
  onResize?: (size: Size) => void;
}

/**
 * Decorator component that automatically adjusts the width and height of a single child
 */
const AutoResizer: React.FC<AutoResizerProps> = ({ className, width, height, children, onResize }) => {
  const disableWidth = typeof width === 'number';
  const disableHeight = typeof height === 'number';

  if (disableWidth && disableHeight) {
    return (
      <div className={className} style={{ width, height, position: 'relative' }}>
        {children({ width: width!, height: height! })}
      </div>
    );
  }

  return (
    <AutoSizer className={className} disableWidth={disableWidth} disableHeight={disableHeight} onResize={onResize}>
      {size =>
        children({
          width: (disableWidth ? width : size.width)!,
          height: (disableHeight ? height : size.height)!,
        })
      }
    </AutoSizer>
  );
};

AutoResizer.propTypes = {
  className: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  children: PropTypes.func.isRequired,
  onResize: PropTypes.func,
};

export default AutoResizer;
