export default class ColumnManager {
  static PlaceholderKey: string;
  constructor(columns: any[], fixed: any);
  _cache(key: string, fn: (...args: any) => any): any;
  reset(columns: any[], fixed?: boolean): void;
  resetCache(): void;
  getOriginalColumns(): any[];
  getColumns(): any;
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
  recomputeColumnsWidth(columns: any[]): number;
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
