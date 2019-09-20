import React from 'react';
import PropTypes from 'prop-types';
import { fn } from './utils';
export interface GridTableProps<T = any> {
    containerStyle?: React.CSSProperties;
    classPrefix?: string;
    className?: string;
    width: number;
    height: number;
    headerHeight: number | number[];
    headerWidth: number;
    bodyWidth: number;
    rowHeight: number;
    columns: T[];
    data: any[];
    rowKey: string | number;
    frozenData?: any[];
    useIsScrolling?: boolean;
    overscanRowCount?: number;
    hoveredRowKey?: string | number;
    style?: React.CSSProperties;
    onScrollbarPresenceChange?: fn;
    onScroll?: fn;
    onRowsRendered?: fn;
    headerRenderer: fn;
    rowRenderer: fn;
}
/**
 * A wrapper of the Grid for internal only
 */
export default class GridTable extends React.PureComponent<GridTableProps> {
    static propTypes: {
        containerStyle: PropTypes.Requireable<object>;
        classPrefix: PropTypes.Requireable<string>;
        className: PropTypes.Requireable<string>;
        width: PropTypes.Validator<number>;
        height: PropTypes.Validator<number>;
        headerHeight: PropTypes.Validator<number | (number | null | undefined)[]>;
        headerWidth: PropTypes.Validator<number>;
        bodyWidth: PropTypes.Validator<number>;
        rowHeight: PropTypes.Validator<number>;
        columns: PropTypes.Validator<(object | null | undefined)[]>;
        data: PropTypes.Validator<(object | null | undefined)[]>;
        rowKey: PropTypes.Validator<string | number>;
        frozenData: PropTypes.Requireable<(object | null | undefined)[]>;
        useIsScrolling: PropTypes.Requireable<boolean>;
        overscanRowCount: PropTypes.Requireable<number>;
        hoveredRowKey: PropTypes.Requireable<string | number>;
        style: PropTypes.Requireable<object>;
        onScrollbarPresenceChange: PropTypes.Requireable<(...args: any[]) => any>;
        onScroll: PropTypes.Requireable<(...args: any[]) => any>;
        onRowsRendered: PropTypes.Requireable<(...args: any[]) => any>;
        headerRenderer: PropTypes.Validator<(...args: any[]) => any>;
        rowRenderer: PropTypes.Validator<(...args: any[]) => any>;
    };
    headerRef: any;
    bodyRef: any;
    constructor(props: Readonly<GridTableProps>);
    forceUpdateTable(): void;
    scrollToPosition(args: {
        scrollLeft: any;
    }): void;
    scrollToTop(scrollTop: any): void;
    scrollToLeft(scrollLeft: any): void;
    scrollToRow(rowIndex?: number, align?: string): void;
    renderRow(args: any): any;
    render(): JSX.Element;
    _setHeaderRef(ref: any): void;
    _setBodyRef(ref: any): void;
    _itemKey({ rowIndex }: any): any;
    _getHeaderHeight(): number;
    _handleItemsRendered({ overscanRowStartIndex, overscanRowStopIndex, visibleRowStartIndex, visibleRowStopIndex, }: any): void;
}
