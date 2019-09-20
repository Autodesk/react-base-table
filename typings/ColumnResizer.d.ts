import React from 'react';
import PropTypes from 'prop-types';
import { noop } from './utils';
export declare function addUserSelectStyles(doc: Document): void;
export declare function removeUserSelectStyles(doc: Document): void;
interface ColumnData {
    width: number;
    maxWidth: number;
    minWidth?: number;
}
export interface ColumnResizerProps<T extends ColumnData = any> {
    className?: string;
    /**
     * Custom style for the drag handler
     */
    style?: React.CSSProperties;
    /**
     * The column object to be dragged
     */
    column?: T & ColumnData;
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
export default class ColumnResizer<T extends ColumnData = any> extends React.PureComponent<ColumnResizerProps<T>> {
    static propTypes: {
        /**
         * Custom style for the drag handler
         */
        style: PropTypes.Requireable<object>;
        /**
         * The column object to be dragged
         */
        column: PropTypes.Requireable<object>;
        /**
         * A callback function when resizing started
         * The callback is of the shape of `(column) => *`
         */
        onResizeStart: PropTypes.Requireable<(...args: any[]) => any>;
        /**
         * A callback function when resizing the column
         * The callback is of the shape of `(column, width) => *`
         */
        onResize: PropTypes.Requireable<(...args: any[]) => any>;
        /**
         * A callback function when resizing stopped
         * The callback is of the shape of `(column) => *`
         */
        onResizeStop: PropTypes.Requireable<(...args: any[]) => any>;
        /**
         * Minimum width of the column could be resized to if the column's `minWidth` is not set
         */
        minWidth: PropTypes.Requireable<number>;
    };
    static defaultProps: {
        onResizeStart: typeof noop;
        onResize: typeof noop;
        onResizeStop: typeof noop;
        minWidth: number;
    };
    isDragging: boolean;
    lastX: number | null;
    width: number;
    handleRef: any;
    constructor(props: any);
    componentWillUnmount(): void;
    render(): JSX.Element;
    _setHandleRef(ref: any): void;
    _handleClick(e: React.MouseEvent): void;
    _handleMouseDown(e: React.MouseEvent): void;
    _handleMouseUp(e: React.MouseEvent): void;
    _handleTouchStart(e: any): void;
    _handleTouchEnd(e: React.TouchEvent): void;
    _handleDragStart(e: React.MouseEvent): void;
    _handleDragStop(_e: any): void;
    _handleDrag(e: any): void;
}
export {};
