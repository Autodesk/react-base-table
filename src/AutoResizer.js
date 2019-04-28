import React from 'react';
import PropTypes from 'prop-types';
import AutoSizer from 'react-virtualized-auto-sizer';

/**
 * Decorator component that automatically adjusts the width and height of a single child
 */
const AutoResizer = ({ className, width, height, children, onResize }) => {
  const disableWidth = typeof width === 'number';
  const disableHeight = typeof height === 'number';

  if (disableWidth && disableHeight) {
    return (
      <div className={className} style={{ width, height, position: 'relative' }}>
        {children({ width, height })}
      </div>
    );
  }

  return (
    <AutoSizer className={className} disableWidth={disableWidth} disableHeight={disableHeight} onResize={onResize}>
      {size =>
        children({
          width: disableWidth ? width : size.width,
          height: disableHeight ? height : size.height,
        })
      }
    </AutoSizer>
  );
};

AutoResizer.propTypes = {
  /**
   * Class name for the component
   */
  className: PropTypes.string,
  /**
   * the width of the component, will be the container's width if not set
   */
  width: PropTypes.number,
  /**
   * the height of the component, will be the container's width if not set
   */
  height: PropTypes.number,
  /**
   * A callback function to render the children component
   * The handler is of the shape of `({ width, height }) => node`
   */
  children: PropTypes.func.isRequired,
  /**
   * A callback function when the size of the table container changed if the width and height are not set
   * The handler is of the shape of `({ width, height }) => *`
   */
  onResize: PropTypes.func,
};

export default AutoResizer;
