import React from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';

import type { AutoResizerProps } from './types';

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
    <AutoSizer
      className={className}
      disableWidth={disableWidth as any}
      disableHeight={disableHeight as any}
      onResize={onResize}
    >
      {(size: { width: number; height: number }) =>
        children({
          width: disableWidth ? width! : size.width,
          height: disableHeight ? height! : size.height,
        })
      }
    </AutoSizer>
  );
};

export default AutoResizer;
