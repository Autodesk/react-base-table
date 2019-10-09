import React from 'react';
import PropTypes from 'prop-types';
import { renderElement, fn } from './utils';
export interface TableRowProps<T = any> {
    isScrolling?: boolean;
    className?: string;
    style?: React.CSSProperties;
    columns: T[];
    rowData: any;
    rowIndex: number;
    rowKey?: string | number;
    expandColumnKey?: string;
    depth?: number;
    rowEventHandlers?: object;
    rowRenderer?: Parameters<typeof renderElement>[0];
    cellRenderer?: fn;
    expandIconRenderer?: fn;
    onRowHover?: fn;
    onRowExpand?: fn;
    tagName?: PropTypes.ReactComponentLike;
}
/**
 * Row component for BaseTable
 */
export default class TableRow extends React.PureComponent<TableRowProps> {
    static defaultProps: {
        tagName: string;
    };
    static propTypes: {
        isScrolling: PropTypes.Requireable<boolean>;
        className: PropTypes.Requireable<string>;
        style: PropTypes.Requireable<object>;
        columns: PropTypes.Validator<(object | null | undefined)[]>;
        rowData: PropTypes.Validator<object>;
        rowIndex: PropTypes.Validator<number>;
        rowKey: PropTypes.Requireable<string | number>;
        expandColumnKey: PropTypes.Requireable<string>;
        depth: PropTypes.Requireable<number>;
        rowEventHandlers: PropTypes.Requireable<object>;
        rowRenderer: PropTypes.Requireable<string | ((props: any, context?: any) => any) | (new (props: any, context?: any) => any) | PropTypes.ReactElementLike>;
        cellRenderer: PropTypes.Requireable<(...args: any[]) => any>;
        expandIconRenderer: PropTypes.Requireable<(...args: any[]) => any>;
        onRowHover: PropTypes.Requireable<(...args: any[]) => any>;
        onRowExpand: PropTypes.Requireable<(...args: any[]) => any>;
        tagName: PropTypes.Requireable<PropTypes.ReactComponentLike>;
    };
    constructor(props: Readonly<TableRowProps>);
    render(): JSX.Element;
    _handleExpand(expanded: any): void;
    _getEventHandlers(handlers?: any): any;
}
