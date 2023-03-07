import React from 'react';

export const Alignment = {
    LEFT: 'left',
    CENTER: 'center',
    RIGHT: 'right'
} as const;

export const FrozenDirection = {
    LEFT: 'left',
    RIGHT: 'right',
    DEFAULT: true,
    NONE: false
} as const;
interface ClassNameParams {
    cellData: any;
    columns: any[];
    column: any;
    columnIndex: number;
    rowData: any;
    rowIndex: number;
}
type ClassName = (params: ClassNameParams) => string;
interface ColumnProps {
    /**
     * Class name for the column cell, could be a callback to return the class name
     * The callback is of the shape of `({ cellData, columns, column, columnIndex, rowData, rowIndex }) => string`
     */
    className?: string | ClassName;
    /**
     * Class name for the column header, could be a callback to return the class name
     * The callback is of the shape of `({ columns, column, columnIndex, headerIndex }) => string`
     */
    headerClassName?: string | ClassName;
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
    dataGetter?: (params: any) => any;
    /**
     * Alignment of the column cell
     */
    align?: 'left' | 'center' | 'right';
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
    frozen?: 'left' | 'right' | true | false;
    /**
     * Whether the column is hidden
     */
    hidden?: boolean;
    /**
     * Whether the column is resizable, defaults to false
     */
    resizable?: boolean;
    /**
     * Whether the column is sortable, defaults to false
     */
    sortable?: boolean;
    /**
     * Custom column cell renderer
     * The renderer receives props `{ cellData, columns, column, columnIndex, rowData, rowIndex, container, isScrolling }`
     */
    cellRenderer?: any;
    /**
     * Custom column header renderer
     * The renderer receives props `{ columns, column, columnIndex, headerIndex, container }`
     */
    headerRenderer?: any;
}
/**
 * Column for BaseTable
 */
class Column extends React.Component<ColumnProps, any> {
    static Alignment = Alignment;
    static FrozenDirection = FrozenDirection;
}

Column.Alignment = Alignment;
Column.FrozenDirection = FrozenDirection;

export default Column;
