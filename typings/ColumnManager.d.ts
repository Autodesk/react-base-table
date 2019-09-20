export default class ColumnManager {
    static PlaceholderKey: string;
    _origColumns: any[];
    _cached: any;
    _columns?: any[];
    _fixed: any;
    _columnStyles: any;
    constructor(columns: any[], fixed: any);
    _cache(key: string, fn: Function): any;
    reset(columns: any[], fixed: boolean): void;
    resetCache(): void;
    getOriginalColumns(): any[];
    getColumns(): any[] | undefined;
    getVisibleColumns(): any;
    hasFrozenColumns(): any;
    hasLeftFrozenColumns(): any;
    hasRightFrozenColumns(): any;
    getMainColumns(): any;
    getLeftFrozenColumns(): any;
    getRightFrozenColumns(): any;
    getColumn(key: any): any;
    getColumnsWidth(): any;
    getLeftFrozenColumnsWidth(): any;
    getRightFrozenColumnsWidth(): any;
    recomputeColumnsWidth(columns: any[]): any;
    setColumnWidth(key: any, width: any): void;
    getColumnStyle(key: string | number): any;
    getColumnStyles(): any;
    recomputeColumnStyle(column: {
        flexGrow: number;
        flexShrink: number;
        style: any;
        width: any;
        maxWidth: any;
        minWidth: any;
    }): any;
    recomputeColumnStyles(): any;
}
