import React from 'react';
import PropTypes from 'prop-types';
import { Values, renderElement } from './utils';
export declare type AlignmentValue = Values<typeof Alignment>;
export declare type FrozenDirectionValue = Values<typeof FrozenDirection>;
declare type ClassNameFunc<T = any> = ((args: T) => string) | string;
export declare const Alignment: {
    readonly LEFT: "left";
    readonly CENTER: "center";
    readonly RIGHT: "right";
};
export declare const FrozenDirection: {
    readonly LEFT: "left";
    readonly RIGHT: "right";
    readonly DEFAULT: true;
    readonly NONE: false;
};
export interface BaseColumnProps {
    /**
     * Class name for the column cell, could be a callback to return the class name
     * The callback is of the shape of `({ cellData, columns, column, columnIndex, rowData, rowIndex }) => string`
     */
    className?: ClassNameFunc<{
        cellData: any;
        columns: any[];
        column: any;
        columnIndex: number;
        rowData: any;
        rowIndex: number;
    }>;
    /**
     * Class name for the column header, could be a callback to return the class name
     * The callback is of the shape of `({ columns, column, columnIndex, headerIndex }) => string`
     */
    headerClassName?: ClassNameFunc<any>;
    /**
     * Custom style for the column cell, including the header cells
     */
    style?: React.CSSProperties;
    /**
     * Title for the column header
     */
    title?: string;
    /**
     * Data key for the column cell, could be "a.b.c"
     */
    dataKey?: string;
    /**
     * Custom cell data getter
     * The handler is of the shape of `({ columns, column, columnIndex, rowData, rowIndex }) => node`
     */
    dataGetter?: ({ columns, column, columnIndex, rowData, rowIndex }: any) => any;
    /**
     * Alignment of the column cell
     */
    align?: AlignmentValue;
    /**
     * Flex grow style, defaults to 0
     */
    flexGrow?: number;
    /**
     * Flex shrink style, defaults to 1 for flexible table and 0 for fixed table
     */
    flexShrink?: number;
    /**
     * The width of the column, gutter width is not included
     */
    width: number;
    /**
     * Maximum width of the column, used if the column is resizable
     */
    maxWidth?: number;
    /**
     * Minimum width of the column, used if the column is resizable
     */
    minWidth?: number;
    /**
     * Whether the column is frozen and what's the frozen side
     */
    frozen?: FrozenDirectionValue;
    /**
     * Whether the column is hidden
     */
    hidden?: boolean;
    /**
     * Whether the column is resizable, defaults to true
     */
    resizable?: boolean;
    /**
     * Whether the column is sortable, defaults to true
     */
    sortable?: boolean;
    /**
     * Custom column cell renderer
     * The renderer receives props `{ cellData, columns, column, columnIndex, rowData, rowIndex, container, isScrolling }`
     */
    cellRenderer?: Parameters<typeof renderElement>[0];
    /**
     * Custom column header renderer
     * The renderer receives props `{ columns, column, columnIndex, headerIndex, container }`
     */
    headerRenderer?: Parameters<typeof renderElement>[0];
}
/**
 * Column for BaseTable
 */
export default class Column extends React.Component<BaseColumnProps> {
    static readonly Alignment: {
        readonly LEFT: "left";
        readonly CENTER: "center";
        readonly RIGHT: "right";
    };
    static readonly FrozenDirection: {
        readonly LEFT: "left";
        readonly RIGHT: "right";
        readonly DEFAULT: true;
        readonly NONE: false;
    };
    static propTypes: {
        /**
         * Class name for the column cell, could be a callback to return the class name
         * The callback is of the shape of `({ cellData, columns, column, columnIndex, rowData, rowIndex }) => string`
         */
        className: PropTypes.Requireable<string | ((...args: any[]) => any)>;
        /**
         * Class name for the column header, could be a callback to return the class name
         * The callback is of the shape of `({ columns, column, columnIndex, headerIndex }) => string`
         */
        headerClassName: PropTypes.Requireable<string | ((...args: any[]) => any)>;
        /**
         * Custom style for the column cell, including the header cells
         */
        style: PropTypes.Requireable<object>;
        /**
         * Title for the column header
         */
        title: PropTypes.Requireable<string>;
        /**
         * Data key for the column cell, could be "a.b.c"
         */
        dataKey: PropTypes.Requireable<string>;
        /**
         * Custom cell data getter
         * The handler is of the shape of `({ columns, column, columnIndex, rowData, rowIndex }) => node`
         */
        dataGetter: PropTypes.Requireable<(...args: any[]) => any>;
        /**
         * Alignment of the column cell
         */
        align: PropTypes.Requireable<string>;
        /**
         * Flex grow style, defaults to 0
         */
        flexGrow: PropTypes.Requireable<number>;
        /**
         * Flex shrink style, defaults to 1 for flexible table and 0 for fixed table
         */
        flexShrink: PropTypes.Requireable<number>;
        /**
         * The width of the column, gutter width is not included
         */
        width: PropTypes.Validator<number>;
        /**
         * Maximum width of the column, used if the column is resizable
         */
        maxWidth: PropTypes.Requireable<number>;
        /**
         * Minimum width of the column, used if the column is resizable
         */
        minWidth: PropTypes.Requireable<number>;
        /**
         * Whether the column is frozen and what's the frozen side
         */
        frozen: PropTypes.Requireable<string | boolean>;
        /**
         * Whether the column is hidden
         */
        hidden: PropTypes.Requireable<boolean>;
        /**
         * Whether the column is resizable, defaults to true
         */
        resizable: PropTypes.Requireable<boolean>;
        /**
         * Whether the column is sortable, defaults to true
         */
        sortable: PropTypes.Requireable<boolean>;
        /**
         * Custom column cell renderer
         * The renderer receives props `{ cellData, columns, column, columnIndex, rowData, rowIndex, container, isScrolling }`
         */
        cellRenderer: PropTypes.Requireable<string | ((props: any, context?: any) => any) | (new (props: any, context?: any) => any) | PropTypes.ReactElementLike>;
        /**
         * Custom column header renderer
         * The renderer receives props `{ columns, column, columnIndex, headerIndex, container }`
         */
        headerRenderer: PropTypes.Requireable<string | ((props: any, context?: any) => any) | (new (props: any, context?: any) => any) | PropTypes.ReactElementLike>;
    };
}
export {};
