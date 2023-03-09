import React from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
// console.log('AutoSizer', AutoSizer)
interface AutoResizerProps {
    className: string;
    width: number;
    height: number;
    children: any;
    onResize: (params: { height: number; width: number; [key: string]: any }) => void;
}

/**
 * Decorator component that automatically adjusts the width and height of a single child
 */
const AutoResizer = ({ className, width, height, children, onResize }: AutoResizerProps) => {
    const disableWidth = typeof width === 'number';
    const disableHeight = typeof height === 'number';

    if (disableWidth && disableHeight) {
        return (
            <div className={className} style={{ width, height, position: 'relative' }}>
                {children({ width, height })}
            </div>
        );
    }
    // console.log('AutoResizer', AutoSizer)
    return (
        // <div style={{minHeight: height}}>
        <AutoSizer className={className} disableWidth={!!disableWidth} disableHeight={true} onResize={onResize}>
            {(size) =>
                children({
                    width: disableWidth ? width : size.width,
                    height: disableHeight ? height : size.height
                })
            }
        </AutoSizer>
        // </div>
    );
};

export default AutoResizer;
