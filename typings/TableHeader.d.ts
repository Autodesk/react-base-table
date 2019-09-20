import React from 'react';
import PropTypes from 'prop-types';
import { fn } from './utils';
export interface TableHeaderProps<T = any> {
    className?: string;
    width: number;
    height: number;
    headerHeight: number | number[];
    rowWidth: number;
    rowHeight: number;
    columns: T[];
    data: any[];
    frozenData?: any[];
    headerRenderer: fn;
    rowRenderer: fn;
}
export default class TableHeader<T = any> extends React.PureComponent<TableHeaderProps<T>> {
    static propTypes: {
        className: PropTypes.Requireable<string>;
        width: PropTypes.Validator<number>;
        height: PropTypes.Validator<number>;
        headerHeight: PropTypes.Validator<number | (number | null | undefined)[]>;
        rowWidth: PropTypes.Validator<number>;
        rowHeight: PropTypes.Validator<number>;
        columns: PropTypes.Validator<(object | null | undefined)[]>;
        data: PropTypes.Validator<(object | null | undefined)[]>;
        frozenData: PropTypes.Requireable<(object | null | undefined)[]>;
        headerRenderer: PropTypes.Validator<(...args: any[]) => any>;
        rowRenderer: PropTypes.Validator<(...args: any[]) => any>;
    };
    headerRef: any;
    constructor(props: Readonly<TableHeaderProps>);
    scrollTo(offset: any): void;
    renderHeaderRow(height: number, index: any): any;
    renderFrozenRow(rowData: any, index: number): any;
    render(): JSX.Element | null;
    _setRef(ref: any): void;
}
